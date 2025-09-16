from fastapi import APIRouter, BackgroundTasks, WebSocket
from pydantic.types import UUID4
from starlette import status
from starlette.responses import JSONResponse

from file_extension_handler import FileExtensionHandler, PipelineEntryStage
from job_manager import JobManager
from queue_manager import QueueManager
from schemas import JobRequestModel


def job_router(
        file_extension_handler: FileExtensionHandler,
        job_manager: JobManager,
        queue_manager: QueueManager,
    ):
    router = APIRouter(tags=["Jobs"])

    @router.post("")
    async def create_job(
        request: JobRequestModel,
        background_tasks: BackgroundTasks,
    ) -> JSONResponse:
        file_type_to_paths = {}
        cardinality_map = {}
        
        for file in request.input_files:
            file_type = file_extension_handler.get_file_type(file)
            if not file_type:
                return JSONResponse(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    content={
                        "message": f"File {file} has invalid file extension",
                    },
                )

            if file_type in file_type_to_paths:
                file_type_to_paths[file_type].append(file)
                cardinality_map[file_type] += 1
            else:
                file_type_to_paths[file_type] = [file]
                cardinality_map[file_type] = 1

        entry_stage = file_extension_handler.get_pipeline_stage(
            cardinality_map,
        )

        if not entry_stage or entry_stage != PipelineEntryStage.PREPROCESSING:
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content={
                    "message": (
                        "The provided files do not match any supported " 
                        "formats or combinations."
                    ),
                },
            )

        job_id = await job_manager.create_job()
        await queue_manager.add_job(job_id)

        background_tasks.add_task(
            job_manager.process, 
            job_id,
            entry_stage,
            file_type_to_paths,
            request.output_dir,
            request.options,
        )


        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"job_id": str(job_id)},
        )

    @router.websocket("/jobs/{job_id}")
    async def get_job_status(
        websocket: WebSocket,
        job_id: UUID4,
    ):
        await websocket.accept()
    return router

