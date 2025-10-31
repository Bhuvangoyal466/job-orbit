import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
import pdfplumber

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Step 1. Extract text from PDF
def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

def initialize_resume_json():
    return {
        "personal_information": {
            "name": None,
            "email": None,
            "phone": None,
            "location": None,
            "linkedin": None,
            "github": None,
            "portfolio": None,
            "website": None,
            "date_of_birth": None,
            "gender": None
        },
        "professional_summary": {
            "objective": None,
            "summary_text": None
        },
        "education": [],
        "experience": [],
        "projects": [],
        "skills": {
            "technical_skills": [],
            "soft_skills": [],
            "tools_and_technologies": []
        },
        "certifications": [],
        "achievements_and_awards": [],
        "languages": [],
        "publications": [],
        "volunteer_experience": [],
        "interests_or_hobbies": [],
        "references": []
    }

# Step 3. Ask Gemini to fill the JSON
import re
import json
import google.generativeai as genai

def extract_resume_data_with_gemini(text: str) -> dict:
    schema = {
        "name": None,
        "email": None,
        "phone": None,
        "education": [],
        "experience": [],
        "skills": [],
        "projects": []
    }

    prompt = f"""
You are an expert ATS (Applicant Tracking System) resume parser.
Extract structured resume data strictly in JSON format following this schema:
{json.dumps(schema, indent=2)}

Rules:
- Return only one JSON object — not multiple.
- Do not include explanations, text, or markdown.
- If data is missing, use null or empty lists.

Resume text:
{text}
"""

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    raw_output = response.text.strip()

    # --- safer JSON extraction ---
    start = raw_output.find("{")
    end = raw_output.rfind("}")
    if start != -1 and end != -1:
        json_str = raw_output[start:end+1]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print("⚠️ JSON parsing failed:", e)

    print("⚠️ Falling back to default schema.")
    return schema



def process_resume(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    resume_data = extract_resume_data_with_gemini(text)
    return resume_data

# Example usage
if __name__ == "__main__":
    pdf_path = r"C:\Users\\dell\\Desktop\\Resume.pdf"
    extracted = process_resume(pdf_path)
    print(json.dumps(extracted, indent=2))
