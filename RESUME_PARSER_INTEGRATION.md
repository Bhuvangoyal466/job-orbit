# Resume Parser Integration Documentation

## Overview
The Job Orbit platform now includes AI-powered resume parsing functionality using FastAPI and Google Gemini AI. When candidates upload their resumes, the system automatically extracts information and pre-fills their profiles.

## Architecture

### Components
1. **FastAPI Resume Parser Service** (`jobOrbitResume/`)
   - Python-based microservice using FastAPI
   - Uses Google Gemini AI for intelligent text extraction
   - Processes PDF resumes and returns structured JSON data

2. **Backend Integration** (`server/`)
   - Node.js/Express backend calls the FastAPI service
   - Transforms parsed data to match the Candidate model schema
   - Handles errors gracefully if parsing fails

3. **Frontend Enhancement** (`client/`)
   - Auto-fills profile forms with parsed resume data
   - Provides re-parse functionality for existing resumes
   - Shows visual feedback during parsing process

## Setup Instructions

### 1. FastAPI Service Setup

```bash
# Navigate to the resume parser directory
cd jobOrbitResume

# Activate virtual environment (if not already active)
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install fastapi uvicorn python-multipart google-generativeai pdfplumber python-dotenv

# Set up environment variables
# Create/update .env file with your Gemini API key:
GEMINI_API_KEY=your_gemini_api_key_here

# Start the FastAPI service
uvicorn main:app --reload --port 8000
```

### 2. Backend Configuration

```bash
# Navigate to server directory
cd server

# Install new dependency
npm install form-data

# Update .env file (already done)
RESUME_PARSER_URL=http://127.0.0.1:8000

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Start the frontend (if not already running)
npm run dev
```

## API Integration Details

### New Backend Endpoints

#### 1. Enhanced Resume Upload
- **POST** `/api/candidate/upload-resume`
- Now includes automatic parsing and profile auto-filling
- Response includes parsing status and extracted data

#### 2. Re-parse Existing Resume
- **POST** `/api/candidate/parse-existing`
- Allows re-parsing of previously uploaded resumes
- Useful for improving extraction accuracy

### Data Transformation

The parser extracts and maps the following fields:

| Parsed Field | Candidate Schema Field | Notes |
|--------------|------------------------|-------|
| `name` | `firstName`, `lastName` | Split full name |
| `email` | `email` | Direct mapping |
| `phone` | `phone` | Direct mapping |
| `skills[]` | `skills[]` | Merged with existing skills |
| `education[]` | `education[]` | Added to existing education |
| `experience` | `experience` | Total years calculated |
| `location` | `address{}` | Mapped to address object |
| `portfolio/website` | `portfolioUrl` | Direct mapping |
| `linkedin` | `linkedinUrl` | Direct mapping |

### Error Handling

- **Parsing Failures**: System gracefully continues without parsed data
- **Service Unavailable**: Resume upload succeeds, parsing is skipped
- **Invalid Data**: Validation ensures only clean data is saved

## User Experience Flow

### 1. Resume Upload Process
1. User drags/drops or selects PDF resume
2. File uploads to backend server
3. Backend calls FastAPI parsing service
4. Parsed data auto-fills profile form
5. User reviews and edits extracted information
6. User saves final profile

### 2. Re-parsing Feature
1. User clicks "Re-parse Resume" button
2. System re-analyzes existing resume file
3. New extracted data is presented for review
4. User merges or updates profile information

### 3. Visual Feedback
- Loading indicators during upload/parsing
- Success notifications with extracted fields list
- Warning messages if parsing fails
- Info messages prompting user to review data

## Technical Implementation Details

### FastAPI Service (`resumeParser.py`)

```python
# Key functions:
- extract_text_from_pdf(): Uses pdfplumber for text extraction
- extract_resume_data_with_gemini(): Uses Gemini AI for structured data extraction
- process_resume(): Main processing function
```

### Backend Service (`resumeParser.js`)

```javascript
// Key functions:
- parseResumeWithAPI(): Calls FastAPI service
- transformParsedData(): Maps parsed data to Candidate schema
```

### Frontend Enhancement (`UploadResume.jsx`)

```javascript
// Key features:
- Enhanced handleFile(): Processes parsing results
- handleReParseResume(): Re-parses existing resumes
- Smart form auto-filling with user review
```

## Configuration

### Environment Variables

#### FastAPI Service (`.env`)
```
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Backend Server (`.env`)
```
RESUME_PARSER_URL=http://127.0.0.1:8000
```

## Troubleshooting

### Common Issues

1. **FastAPI service not responding**
   - Ensure service is running on port 8000
   - Check if dependencies are installed
   - Verify Gemini API key is valid

2. **Parsing always fails**
   - Check Gemini API quota/billing
   - Verify PDF files are text-extractable (not scanned images)
   - Check server logs for detailed errors

3. **Data not auto-filling**
   - Check if parsing response contains expected fields
   - Verify data transformation logic
   - Check frontend console for JavaScript errors

### Development Tips

1. **Testing Parsing**
   ```bash
   # Test FastAPI service directly
   curl -X POST "http://127.0.0.1:8000/parse-resume/" \
   -H "accept: application/json" \
   -H "Content-Type: multipart/form-data" \
   -F "file=@sample_resume.pdf"
   ```

2. **Debugging Backend Integration**
   - Check server console for parsing logs
   - Verify form-data dependency is installed
   - Test with simple PDF files first

3. **Frontend Debugging**
   - Check browser network tab for API responses
   - Verify candidate profile updates correctly
   - Test with various resume formats

## Future Enhancements

1. **Improved Parsing Accuracy**
   - Add support for more resume formats
   - Enhance Gemini prompts for better extraction
   - Add confidence scores for extracted data

2. **Additional Features**
   - Batch resume processing for recruiters
   - Resume comparison tools
   - Skills matching algorithms

3. **Performance Optimizations**
   - Implement caching for parsed results
   - Add async processing for large files
   - Optimize Gemini API calls

## Security Considerations

1. **File Validation**
   - Only PDF files are accepted
   - File size limits are enforced
   - Malicious file detection

2. **Data Privacy**
   - Parsed data is stored securely
   - User consent for AI processing
   - GDPR compliance for data extraction

3. **API Security**
   - Authentication required for all endpoints
   - Rate limiting on parsing requests
   - Secure communication between services