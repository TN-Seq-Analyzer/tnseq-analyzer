import logging

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from file_extension_handler import FileExtensionHandler
from job_manager import JobManager
from router import job_router

app = FastAPI()

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)

# Allow access from Electron
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or just "http://localhost"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

file_extension_handler = FileExtensionHandler()
job_manager = JobManager()
app.include_router(
    router=job_router(file_extension_handler, job_manager),
    prefix="/jobs",
)

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s | "
        "%(module)s:%(funcName)s:%(lineno)d - %(message)s",
    )
    LOGGER.info("[main] Starting FastAPI server")

    uvicorn.run("main:app", host="127.0.0.1", port=5000, log_level="info")
