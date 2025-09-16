import logging
import os
import subprocess
from pathlib import Path
from queue import Queue
from uuid import UUID, uuid4

from file_extension_handler import FileType, PipelineEntryStage
from schemas import JobEntity, JobOptionsModel, JobStatusModel, JobStep

logger = logging.getLogger(__name__)


class JobManager:
    def __init__(self):
        self.__jobs: dict[UUID, JobEntity] = {}


    async def create_job(self):
        job_id = uuid4()
        queue = Queue()
        self.__jobs[job_id] = JobEntity(
            current_status=JobStatusModel(
                step=JobStep.INITIAL_QUALITY_CONTROL,
                logs=[],
                generated_files=[],
            ),
            status_queue=queue,
        ) 
        return job_id



    async def process(
        self,
        job_id: UUID,
        stage: PipelineEntryStage,
        file_type_to_paths: dict[FileType, list[str]],
        output_dir: str,
        options: JobOptionsModel | None = None,
    ):
        job = self.__jobs[job_id]
        job.current_status.logs.append("INFO: Starting fastqc initial analysis")
        logger.info(job.current_status.logs[-1])

        quality_control_dir = Path(output_dir) / "quality_control"

        try:
            quality_control_dir.mkdir(parents=True, exist_ok=True)
        except Exception:
            logger.error("ERROR: An unexpected error happened")


        cmd = [
            "fastqc", 
            "-o", 
            str(quality_control_dir),
        ] + file_type_to_paths[FileType.READ]

        res = subprocess.run(cmd, capture_output=True, text=True)

        if res.returncode != 0:
            job.current_status.logs.append(
                "ERROR: FastQC failed\n" + res.stderr,
            )
            logger.error(job.current_status.logs[-1])
            return

        for f in os.listdir(quality_control_dir):
            fp = os.path.join(quality_control_dir, f)
            if fp not in job.current_status.generated_files:
                job.current_status.generated_files.append(fp)

        job.current_status.logs.append("INFO: FastQC finished")
        logger.info(job.current_status.logs[-1])

    async def get_status(self, job_id: UUID):
        return self.__jobs.get(job_id)

