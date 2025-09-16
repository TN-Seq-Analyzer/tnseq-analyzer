from enum import StrEnum
from queue import Queue

from pydantic import BaseModel


class JobStep(StrEnum):
    INITIAL_QUALITY_CONTROL = "initial_quality_control"
    TRIMMING = "trimming"
    FINAL_QUALITY_CONTROL = "final_quality_control"
    ALIGNMENT_BUILD = "alignment_build"
    ALIGNMENT = "alignment"


class TrimmerType(StrEnum):
    CUTADAPT = "cutadapt"
    TRIM_GALORE = "trim_galore"


class TrimmingOptionsModel(BaseModel):
    trimmer: TrimmerType
    params: list[str] = []


class QualityControlOptionsModel(BaseModel):
    params: list[str] = []


class AlignmentBuildOptionsModel(BaseModel):
    params: list[str] = []


class AlignerOptionsModel(BaseModel):
    params: list[str] = []


class AlignmentOptionsModel(BaseModel):
    build: AlignmentBuildOptionsModel
    aligner: AlignerOptionsModel


class JobOptionsModel(BaseModel):
    trimming: TrimmingOptionsModel | None = None
    quality_control: QualityControlOptionsModel | None = None
    alignment: AlignmentOptionsModel | None = None


class JobRequestModel(BaseModel):
    input_files: list[str]
    output_dir: str
    options: JobOptionsModel | None = None


class JobStatusModel(BaseModel):
    step: JobStep
    logs: list[str]
    generated_files: list[str]


class JobEntity(BaseModel):
    current_status: JobStatusModel
    status_queue: Queue

