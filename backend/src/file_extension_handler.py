from copy import deepcopy
from enum import StrEnum
from pathlib import Path


class FileType(StrEnum):
    READ = "read"
    REFERENCE_GENOME = "reference_genome"
    ALIGNMENT_MAP = "alignment_map"


class PipelineEntryStage(StrEnum):
    PREPROCESSING = "preprocessing"
    ALIGNMENT_MAP_REDUCTION = "alignment_map_reduction"


class FileExtensionHandler:
    def __init__(self):
        self.__extension_to_file_type = {
            "fq": FileType.READ,
            "fq.gz": FileType.READ,
            "fastq": FileType.READ,
            "fastq.gz": FileType.READ,
            "fa": FileType.REFERENCE_GENOME,
            "fna": FileType.REFERENCE_GENOME,
            "fasta": FileType.REFERENCE_GENOME,
            "sam": FileType.ALIGNMENT_MAP,
        }

        self.__valid_cardinalites = [
            {
                "cardinality": {
                    FileType.READ: (1, None),
                    FileType.REFERENCE_GENOME: (1, 1),
                },
                "stage": PipelineEntryStage.PREPROCESSING,
            },
            {
                "cardinality": {
                    FileType.ALIGNMENT_MAP: (1, 1),
                },
                "stage": PipelineEntryStage.ALIGNMENT_MAP_REDUCTION,
            },
        ]

    def get_file_type(self, path: str) -> FileType | None:
        extension = ".".join(Path(path).name.split(".")[1:])
        return self.__extension_to_file_type.get(extension)

    def get_pipeline_stage(
        self, cardinality: dict[FileType, int]
    ) -> PipelineEntryStage | None:
        cardinality_stage = None
        for vc in self.__valid_cardinalites:
            matches_current_cardinality = True
            valid_cardinality = deepcopy(vc["cardinality"])
            for key, value in cardinality.items():
                cardinality_limits = valid_cardinality.pop(key, None)

                if not cardinality_limits:
                    matches_current_cardinality = False
                    break

                lower_limit, upper_limit = cardinality_limits

                if lower_limit and value < lower_limit:
                    matches_current_cardinality = False
                    break

                if upper_limit and upper_limit < value:
                    matches_current_cardinality = False
                    break

            if matches_current_cardinality and not valid_cardinality:
                cardinality_stage = vc["stage"]

        return cardinality_stage
