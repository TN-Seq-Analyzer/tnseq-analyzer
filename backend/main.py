import re

import logging
from typing import Annotated
import uvicorn

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Form
import subprocess
import tempfile
import shutil
from pathlib import Path


app = FastAPI()

LOGGER = logging.getLogger(__name__)

# Allow access from Electron
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or just "http://localhost"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def parse_cutadapt_log(log: str) -> dict:
    stats = {}
    patterns = {
        "total_reads": r"Total reads processed:\s+([\d,]+)",
        "reads_with_adapters": r"Reads with adapters:\s+([\d,]+) \(([\d.]+)%",
        "reads_written": r"Reads written \(passing filters\):\s+([\d,]+) \(([\d.]+)%",
        "total_bp": r"Total basepairs processed:\s+([\d,]+)",
        "written_bp": r"Total written \(filtered\):\s+([\d,]+) \(([\d.]+)%",
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


def parse_trimgalore_report(report: str) -> dict:
    stats = {}
    patterns = {
        "reads_processed": r"Reads processed:\s+([\d,]+)",
        "reads_with_adapters": r"Reads with adapters:\s+([\d,]+) \(([\d.]+)%",
        "reads_written": r"Reads written \(passing filters\):\s+([\d,]+) \(([\d.]+)%",
        "total_bp": r"Total basepairs processed:\s+([\d,]+)",
        "written_bp": r"Total written \(filtered\):\s+([\d,]+) \(([\d.]+)%",
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, report)
        if match:
            if len(match.groups()) == 1:
                stats[key] = int(match.group(1).replace(",", ""))
            elif len(match.groups()) == 2:
                stats[key] = {
                    "count": int(match.group(1).replace(",", "")),
                    "percent": float(match.group(2)),
                }
    return stats

def apply_bowtie2(
    reference_file: str, 
    index_path: str, 
    read_path: str, 
    result_path: str,
    build_params_list: list[str], 
    params_list: list[str],
):
    bowtie2_build_command = [
        "bowtie2-build",
        reference_file,
        index_path,
        *build_params_list,
    ]
    subprocess.run(bowtie2_build_command, capture_output=True, text=True)

    bowtie2_command = [
        'bowtie2',
        '-x',
        index_path,
        '-U',
        read_path,
        '-S',
        result_path,
        *params_list,
    ]

    subprocess.run(bowtie2_command, capture_output=True, text=True)
    


@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.post("/process-fastq/")
async def process_fastq(
    reference_file: Annotated[str, Form()],
    read_file: Annotated[str, Form()],
    adapter: Annotated[str, Form()],
    output_dir: Annotated[str, Form()],
    include_tmp_files: Annotated[bool, Form()] = False, 
    bowtie2_build_params: Annotated[str, Form()] = "",
    bowtie2_params: Annotated[str, Form()] = "",
):
    with tempfile.TemporaryDirectory() as tmpdir:
        trimmed_file_path = Path(output_dir if output_dir else tmpdir) / "trimmed.fastq"
        bowtie2_build_params_list = bowtie2_build_params.split(",") if bowtie2_build_params else []
        bowtie2_params_list = bowtie2_params.split(",") if bowtie2_params else []

        command = [
            "cutadapt",
            "-a",
            adapter,
            "-o",
            str(trimmed_file_path),
            str(read_file),
        ]

        result = subprocess.run(command, capture_output=True, text=True)

        # The cutadapt log/statistics comes from stdout
        cutadapt_stats = parse_cutadapt_log(result.stdout)

        apply_bowtie2(
            reference_file=reference_file,
            index_path=str(Path(tmpdir) / "index"),
            read_path=str(trimmed_file_path),
            result_path=str(Path(output_dir) / "result.sam"),
            build_params_list=bowtie2_build_params_list,
            params_list=bowtie2_params_list
        )

        if include_tmp_files:
            shutil.copytree(Path(tmpdir), Path(output_dir) / "tmp", dirs_exist_ok=True)

    return {"cutadapt_stats": cutadapt_stats}


@app.post("/process-trimgalore/")
async def process_trimgalore(
    reference_file: Annotated[str, Form()],
    read_file: Annotated[str, Form()],
    output_dir: Annotated[str, Form()] = "",
    include_tmp_files: Annotated[bool, Form()] = False,
    bowtie2_build_params: Annotated[str, Form()] = "",
    bowtie2_params: Annotated[str, Form()] = "",
):
    with tempfile.TemporaryDirectory() as tmpdir:
        bowtie2_build_params_list = bowtie2_build_params.split(",") if bowtie2_build_params else []
        bowtie2_params_list = bowtie2_params.split(",") if bowtie2_params else []

        trim_galore_command = [
            "trim_galore",
            "--quality",
            "20",  # cut basis < Q20
            "--fastqc",  # run fastqc automatically
            "--output_dir",
            str(tmpdir),
            read_file,
        ]
        subprocess.run(trim_galore_command, capture_output=True, text=True)

        apply_bowtie2(
            reference_file=reference_file,
            index_path=str(Path(tmpdir) / "index"),
            read_path=str(Path(tmpdir) / (Path(read_file).name.split(".")[0] + "_trimmed.fq")),
            result_path=str(Path(output_dir) / "result.sam"),
            build_params_list=bowtie2_build_params_list,
            params_list=bowtie2_params_list,
        )

        report_file = list(Path(tmpdir).glob("*_trimming_report.txt"))
        stats_json = {}
        if report_file:
            with open(report_file[0], "r") as f:
                report_content = f.read()
                shutil.copy(report_file[0], Path(output_dir))

            stats_json = parse_trimgalore_report(report_content)
        
        if include_tmp_files:
            shutil.copytree(Path(tmpdir), Path(output_dir) / "tmp", dirs_exist_ok=True)
    return {"trimgalore_stats": stats_json}


if __name__ == "__main__":
    LOGGER.info("[main] Starting FastAPI server")

    uvicorn.run("main:app", host="127.0.0.1", port=5000)
