import re

import logging
from typing import Annotated
import uvicorn

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
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


@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.post("/process-fastq/")
async def process_fastq(
    file: UploadFile = File(...), adapter: Annotated[str, Form()] = ""
):
    if not adapter:
        # Raise error if adapter is not provided
        raise HTTPException(status_code=400, detail="Adapter sequence is required.")

    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = Path(tmpdir) / file.filename
        output_path = Path(tmpdir) / "trimmed.fastq"

        # Saving uploaded file
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        command = [
            "cutadapt",
            "-a",
            adapter,
            "-o",
            str(output_path),
            str(input_path),
        ]

        # Execute cutadapt and capture statistics
        result = subprocess.run(command, capture_output=True, text=True)

        # The cutadapt log/statistics comes from stdout
        cutadapt_stats = parse_cutadapt_log(result.stdout)

    return {"cutadapt_stats": cutadapt_stats}


@app.post("/process-trimgalore/")
async def process_trimgalore(file: UploadFile = File(...)):
    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = Path(tmpdir) / file.filename

        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        command = [
            "trim_galore",
            "--quality",
            "20",  # cut basis < Q20
            "--fastqc",  # run fastqc automatically
            "--output_dir",
            str(tmpdir),
            str(input_path),
        ]
        subprocess.run(command, capture_output=True, text=True)

        report_file = list(Path(tmpdir).glob("*_trimming_report.txt"))
        stats_json = {}
        if report_file:
            with open(report_file[0], "r") as f:
                report_content = f.read()
                stats_json = parse_trimgalore_report(report_content)

    return {"trimgalore_stats": stats_json}


if __name__ == "__main__":
    LOGGER.info("[main] Starting FastAPI server")

    uvicorn.run("main:app", host="127.0.0.1", port=5000)
