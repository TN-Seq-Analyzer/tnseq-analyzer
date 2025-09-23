import logging
import os
import re
import shutil
import subprocess
from copy import deepcopy
from pathlib import Path
from queue import Queue
from typing import Callable, Literal, TypedDict
from uuid import UUID, uuid4

from file_extension_handler import FileType, PipelineEntryStage
from schemas import (
    AlignmentOptionsModel,
    JobOptionsModel,
    JobStatusDataModel,
    JobStatusModel,
    JobStep,
    QualityControlOptionsModel,
    TrimmerType,
    TrimmingOptionsModel,
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class JobEntity(TypedDict):
    current_status: JobStatusModel
    status_queue: Queue


class JobManager:
    def __init__(self):
        self.__jobs: dict[UUID, JobEntity] = {}

    async def create_job(self) -> UUID:
        job_id = uuid4()
        queue = Queue()
        self.__jobs[job_id] = {
            "current_status": JobStatusModel(
                success=True,
                data=JobStatusDataModel(),
            ),
            "status_queue": queue,
        }
        return job_id

    def __update_status(
        self,
        log_message: str,
        job: JobEntity,
        log_function: Callable,
        success: bool = True,
        step: JobStep | None = None,
        progress: float | None = None,
    ):
        job["current_status"].data.logs.append(log_message)
        job["current_status"].success = success
        if step:
            job["current_status"].data.step = step
        if progress:
            job["current_status"].data.progress = progress
        job["status_queue"].put(deepcopy(job["current_status"]))
        log_function(log_message)

    def __run_fastqc(
        self,
        file_paths: list[str],
        output_dir: str,
        stage: Literal["final", "initial"],
        job: JobEntity,
        progress: float,
        options: QualityControlOptionsModel | None = None,
    ):
        self.__update_status(
            f"INFO: Starting fastqc {stage} analysis",
            job,
            logger.info,
        )

        quality_control_dir = Path(output_dir) / "quality_control" / stage

        try:
            quality_control_dir.mkdir(parents=True, exist_ok=True)
        except Exception:
            self.__update_status(
                "ERROR: An unexpected error happened",
                job,
                logger.error,
                False,
            )

        cmd = [
            "fastqc",
            "-o",
            str(quality_control_dir),
        ] + file_paths

        if options:
            cmd.extend(options.params)

        self.__update_status(
            "INFO: Processing " + " ".join(file_paths),
            job,
            logger.info,
        )
        res = subprocess.run(cmd, capture_output=True, text=True)

        if res.returncode != 0:
            self.__update_status(
                "ERROR: FastQC failed: "
                f"stdout:\n{res.stdout}\n"
                f"stderr:\n{res.stderr}",
                job,
                logger.error,
                False,
            )
            return

        for f in os.listdir(quality_control_dir):
            fp = os.path.join(quality_control_dir, f)
            if fp not in job["current_status"].data.generated_files:
                job["current_status"].data.generated_files.append(fp)

        job["current_status"].data.results

        self.__update_status(
            "INFO: FastQC finished\n"
            f"stdout:\n{res.stdout}\n"
            f"stderr:\n{res.stderr}",
            job,
            logger.info,
            progress=progress,
        )

    def __parse_cutadapt_log(self, log: str) -> dict:
        stats = {}
        patterns = {
            "total_reads": (
                r"Total reads processed:"
                r"\s+([\d,]+)"
            ),
            "reads_with_adapters": (
                r"Reads with adapters:"
                r"\s+([\d,]+) \(([\d.]+)%"
            ),
            "reads_written": (
                r"Reads written \(passing filters\):"
                r"\s+([\d,]+) \(([\d.]+)%"
            ),
            "total_bp": (
                r"Total basepairs processed:"
                r"\s+([\d,]+)"
            ),
            "written_bp": (
                r"Total written \(filtered\):"
                r"\s+([\d,]+) \(([\d.]+)%"
            ),
        }

        for key, pattern in patterns.items():
            match = re.search(pattern, log)
            if match:
                if len(match.groups()) == 1:
                    stats[key] = int(match.group(1).replace(",", ""))
                elif len(match.groups()) == 2:
                    stats[key] = {
                        "count": int(match.group(1).replace(",", "")),
                        "percent": float(match.group(2)),
                    }

        return stats

    def __run_cutadapt(
        self,
        file_type_to_paths: dict[FileType, list[str]],
        output_dir: str,
        job: JobEntity,
        options: TrimmingOptionsModel,
        progress: float,
    ):
        self.__update_status(
            "INFO: Starting reads trimming",
            job,
            logger.info,
            step=JobStep.TRIMMING,
        )

        trimmed_reads_dir = Path(output_dir) / "trimming" / "trimmed_reads"
        self.__update_status(
            "INFO: Trimming with cutadapt",
            job,
            logger.info,
        )

        job["current_status"].data.results["trimming"] = {"cutadapt_stats": {}}
        trimmed_files = []
        for read_file in file_type_to_paths[FileType.READ]:
            read_file_name = Path(read_file).name
            splitted_read_file_name = read_file_name.split(".")
            trimmed_read_file = trimmed_reads_dir / (
                f"{splitted_read_file_name[0]}_trimmed."
                + ".".join(splitted_read_file_name[1:])
            )

            self.__update_status(
                f"INFO: Trimming {read_file_name}",
                job,
                logger.info,
            )
            cmd = [
                "cutadapt",
                "-a",
                options.adapter,
                "-o",
                str(trimmed_read_file),
                read_file,
            ]

            if options:
                cmd.extend(options.params)
            trimmed_files.append(str(trimmed_read_file))

            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                self.__update_status(
                    "ERROR: FastQC failed:\n"
                    f"stdout:\n{res.stdout}\n"
                    f"stderr:\n{res.stderr}",
                    job,
                    logger.error,
                    False,
                )
                return

            cutadapt_stats = self.__parse_cutadapt_log(res.stdout)
            job["current_status"].data.results["trimming"]["cutadapt_stats"][
                read_file
            ] = cutadapt_stats
            self.__update_status(
                f"INFO: Successfully trimmed {read_file_name}\n"
                f"stdout:\n{res.stdout}\n"
                f"stderr:\n{res.stderr}",
                job,
                logger.info,
            )

        self.__update_status(
            "INFO: Cutadapt finished",
            job,
            logger.info,
        )

    def __run_trim_galore(
        self,
        file_type_to_paths: dict[FileType, list[str]],
        output_dir: str,
        job: JobEntity,
        options: TrimmingOptionsModel,
        progress: float,
    ):
        trimming_dir = Path(output_dir) / "trimming"
        read_files = file_type_to_paths[FileType.READ]

        self.__update_status(
            "INFO: Trimming with trim_galore",
            job,
            logger.info,
        )

        self.__update_status(
            "INFO: Trimming "
            + " ".join(
                [
                    Path(read_file).name
                    for read_file in file_type_to_paths[FileType.READ]
                ]
            ),
            job,
            logger.info,
        )
        cmd = [
            "trim_galore",
            "--quality",
            "20",  # cut basis < Q20
            "--fastqc",  # run fastqc automatically
            "--output_dir",
            str(trimming_dir),
        ] + read_files

        if options:
            cmd.extend(options.params)
        res = subprocess.run(cmd, capture_output=True, text=True)

        if res.returncode != 0:
            self.__update_status(
                "ERROR: FastQC failed:\n"
                f"stdout:\n{res.stdout}\n"
                f"stderr:\n{res.stderr}",
                job,
                logger.error,
                False,
            )
            return

        quality_control_dir = Path(output_dir) / "quality_control" / "final"
        report_dir = trimming_dir / "report"
        trimmed_reads_dir = trimming_dir / "trimmed_reads"
        dir_pattern_pairs = [
            (quality_control_dir, ["*.html", "*.zip"]),
            (report_dir, ["*.txt"]),
            (trimmed_reads_dir, ["*"]),
        ]

        for dir, patterns in dir_pattern_pairs:
            # Creates dir if it doesn't exist
            dir.mkdir(parents=True, exist_ok=True)

            # Move the generated files to the correct dir
            for pattern in patterns:
                for f in trimming_dir.glob(pattern):
                    if f.is_file():
                        shutil.move(f, dir / f.name)

            # For each dir add the generated files to the current status
            for f in Path(dir).iterdir():
                if (
                    f.is_file()
                    and str(f)
                    not in job["current_status"].data.generated_files
                ):
                    job["current_status"].data.generated_files.append(str(f))

        self.__update_status(
            "INFO: Successfully trimmed "
            + " ".join(
                [
                    Path(read_file).name
                    for read_file in file_type_to_paths[FileType.READ]
                ]
            )
            + "\n"
            + f"stdout:\n{res.stdout}\nstderr:\n{res.stderr}",
            job,
            logger.info,
            progress=progress,
        )

    def __run_bowtie2_build(
        self,
        file_type_to_paths: dict[FileType, list[str]],
        output_dir: str,
        job: JobEntity,
        options: AlignmentOptionsModel,
        progress: float,
    ):
        self.__update_status(
            "INFO: Starting alignment with bowtie2",
            job,
            logger.info,
            step=JobStep.ALIGNMENT_BUILD,
        )

        self.__update_status(
            "INFO: Starting bowtie2-build",
            job,
            logger.info,
        )
        bowtie2_build_dir = Path(output_dir) / "bowtie2" / "build"
        bowtie2_build_dir.mkdir(parents=True, exist_ok=True)
        bowtie2_build_command = [
            "bowtie2-build",
            file_type_to_paths[FileType.REFERENCE_GENOME][0],
            str(bowtie2_build_dir / options.index_prefix),
        ]

        if options.build:
            bowtie2_build_command.extend(options.build.params)

        res = subprocess.run(
            bowtie2_build_command, capture_output=True, text=True
        )

        if res.returncode != 0:
            self.__update_status(
                "ERROR: bowtie2-build failed:\n"
                f"stdout:\n{res.stdout}\n"
                f"stderr:\n{res.stderr}",
                job,
                logger.error,
                False,
            )
            return

        for f in os.listdir(bowtie2_build_dir):
            fp = os.path.join(bowtie2_build_dir, f)
            if fp not in job["current_status"].data.generated_files:
                job["current_status"].data.generated_files.append(fp)

        self.__update_status(
            "INFO: bowtie2-build finished\n"
            f"stdout:\n{res.stdout}\n"
            f"stderr:\n{res.stderr}",
            job,
            logger.info,
            progress=progress,
        )

    def __run_bowtie2(
        self,
        file_type_to_paths: dict[FileType, list[str]],
        output_dir: str,
        job: JobEntity,
        options: AlignmentOptionsModel,
        progress: float,
    ):
        self.__update_status(
            "INFO: Starting bowtie2",
            job,
            logger.info,
            step=JobStep.ALIGNMENT,
        )

        read_files = file_type_to_paths[FileType.READ]
        bowtie2_build_dir = Path(output_dir) / "bowtie2" / "build"
        bowtie2_alignment_dir = Path(output_dir) / "bowtie2" / "alignment"
        bowtie2_alignment_dir.mkdir(parents=True, exist_ok=True)
        bowtie2_command = [
            "bowtie2",
            "-x",
            str(bowtie2_build_dir / options.index_prefix),
            "-U",
            ",".join(read_files),
            "-S",
            str(bowtie2_alignment_dir / "result.sam"),
        ]
        if options.aligner:
            bowtie2_command.extend(options.aligner.params)

        res = subprocess.run(bowtie2_command, capture_output=True, text=True)
        if res.returncode != 0:
            self.__update_status(
                "ERROR: bowtie2 failed\n"
                f"stdout:\n{res.stdout}\n"
                f"stderr:\n{res.stderr}",
                job,
                logger.error,
                False,
            )
            return

        for f in Path(bowtie2_alignment_dir).iterdir():
            if str(f) not in job["current_status"].data.generated_files:
                job["current_status"].data.generated_files.append(str(f))

        self.__update_status(
            "INFO: bowtie2 finished\n"
            f"stdout:\n{res.stdout}\n"
            f"stderr:\n{res.stderr}",
            job,
            logger.info,
            progress=progress,
        )

    # TODO: Start the process from the stage indicated by the stage parameter
    async def process(
        self,
        job_id: UUID,
        stage: PipelineEntryStage,
        file_type_to_paths: dict[FileType, list[str]],
        output_dir: str,
        options: JobOptionsModel | None = None,
    ):
        job = self.__jobs[job_id]
        self.__run_fastqc(
            file_type_to_paths[FileType.READ],
            output_dir,
            "initial",
            job,
            options=options.quality_control if options else None,
            progress=0.2,
        )

        if not options or not options.trimming:
            self.__update_status(
                "ERROR: Missing trimming options",
                job,
                logger.error,
                False,
            )
            return

        trimming_options = options.trimming

        if trimming_options.trimmer == TrimmerType.CUTADAPT:
            self.__run_cutadapt(
                file_type_to_paths,
                output_dir,
                job,
                trimming_options,
                progress=0.4,
            )
            trimmed_reads_dir = Path(output_dir) / "trimming" / "trimmed_reads"
            trimmed_files = [
                str(f) for f in trimmed_reads_dir.iterdir() if f.is_file()
            ]
            self.__run_fastqc(
                trimmed_files,
                output_dir,
                "final",
                job,
                progress=0.6,
            )

        elif trimming_options.trimmer == TrimmerType.TRIM_GALORE:
            self.__run_trim_galore(
                file_type_to_paths,
                output_dir,
                job,
                trimming_options,
                progress=0.6,
            )
        else:
            self.__update_status(
                f"ERROR: Invalid trimmer {trimming_options.trimmer}",
                job,
                logger.error,
                False,
            )

        if not options or not options.alignment:
            self.__update_status(
                "ERROR: Missing alignment options",
                job,
                logger.error,
                False,
            )
            return

        self.__run_bowtie2_build(
            file_type_to_paths,
            output_dir,
            job,
            options.alignment,
            progress=0.8,
        )

        self.__run_bowtie2(
            file_type_to_paths,
            output_dir,
            job,
            options.alignment,
            progress=1.0,
        )

    async def delete(self, job_id: UUID):
        del self.__jobs[job_id]

    async def get_status_queue(self, job_id: UUID):
        job = self.__jobs.get(job_id)
        return job["status_queue"] if job else None
