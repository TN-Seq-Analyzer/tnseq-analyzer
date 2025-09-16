from file_extension_handler import (
    FileExtensionHandler,
    FileType,
    PipelineEntryStage,
)


def test_get_file_type_read(file_extension_handler: FileExtensionHandler):
    # Arrange
    file_paths = ["a.fq", "a.fq.gz", "a.fastq", "a.fastq.gz"]

    # Act
    results = [file_extension_handler.get_file_type(fp) for fp in file_paths]

    # Assert
    assert all(ft == FileType.READ for ft in results)


def test_get_file_type_reference_genome(file_extension_handler: FileExtensionHandler):
    # Arrange
    file_paths = ["a.fa", "a.fna", "a.fasta"]

    # Act
    results = [file_extension_handler.get_file_type(fp) for fp in file_paths]

    # Assert
    assert all(ft == FileType.REFERENCE_GENOME for ft in results)

def test_get_file_type_invalid_extensions(file_extension_handler: FileExtensionHandler):
    # Arrange
    file_paths = ["a.ext1", "a.ext1.gz", "a.fq.ext1"]

    # Act
    results = [file_extension_handler.get_file_type(fp) for fp in file_paths]

    # Assert
    assert all(ft is None for ft in results)


def test_get_pipeline_stage_preprocessing(file_extension_handler: FileExtensionHandler):
    # Arrange
    cardinality = {
        FileType.REFERENCE_GENOME: 1,
        FileType.READ: 1,
    }

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res == PipelineEntryStage.PREPROCESSING

    # Arrange
    cardinality = {
        FileType.REFERENCE_GENOME: 1,
        FileType.READ: 2,
    }

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res == PipelineEntryStage.PREPROCESSING

    # Arrange
    cardinality = {}

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res is None

    # Arrange
    cardinality = {
        FileType.REFERENCE_GENOME: 1,
    }

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res is None

    # Arrange
    cardinality = {
        FileType.READ: 1,
    }

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res is None


def test_validate_cardinality_aligment_map_reduction(
    file_extension_handler: FileExtensionHandler,
):
    # Arrange
    cardinality = {
        FileType.ALIGNMENT_MAP: 1,
    }

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res == PipelineEntryStage.ALIGNMENT_MAP_REDUCTION

    # Arrange
    cardinality = {
        FileType.ALIGNMENT_MAP: 2,
    }

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res is None

    # Arrange
    cardinality = {
        FileType.ALIGNMENT_MAP: 1,
        FileType.READ: 1,
    }

    # Act
    res = file_extension_handler.get_pipeline_stage(cardinality)

    # Assert
    assert res is None

