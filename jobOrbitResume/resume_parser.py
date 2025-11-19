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
            "gender": None,
        },
        "professional_summary": {"objective": None, "summary_text": None},
        "education": [],
        "experience": [],
        "projects": [],
        "skills": {
            "technical_skills": [],
            "soft_skills": [],
            "tools_and_technologies": [],
        },
        "certifications": [],
        "achievements_and_awards": [],
        "languages": [],
        "publications": [],
        "volunteer_experience": [],
        "interests_or_hobbies": [],
        "references": [],
    }


# Step 3. Ask Gemini to fill the JSON
import json
import google.generativeai as genai


def extract_resume_data_with_gemini(text: str) -> dict:
    schema = {
        # Personal Information
        "firstName": None,
        "lastName": None,
        "email": None,
        "phone": None,
        "dateOfBirth": None,
        # Address Information
        "address": {
            "street": None,
            "city": None,
            "state": None,
            "zipCode": None,
            "country": None,
        },
        # Professional Information
        "experience": None,  # Total years of experience as number
        "skills": [],  # Array of skill strings
        # Education
        "education": [
            # {
            #     "degree": "Bachelor of Technology",
            #     "institution": "XYZ University",
            #     "graduationYear": 2022,
            #     "grade": "8.5 CGPA"
            # }
        ],
        # Projects
        "projects": [
            # {
            #     "name": "Project Name",
            #     "description": ["Description line 1", "Description line 2"],
            #     "link": "https://github.com/...",
            #     "technologies": ["React", "Node.js"],
            #     "duration": "3 months"
            # }
        ],
        # URLs and Social Media
        "portfolioUrl": None,
        "linkedinUrl": None,
        "githubUrl": None,
    }

    prompt = f"""
You are an expert ATS (Applicant Tracking System) resume parser.
Extract structured resume data strictly in JSON format following this schema:
{json.dumps(schema, indent=2)}

DETAILED EXTRACTION RULES:
- Return only one JSON object — not multiple.
- Do not include explanations, text, or markdown.
- If data is missing, use null or empty arrays/objects.

PERSONAL INFORMATION:
- firstName: Extract first name from the candidate's full name
- lastName: Extract last name from the candidate's full name  
- email: Find email address (usually in contact section)
- phone: Extract phone/mobile number (include country code if present)
- dateOfBirth: Extract birth date if mentioned (format: YYYY-MM-DD)

ADDRESS INFORMATION:
- Extract complete address details from contact section
- street: Street address/house number
- city: City name
- state: State/province name  
- zipCode: Postal/zip code
- country: Country name

PROFESSIONAL INFORMATION:
- experience: Calculate total years of professional experience as a number
- skills: Extract ALL technical and soft skills mentioned anywhere in resume

EDUCATION:
- Extract all educational qualifications
- degree: Full degree name (e.g., "Bachelor of Technology", "Master of Science")
- institution: University/college name
- graduationYear: Year of graduation as number
- grade: GPA/percentage/grade if mentioned

PROJECTS:
- Extract all projects mentioned
- name: Project title/name
- description: Array of description points/bullets
- link: GitHub/demo link if provided
- technologies: Array of technologies/tools used
- duration: Project duration if mentioned

URLS & SOCIAL MEDIA:
- portfolioUrl: Personal website/portfolio URL
- linkedinUrl: LinkedIn profile URL
- githubUrl: GitHub profile URL

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
        json_str = raw_output[start : end + 1]
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

    print("=== EXTRACTED RESUME DATA ===")
    print(json.dumps(extracted, indent=2))

    # Show summary of extracted fields
    print("\n=== EXTRACTION SUMMARY ===")
    if extracted.get("firstName"):
        print(f"✓ Name: {extracted.get('firstName')} {extracted.get('lastName', '')}")
    if extracted.get("email"):
        print(f"✓ Email: {extracted.get('email')}")
    if extracted.get("phone"):
        print(f"✓ Phone: {extracted.get('phone')}")
    if extracted.get("address"):
        addr = extracted["address"]
        city = addr.get("city", "")
        state = addr.get("state", "")
        country = addr.get("country", "")
        if city or state or country:
            print(f"✓ Address: {city}, {state}, {country}")
    if extracted.get("skills"):
        print(f"✓ Skills: {len(extracted['skills'])} skills found")
    if extracted.get("education"):
        print(f"✓ Education: {len(extracted['education'])} entries found")
    if extracted.get("projects"):
        print(f"✓ Projects: {len(extracted['projects'])} projects found")
    if extracted.get("experience"):
        print(f"✓ Experience: {extracted['experience']} years")
    if extracted.get("portfolioUrl"):
        print(f"✓ Portfolio: {extracted['portfolioUrl']}")
    if extracted.get("linkedinUrl"):
        print(f"✓ LinkedIn: {extracted['linkedinUrl']}")
