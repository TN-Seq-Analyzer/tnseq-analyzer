import pytest

from file_extension_handler import FileExtensionHandler


@pytest.fixture
def file_extension_handler():
    return FileExtensionHandler()

