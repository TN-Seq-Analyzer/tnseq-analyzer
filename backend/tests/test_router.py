import pytest
from fastapi.applications import FastAPI
from fastapi.testclient import TestClient
from starlette import status

from file_extension_handler import FileExtensionHandler
from router import job_router


@pytest.fixture
def client(file_extension_handler: FileExtensionHandler):

    app = FastAPI()
    app.include_router(
        router=job_router(file_extension_handler),
        prefix="/jobs",
    )
    return TestClient(app)


def test_create_job_invalid_extension(client: TestClient):
    # Arrange
    input_file = "file.ext1"
    payload = {
        "input_files": [input_file],
    }

    # Act
    res = client.post("/jobs", json=payload)

    # Assert
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert res.json() == {
        "message": f"File {input_file} has invalid file extension",
    }


def test_create_job_invalid_file_cardinality(client: TestClient):
    # Arrange
    input_file = "file.fq"
    payload = {
        "input_files": [input_file],
    }

    # Act
    res = client.post("/jobs", json=payload)

    # Assert
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert res.json() == {
        "message": (
            "The provided files do not match any supported " 
            "formats or combinations."
        ),
    }

