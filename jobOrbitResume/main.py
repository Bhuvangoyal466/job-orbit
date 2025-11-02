from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from resume_parser import process_resume

app = FastAPI(title="Resume Parser API", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, be more specific
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Resume Parser API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "resume-parser"}


@app.post("/parse-resume/")
async def parse_resume(file: UploadFile = File(...)):
    tmp_path = None
    try:
        print(f"Received file: {file.filename}")
        print(f"Content type: {file.content_type}")

        # Validate file
        if not file.filename:
            print("Error: No filename provided")
            raise HTTPException(status_code=400, detail="No file provided.")

        if not file.filename.lower().endswith(".pdf"):
            print(f"Error: Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            print(f"File size: {len(content)} bytes")

            if not content:
                print("Error: File is empty")
                raise HTTPException(status_code=400, detail="File is empty.")

            tmp.write(content)
            tmp_path = tmp.name

        print(f"Temporary file created at: {tmp_path}")

        # Process the resume
        result = process_resume(tmp_path)
        return JSONResponse(content=result)
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Error processing resume: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        raise HTTPException(
            status_code=500, detail=f"Error processing resume: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception as cleanup_error:
                print(f"Error cleaning up temporary file: {cleanup_error}")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Resume Parser API"}
