# Job Orbit - Complete Backend Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Endpoints](#api-endpoints)
7. [Data Flow & Workflow](#data-flow--workflow)
8. [File Organization](#file-organization)
9. [Security Implementation](#security-implementation)
10. [Error Handling](#error-handling)

---

## Architecture Overview

Job Orbit follows a **3-tier MVC (Model-View-Controller) architecture**:

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│              (Vite + React Router)                   │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/HTTPS Requests
                   │ (REST API Calls)
┌──────────────────▼──────────────────────────────────┐
│               Express.js Server                      │
│  ┌──────────────────────────────────────────────┐   │
│  │         Routes Layer                          │   │
│  │  (URL Mapping & Request Routing)             │   │
│  └──────────────┬───────────────────────────────┘   │
│  ┌──────────────▼───────────────────────────────┐   │
│  │      Middleware Layer                         │   │
│  │  (Authentication, Validation, File Upload)    │   │
│  └──────────────┬───────────────────────────────┘   │
│  ┌──────────────▼───────────────────────────────┐   │
│  │      Controllers Layer                        │   │
│  │  (Business Logic & Request Handling)          │   │
│  └──────────────┬───────────────────────────────┘   │
│  ┌──────────────▼───────────────────────────────┐   │
│  │         Models Layer                          │   │
│  │  (Database Schema & Data Validation)          │   │
│  └──────────────┬───────────────────────────────┘   │
└─────────────────┼───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              MongoDB Database                        │
│        (Collections: Candidates, Recruiters,         │
│              Jobs, Interviews)                       │
└─────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js v4.18.2
- **Database**: MongoDB (Mongoose ODM v8.16.5)
- **Authentication**: JWT (JSON Web Tokens) v9.0.2
- **Password Hashing**: bcryptjs v3.0.2
- **File Upload**: Multer v2.0.2
- **Validation**: express-validator v7.0.1
- **CORS**: cors v2.8.5
- **Environment Variables**: dotenv v16.3.1

### Development Tools
- **Dev Server**: nodemon v3.1.10

---

## Project Structure

```
server/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/
│   ├── authCandidate.js         # Candidate authentication logic
│   ├── authRecruiter.js         # Recruiter authentication logic
│   └── jobs.js                  # Job-related business logic
├── middleware/
│   └── auth.js                  # Authentication & authorization middleware
├── models/
│   ├── Candidate.js             # Candidate data schema
│   ├── Recruiter.js             # Recruiter data schema
│   ├── Job.js                   # Job posting schema
│   └── Interview.js             # Interview scheduling schema
├── routes/
│   ├── authCandidate.js         # Candidate auth routes
│   ├── authRecruiter.js         # Recruiter auth routes
│   ├── jobs.js                  # Job management routes
│   ├── interviews.js            # Interview scheduling routes
│   └── resume.js                # Resume upload/download routes
├── uploads/
│   └── resumes/                 # Stored resume PDFs
├── server.js                    # Main application entry point
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (not in repo)
└── migration scripts/           # Database utility scripts
    ├── fix-profile-completeness.js
    ├── migrate-under-review.js
    ├── pass.js
    └── pass-optimized.js
```

---

## Database Schema

### 1. Candidate Model (`models/Candidate.js`)

**Purpose**: Stores job seeker information, applications, and profile data

**Schema Fields**:
```javascript
{
  // Personal Information
  firstName: String (required, max 50 chars)
  lastName: String (required, max 50 chars)
  email: String (required, unique, validated)
  password: String (required, hashed, min 6 chars, select: false)
  phone: String (required, validated format)
  dateOfBirth: Date (required, must be 18+)
  
  // Address
  address: {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }
  
  // Professional Info
  experience: Number (default: 0, min: 0)
  skills: [String]
  education: [{
    degree: String
    institution: String
    graduationYear: Number
    grade: String
  }]
  
  // Resume & Portfolio
  resume: {
    filename: String
    originalName: String
    path: String
    size: Number
    uploadDate: Date (default: now)
  }
  portfolioUrl: String (validated URL)
  linkedinUrl: String (validated LinkedIn URL)
  
  // Job Preferences
  preferredJobType: String (enum: full-time, part-time, contract, internship, remote)
  expectedSalary: {
    min: Number
    max: Number
    currency: String (default: USD)
  }
  preferredLocations: [String]
  
  // Applications Tracking
  applications: [{
    jobId: ObjectId (ref: Job)
    appliedDate: Date (default: now)
    status: String (enum: applied, under-review, interviewed, hired, rejected)
  }]
  
  // Account Status
  isActive: Boolean (default: true)
  isEmailVerified: Boolean (default: false)
  emailVerificationToken: String
  passwordResetToken: String
  passwordResetExpires: Date
  profileCompleteness: Number (0-100, auto-calculated)
  
  // Timestamps (auto-generated)
  createdAt: Date
  updatedAt: Date
}
```

**Virtual Fields**:
- `fullName`: Returns `firstName + lastName`
- `age`: Calculates age from dateOfBirth

**Middleware (Pre-save)**:
1. **Password Hashing**: Uses bcryptjs with 12 rounds (configurable)
2. **Profile Completeness Calculation**: Automatically calculates completion percentage based on filled fields with weighted values

**Methods**:
- `comparePassword(candidatePassword)`: Compares plain text password with hashed password
- `createPasswordResetToken()`: Generates secure reset token

**Indexes**:
- `email`: Unique index
- `applications.jobId`: For faster application queries
- `skills`: For skill-based searches
- `preferredLocations`: For location filtering
- `createdAt`: For sorting by registration date

---

### 2. Recruiter Model (`models/Recruiter.js`)

**Purpose**: Stores company recruiter information and job posting data

**Schema Fields**:
```javascript
{
  // Personal Information
  firstName: String (required, max 50 chars)
  lastName: String (required, max 50 chars)
  email: String (required, unique, validated)
  password: String (required, hashed, min 6 chars, select: false)
  phone: String (required, validated format)
  dateOfBirth: Date (required, must be 18+)
  
  // Company Information
  company: {
    name: String (required, max 100 chars)
    industry: String (required, enum: Technology, Healthcare, Finance, etc.)
    size: String (required, enum: 1-10, 11-50, 51-200, 201-1000, 1001-5000, 5000+)
    website: String (validated URL)
    description: String (max 1000 chars)
    address: {
      street: String
      city: String (required)
      state: String (required)
      pincode: String
      country: String (required)
    }
    logo: String
  }
  
  // Professional Information
  position: String (required, max 100 chars)
  department: String (enum: HR, Engineering, Sales, Marketing, Operations, Finance, Other)
  
  // Job Postings
  jobPostings: [ObjectId] (ref: Job)
  
  // Hiring Statistics
  stats: {
    totalJobsPosted: Number (default: 0)
    activeJobs: Number (default: 0)
    totalApplicationsReceived: Number (default: 0)
    totalHires: Number (default: 0)
  }
  
  // Account Information
  isActive: Boolean (default: true)
  isEmailVerified: Boolean (default: false)
  isCompanyVerified: Boolean (default: false)
  emailVerificationToken: String
  passwordResetToken: String
  passwordResetExpires: Date
  
  // Subscription/Plan
  subscription: {
    plan: String (enum: free, basic, premium, enterprise, pro; default: free)
    startDate: Date
    endDate: Date
    jobPostLimit: Number (default: 3 for free plan)
  }
  
  // Profile Completion
  profileCompleteness: Number (0-100, auto-calculated)
  
  // Communication Preferences
  notifications: {
    emailAlerts: Boolean (default: true)
    applicationNotifications: Boolean (default: true)
    marketingEmails: Boolean (default: false)
  }
  
  // Timestamps (auto-generated)
  createdAt: Date
  updatedAt: Date
}
```

**Virtual Fields**:
- `fullName`: Returns `firstName + lastName`
- `companyDisplayName`: Returns company name or default message

**Middleware (Pre-save)**:
1. **Password Hashing**: Uses bcryptjs with 12 rounds
2. **Profile Completeness Calculation**: Auto-calculates based on filled fields
3. **Subscription Limits**: Sets job posting limits based on subscription plan

**Methods**:
- `comparePassword(candidatePassword)`: Password verification
- `canPostJob()`: Checks if recruiter can post more jobs based on plan
- `incrementJobPosting()`: Updates job posting counters
- `createPasswordResetToken()`: Generates secure reset token

**Indexes**:
- `email`: Unique index
- `company.name`: For company searches
- `company.industry`: For industry filtering
- `company.address.city`: For location-based searches
- `createdAt`: For sorting
- `isCompanyVerified`: For verified company filtering

---

### 3. Job Model (`models/Job.js`)

**Purpose**: Stores job postings with applicant tracking

**Schema Fields**:
```javascript
{
  title: String (required, trimmed)
  description: String (required, max 3000 chars)
  type: String (required, enum: full-time, part-time, contract, internship, remote)
  
  salary: {
    min: Number
    max: Number
    currency: String (default: USD)
  }
  
  location: {
    city: String
    state: String
    country: String
    remote: Boolean (default: false)
  }
  
  skills: [String]
  
  recruiter: ObjectId (required, ref: Recruiter)
  
  company: {
    name: String
    logo: String
    website: String
    industry: String
    size: String
  }
  
  perks: [String]
  benefits: [String]
  applicationDeadline: Date
  numberOfOpenings: Number (default: 1, min: 1)
  
  applicants: [{
    candidateId: ObjectId (ref: Candidate)
    status: String (enum: applied, interviewed, hired, rejected; default: applied)
    appliedAt: Date (default: now)
  }]
  
  savedBy: [ObjectId] (ref: Candidate) // Candidates who bookmarked this job
  
  isActive: Boolean (default: true)
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

**Indexes**:
- `{ title: "text", description: "text" }`: Text search index
- `skills`: For skill-based filtering
- Composite indexes for efficient queries

---

### 4. Interview Model (`models/Interview.js`)

**Purpose**: Manages interview scheduling between recruiters and candidates

**Schema Fields**:
```javascript
{
  job: ObjectId (required, ref: Job)
  candidate: ObjectId (required, ref: Candidate)
  recruiter: ObjectId (required, ref: Recruiter)
  
  title: String (required, trimmed)
  description: String (max 1000 chars)
  type: String (required, enum: video, phone, in-person)
  
  scheduledDateTime: Date (required, must be future date)
  duration: Number (required, min: 15 minutes, max: 480 minutes/8 hours)
  
  location: String (required if type = in-person)
  meetingLink: String (required if type = video, validated URL)
  phoneNumber: String (required if type = phone)
  
  status: String (enum: scheduled, rescheduled, completed, cancelled, no-show; default: scheduled)
  
  notes: {
    recruiterNotes: String
    candidateNotes: String
    interviewNotes: String
  }
  
  feedback: {
    rating: Number (min: 1, max: 5)
    comments: String
    strengths: [String]
    weaknesses: [String]
    recommendation: String (enum: hire, reject, maybe, next-round)
  }
  
  reminders: {
    candidateReminded: Boolean (default: false)
    recruiterReminded: Boolean (default: false)
    lastReminderSent: Date
  }
  
  rescheduledFrom: Date
  rescheduledReason: String
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

**Virtual Fields**:
- `endDateTime`: Calculates end time (scheduledDateTime + duration)
- `formattedDuration`: Returns human-readable duration (e.g., "1h 30m")

**Middleware (Pre-save)**:
- Updates job applicant status to "interviewed" when interview is created

**Indexes**:
- `{ job, candidate }`: Composite index
- `{ recruiter, scheduledDateTime }`: For recruiter's schedule
- `{ candidate, scheduledDateTime }`: For candidate's schedule
- `status`: For filtering by status
- `scheduledDateTime`: For date-based queries

---

## Authentication & Authorization

### JWT Token-Based Authentication

**Token Generation** (`controllers/authCandidate.js` & `controllers/authRecruiter.js`):
```javascript
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });
};
```

**Token Flow**:
1. User logs in with email/password
2. Server verifies credentials
3. Server generates JWT token with user ID
4. Token sent to client in JSON response
5. Client stores token (localStorage)
6. Client includes token in `Authorization: Bearer <token>` header
7. Server validates token on protected routes

### Middleware (`middleware/auth.js`)

**1. General Authentication (`protect`)**:
```javascript
// Used for routes accessible by both candidates and recruiters
// Verifies JWT and determines user type automatically
// Attaches req.user and req.userType to request
```

**2. Candidate-Only Authentication (`protectCandidate`)**:
```javascript
// Used for candidate-specific routes (resume upload, job applications)
// Ensures only authenticated candidates can access
```

**3. Recruiter-Only Authentication (`protectRecruiter`)**:
```javascript
// Used for recruiter-specific routes (job posting, viewing resumes)
// Ensures only authenticated recruiters can access
```

**Authentication Process**:
```
1. Extract token from Authorization header
2. Verify token using JWT_SECRET
3. Decode token to get user ID
4. Query database for user (check Candidate first, then Recruiter)
5. Verify account is active
6. Attach user info to request object (req.user, req.userType)
7. Call next() to proceed to controller
```

**Password Security**:
- Passwords hashed using bcryptjs with 12 rounds (configurable via `BCRYPT_ROUNDS`)
- Passwords never returned in API responses (`select: false` in schema)
- Password comparison uses bcrypt's secure compare function

---

## API Endpoints

### Candidate Authentication Routes (`/api/auth/candidate`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new candidate |
| POST | `/login` | Public | Login candidate |
| POST | `/reset-password` | Public | Reset forgotten password |
| GET | `/me` | Private | Get current candidate profile |
| PUT | `/profile` | Private | Update candidate profile |
| PUT | `/password` | Private | Change password |
| DELETE | `/account` | Private | Deactivate account |
| GET | `/dashboard` | Private | Get dashboard statistics |

**Register Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890",
  "dateOfBirth": "1995-05-15",
  "address": {
    "city": "New York",
    "state": "NY",
    "country": "USA"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 3
}
```

**Login Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "candidate": {
      "_id": "64abc123...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "profileCompleteness": 75
    }
  }
}
```

---

### Recruiter Authentication Routes (`/api/auth/recruiter`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new recruiter |
| POST | `/login` | Public | Login recruiter |
| POST | `/reset-password` | Public | Reset forgotten password |
| GET | `/me` | Private | Get current recruiter profile |
| PUT | `/profile` | Private | Update recruiter profile |
| PUT | `/password` | Private | Change password |
| DELETE | `/account` | Private | Deactivate account |
| GET | `/dashboard` | Private | Get dashboard statistics |

**Register Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@company.com",
  "password": "SecurePass123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-03-20",
  "position": "HR Manager",
  "department": "HR",
  "company": {
    "name": "Tech Corp",
    "industry": "Technology",
    "size": "201-1000",
    "website": "https://techcorp.com",
    "description": "Leading tech company",
    "address": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    }
  }
}
```

---

### Job Routes (`/api/jobs`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all active jobs (with filters) |
| GET | `/:id` | Public | Get job details by ID |
| GET | `/saved` | Private (Candidate) | Get candidate's saved jobs |
| GET | `/applications` | Private (Candidate) | Get candidate's applications |
| GET | `/recruiter/myjobs` | Private (Recruiter) | Get recruiter's posted jobs |
| GET | `/recruiter/applicants` | Private (Recruiter) | Get all applicants for recruiter's jobs |
| POST | `/` | Private (Recruiter) | Create new job posting |
| POST | `/:id/apply` | Private (Candidate) | Apply to a job |
| POST | `/:id/save` | Private (Candidate) | Save/bookmark a job |
| DELETE | `/:id/unsave` | Private (Candidate) | Remove job bookmark |
| PUT | `/:id` | Private (Recruiter) | Update job posting |
| DELETE | `/:id` | Private (Recruiter) | Delete/deactivate job |
| PUT | `/:id/status` | Private (Recruiter) | Update applicant status |

**Get All Jobs Query Parameters**:
- `search`: Search in title, company name, description, skills
- `location`: Filter by city, state, country, or "remote"
- `type`: Filter by job type (full-time, part-time, etc.)
- `salary`: Filter by salary range (e.g., "50000-100000")
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Example**: `GET /api/jobs?search=developer&location=remote&type=full-time&page=1&limit=10`

**Create Job Request**:
```json
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for an experienced developer...",
  "type": "full-time",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "remote": true
  },
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "perks": ["Health Insurance", "401k", "Remote Work"],
  "benefits": ["Flexible Hours", "Gym Membership"],
  "applicationDeadline": "2025-12-31",
  "numberOfOpenings": 2
}
```

**Apply to Job Response**:
```json
{
  "message": "Successfully applied to job",
  "job": {
    "_id": "64abc...",
    "title": "Senior Full Stack Developer",
    "applicants": [...]
  }
}
```

---

### Interview Routes (`/api/interviews`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private (Recruiter) | Schedule new interview |
| GET | `/recruiter` | Private (Recruiter) | Get recruiter's interviews |
| GET | `/candidate` | Private (Candidate) | Get candidate's interviews |
| GET | `/:id` | Private | Get interview details |
| PUT | `/:id` | Private | Update/reschedule interview |
| PUT | `/:id/feedback` | Private (Recruiter) | Add interview feedback |
| PUT | `/:id/status` | Private | Update interview status |
| DELETE | `/:id` | Private | Cancel interview |

**Schedule Interview Request**:
```json
{
  "jobId": "64abc...",
  "candidateId": "64def...",
  "title": "Technical Interview - Full Stack Developer",
  "description": "Technical assessment and coding challenge",
  "type": "video",
  "scheduledDateTime": "2025-11-15T10:00:00Z",
  "duration": 60,
  "meetingLink": "https://zoom.us/j/123456789",
  "notes": "Please prepare coding environment"
}
```

**Get Interviews Query Parameters**:
- `status`: Filter by status (scheduled, completed, cancelled, etc.)
- `date`: Filter by specific date (YYYY-MM-DD)

---

### Resume Routes (`/api/candidate`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/upload-resume` | Private (Candidate) | Upload resume PDF |
| GET | `/profile` | Private (Candidate) | Get candidate profile with resume |
| PUT | `/profile` | Private (Candidate) | Update candidate profile |
| GET | `/view/:candidateId` | Private (Recruiter) | View/download candidate resume |

**Upload Resume**:
- Content-Type: `multipart/form-data`
- Field name: `resume`
- Allowed format: PDF only
- File stored in `server/uploads/resumes/`
- Filename format: `{timestamp}-{random}-{originalname}`

**Resume Upload Response**:
```json
{
  "message": "Resume uploaded successfully",
  "resume": {
    "filename": "1698765432100-987654321-John_Doe_Resume.pdf",
    "originalName": "John_Doe_Resume.pdf",
    "path": "/uploads/resumes/1698765432100-987654321-John_Doe_Resume.pdf",
    "size": 245678,
    "uploadDate": "2025-10-29T10:30:00Z"
  }
}
```

---

## Data Flow & Workflow

### 1. Candidate Registration & Login Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     CANDIDATE REGISTRATION                    │
└──────────────────────────────────────────────────────────────┘

Frontend (React)
    │
    │ 1. User fills registration form
    │    - Personal info (name, email, password, DOB, phone)
    │    - Professional info (skills, experience)
    │
    ▼
candidateAPI.register(userData)
    │
    │ 2. POST /api/auth/candidate/register
    │    Content-Type: application/json
    │    Body: { firstName, lastName, email, password, ... }
    │
    ▼
server.js → Express Router
    │
    │ 3. Route: /api/auth/candidate → authCandidate route
    │
    ▼
routes/authCandidate.js
    │
    │ 4. Apply validation middleware (express-validator)
    │    - Check field formats and requirements
    │    - Validate email format
    │    - Validate password strength (min 6 chars, uppercase, lowercase, number)
    │    - Validate age (must be 18+)
    │
    ▼
controllers/authCandidate.js → registerCandidate()
    │
    │ 5. Check if email already exists
    │    - Query: Candidate.findOne({ email })
    │    - Return 409 Conflict if exists
    │
    │ 6. Create new candidate document
    │    - Candidate.create(userData)
    │
    ▼
models/Candidate.js → Pre-save Middleware
    │
    │ 7. Hash password with bcrypt (12 rounds)
    │ 8. Calculate profileCompleteness (based on filled fields)
    │ 9. Save to MongoDB
    │
    ▼
controllers/authCandidate.js
    │
    │ 10. Generate JWT token
    │     - jwt.sign({ id: candidate._id }, JWT_SECRET, { expiresIn: '1d' })
    │
    │ 11. Send response
    │
    ▼
Frontend receives response
    │
    │ {
    │   "success": true,
    │   "token": "eyJhbGc...",
    │   "data": {
    │     "candidate": { ... }
    │   }
    │ }
    │
    │ 12. Store token in localStorage
    │ 13. Redirect to candidate dashboard
    │
    ▼
✓ Registration Complete
```

### 2. Job Posting & Application Flow

```
┌──────────────────────────────────────────────────────────────┐
│              RECRUITER POSTS JOB → CANDIDATE APPLIES          │
└──────────────────────────────────────────────────────────────┘

RECRUITER SIDE:
──────────────

1. Recruiter logs in
   └─→ Receives JWT token
   
2. Recruiter navigates to "Post Job" page
   
3. Fills job posting form:
   - Title, description, type
   - Salary range, location
   - Required skills
   - Benefits, perks
   - Application deadline
   
4. Frontend: jobAPI.createJob(jobData)
   └─→ POST /api/jobs
       Headers: { Authorization: "Bearer <token>" }
       Body: { title, description, type, ... }
       
5. Server receives request
   └─→ Middleware: protect() validates token
       └─→ Decodes JWT, finds recruiter
       └─→ Attaches req.user and req.userType = 'recruiter'
       
6. Controller: jobs.js → createJob()
   - Verifies req.userType === 'recruiter'
   - Creates new Job document
   - Sets job.recruiter = req.user.id
   - Sets job.company = recruiter.company (from recruiter profile)
   
7. Update Recruiter stats:
   - Push job._id to recruiter.jobPostings[]
   - Increment recruiter.stats.totalJobsPosted
   - Increment recruiter.stats.activeJobs
   - Update subscription usage
   
8. Save Job to MongoDB
   └─→ Job.save()
   
9. Return job data to frontend
   └─→ Response: { job: { _id, title, ... } }

CANDIDATE SIDE:
───────────────

10. Candidate browses jobs
    └─→ GET /api/jobs?search=developer&location=remote
        └─→ Public route (no authentication)
        └─→ Returns paginated job list
        
11. Candidate views job details
    └─→ GET /api/jobs/:id
        └─→ Returns full job info + company details
        
12. Candidate clicks "Apply"
    └─→ POST /api/jobs/:id/apply
        Headers: { Authorization: "Bearer <candidate-token>" }
        
13. Server validates:
    - protect() middleware authenticates candidate
    - Checks req.userType === 'candidate'
    - Verifies job exists and isActive === true
    - Checks if candidate already applied
    
14. Application Processing:
    a) Add candidate to job.applicants[]
       └─→ {
             candidateId: req.user.id,
             status: 'applied',
             appliedAt: Date.now()
           }
    
    b) Update candidate.applications[]
       └─→ {
             jobId: job._id,
             appliedDate: Date.now(),
             status: 'applied'
           }
    
    c) Update recruiter statistics
       └─→ recruiter.stats.totalApplicationsReceived++
    
15. Save changes to MongoDB
    └─→ await job.save()
    └─→ await candidate.save()
    └─→ await recruiter.save()
    
16. Return success response
    └─→ { message: "Successfully applied to job", job }
    
17. Frontend updates UI
    - Shows "Applied" status
    - Disables apply button
    - Adds to candidate's application tracker

DATABASE STATE AFTER APPLICATION:
─────────────────────────────────

Job Document:
{
  _id: "64abc...",
  title: "Senior Developer",
  recruiter: "64xyz...",
  applicants: [
    {
      candidateId: "64def...",
      status: "applied",
      appliedAt: "2025-10-29T10:30:00Z"
    }
  ],
  ...
}

Candidate Document:
{
  _id: "64def...",
  firstName: "John",
  applications: [
    {
      jobId: "64abc...",
      appliedDate: "2025-10-29T10:30:00Z",
      status: "applied"
    }
  ],
  ...
}

Recruiter Document:
{
  _id: "64xyz...",
  jobPostings: ["64abc...", ...],
  stats: {
    totalJobsPosted: 5,
    activeJobs: 3,
    totalApplicationsReceived: 15,
    totalHires: 2
  },
  ...
}
```

### 3. Interview Scheduling Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   INTERVIEW SCHEDULING                        │
└──────────────────────────────────────────────────────────────┘

1. Recruiter views job applicants
   └─→ GET /api/jobs/recruiter/applicants
       └─→ Returns all candidates who applied to recruiter's jobs
       
2. Recruiter selects candidate for interview
   └─→ Clicks "Schedule Interview" button
   
3. Frontend shows interview scheduling form
   - Interview title
   - Type (video/phone/in-person)
   - Date & time
   - Duration
   - Meeting link/phone/location (based on type)
   - Notes
   
4. Frontend: interviewAPI.scheduleInterview(data)
   └─→ POST /api/interviews
       Headers: { Authorization: "Bearer <recruiter-token>" }
       Body: {
         jobId, candidateId, title, type,
         scheduledDateTime, duration, meetingLink, ...
       }
       
5. Server: routes/interviews.js
   └─→ protect() middleware authenticates recruiter
   
6. Controller validation:
   a) Verify job exists
      └─→ Job.findById(jobId).populate('recruiter')
      
   b) Verify recruiter owns the job
      └─→ if (job.recruiter._id !== req.user.id) → 403 Forbidden
      
   c) Verify candidate exists and applied
      └─→ Candidate.findById(candidateId)
      └─→ Check if candidateId in job.applicants[]
      
   d) Check for scheduling conflicts
      └─→ Find overlapping interviews for candidate OR recruiter
      └─→ If conflict found → 400 Bad Request
      
7. Create Interview document:
   └─→ new Interview({
         job: jobId,
         candidate: candidateId,
         recruiter: req.user.id,
         title, description, type,
         scheduledDateTime, duration,
         location/meetingLink/phoneNumber (based on type),
         status: 'scheduled',
         notes: { recruiterNotes }
       })
       
8. Save interview to MongoDB
   └─→ await interview.save()
   
9. Pre-save middleware (Interview model):
   └─→ Update job applicant status to 'interviewed'
       └─→ Job.updateOne(
             { _id: jobId, "applicants.candidateId": candidateId },
             { $set: { "applicants.$.status": "interviewed" } }
           )
           
10. Populate interview with related data
    └─→ .populate('job', 'title company')
    └─→ .populate('candidate', 'firstName lastName email')
    └─→ .populate('recruiter', 'firstName lastName email')
    
11. Return response to frontend
    └─→ {
          message: "Interview scheduled successfully",
          interview: { ... }
        }
        
12. Frontend updates UI
    - Shows success notification
    - Displays interview in calendar
    - (In production: Send email notifications)

CANDIDATE VIEWS INTERVIEWS:
──────────────────────────

13. Candidate logs in and checks "Interviews"
    └─→ GET /api/interviews/candidate
        Headers: { Authorization: "Bearer <candidate-token>" }
        
14. Server returns candidate's interviews
    └─→ Interview.find({ candidate: req.user.id })
        └─→ .populate('job', 'title company location description')
        └─→ .populate('recruiter', 'firstName lastName email company.name')
        └─→ .sort({ scheduledDateTime: 1 })
        
15. Frontend displays interview list
    - Upcoming interviews
    - Past interviews
    - Interview status (scheduled/completed/cancelled)
```

### 4. Resume Upload & View Flow

```
┌──────────────────────────────────────────────────────────────┐
│               RESUME UPLOAD & RECRUITER VIEW                  │
└──────────────────────────────────────────────────────────────┘

CANDIDATE UPLOADS RESUME:
─────────────────────────

1. Candidate navigates to "Upload Resume" page
   
2. Selects PDF file from computer
   └─→ File input: <input type="file" accept=".pdf" />
   
3. Frontend: candidateAPI.uploadResume(file)
   └─→ POST /api/candidate/upload-resume
       Content-Type: multipart/form-data
       Body: FormData with 'resume' field
       Headers: { Authorization: "Bearer <candidate-token>" }
       
4. Server: routes/resume.js
   └─→ protectCandidate() middleware authenticates
   └─→ multer middleware processes file upload
   
5. Multer configuration:
   - Destination: server/uploads/resumes/
   - Filename: {timestamp}-{random}-{originalname}
   - File filter: Only PDFs allowed
   
6. Controller:
   a) Find candidate: Candidate.findById(req.user.id)
   
   b) Update candidate.resume field:
      └─→ {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            uploadDate: Date.now()
          }
          
   c) Save candidate: await candidate.save()
   
7. Return response:
   └─→ {
         message: "Resume uploaded successfully",
         resume: { filename, originalName, size, ... }
       }
       
8. Frontend updates UI
   - Shows success message
   - Displays resume preview/download link
   - Updates profile completeness

RECRUITER VIEWS CANDIDATE RESUME:
─────────────────────────────────

9. Recruiter views job applicants
   └─→ GET /api/jobs/recruiter/applicants
   
10. For each applicant, frontend shows "View Resume" button
    
11. Recruiter clicks "View Resume"
    └─→ GET /api/candidate/view/:candidateId
        Headers: { Authorization: "Bearer <recruiter-token>" }
        
12. Server: routes/resume.js → GET /view/:candidateId
    └─→ protectRecruiter() middleware authenticates
    
13. Controller validation:
    a) Find candidate: Candidate.findById(candidateId)
       └─→ .select('resume firstName lastName')
       
    b) Check if candidate exists
       └─→ if (!candidate) → 404 Not Found
       
    c) Check if resume exists
       └─→ if (!candidate.resume.path) → 404 Resume Not Found
       
    d) Verify file exists on filesystem
       └─→ fs.existsSync(filePath)
       
14. Serve PDF file:
    └─→ res.setHeader('Content-Type', 'application/pdf')
    └─→ res.setHeader('Content-Disposition', 'inline; filename="..."')
    └─→ res.sendFile(path.resolve(filePath))
    
15. Browser receives PDF
    └─→ Opens in browser's PDF viewer
    └─→ Or downloads file (based on browser settings)
```

---

## File Organization

### 1. `server.js` - Application Entry Point

**Purpose**: Initializes and configures the Express server

**Key Functions**:
```javascript
// 1. Import dependencies
require("dotenv").config();          // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 2. Initialize Express app
const app = express();

// 3. Connect to MongoDB
connectDB();  // From config/db.js

// 4. Configure middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Mount route handlers
app.use('/api/auth/candidate', candidateAuthRoutes);
app.use('/api/auth/recruiter', recruiterAuthRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidate', resumeRoutes);
app.use('/api/interviews', interviewRoutes);

// 6. Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: "Server is running!" });
});

// 7. Global error handler
app.use((err, req, res, next) => {
    // Handle ValidationError, CastError, duplicate key errors
    // Return appropriate error response
});

// 8. 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 9. Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

### 2. `config/db.js` - Database Configuration

**Purpose**: Establishes MongoDB connection and handles connection events

**Key Functions**:
```javascript
const connectDB = async () => {
    try {
        // 1. Get MongoDB URI from environment
        const mongoUri = process.env.MONGODB_URI;
        
        // 2. Connect to MongoDB
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // 3. Recreate indexes (for Job model text search)
        await mongoose.connection.db.collection('jobs').dropIndexes();
        
        // 4. Set up connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
        // 5. Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
```

---

### 3. Controllers - Business Logic Layer

**Controllers handle**:
- Request validation
- Database queries
- Business logic execution
- Response formatting
- Error handling

**Example: `controllers/jobs.js`**:
```javascript
// getAllJobs - Public route with filtering
exports.getAllJobs = async (req, res) => {
    try {
        const { search, location, type, salary, page, limit } = req.query;
        const query = { isActive: true };
        
        // Build query based on filters
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'company.name': { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        
        // Apply other filters...
        
        // Execute query with pagination
        const jobs = await Job.find(query)
            .populate('recruiter', 'company')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Job.countDocuments(query);
        
        res.json({
            jobs,
            totalJobs: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// createJob - Private route (Recruiter only)
exports.createJob = async (req, res) => {
    try {
        // 1. Verify user is recruiter
        if (req.userType !== 'recruiter') {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        // 2. Extract job data from request
        const { title, description, type, salary, ... } = req.body;
        
        // 3. Create new job
        const newJob = new Job({
            ...req.body,
            recruiter: req.user.id,
            isActive: true
        });
        
        // 4. Save job
        const job = await newJob.save();
        
        // 5. Update recruiter's stats
        const recruiter = await Recruiter.findById(req.user.id);
        recruiter.jobPostings.push(job._id);
        recruiter.stats.totalJobsPosted++;
        recruiter.stats.activeJobs++;
        await recruiter.save();
        
        // 6. Return response
        res.status(201).json(job);
        
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
```

---

### 4. Routes - URL Mapping Layer

**Routes define**:
- HTTP methods (GET, POST, PUT, DELETE)
- URL patterns
- Middleware chain
- Controller functions
- Input validation rules

**Example: `routes/jobs.js`**:
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const jobController = require('../controllers/jobs');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Candidate routes (must be above :id routes)
router.get('/saved', protect, jobController.getSavedJobs);
router.get('/applications', protect, jobController.getCandidateApplications);
router.post('/:id/apply', protect, jobController.applyToJob);
router.post('/:id/save', protect, jobController.saveJob);
router.delete('/:id/unsave', protect, jobController.unsaveJob);

// Recruiter routes
router.get('/recruiter/myjobs', protect, jobController.getRecruiterJobs);
router.post('/', protect, jobController.createJob);
router.put('/:id', protect, jobController.updateJob);
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router;
```

**Route Order Matters**:
1. Specific routes (`/saved`, `/applications`) BEFORE parameter routes (`/:id`)
2. Otherwise `/:id` would match `/saved` and look for job with ID "saved"

---

### 5. Middleware - Request Processing Layer

**Middleware functions**:
- Execute before controller
- Can modify request/response objects
- Must call `next()` to continue
- Can end request-response cycle

**Example: `middleware/auth.js` - protect middleware**:
```javascript
const protect = async (req, res, next) => {
    try {
        let token;
        
        // 1. Extract token from Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }
        
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Find user (try Candidate first, then Recruiter)
        let user = await Candidate.findById(decoded.id);
        let userType = 'candidate';
        
        if (!user) {
            user = await Recruiter.findById(decoded.id);
            userType = 'recruiter';
        }
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        
        // 5. Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account deactivated"
            });
        }
        
        // 6. Attach user info to request
        req.user = user;
        req.userType = userType;
        
        // 7. Continue to controller
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }
};
```

---

### 6. Models - Data Schema Layer

**Models define**:
- Field types and constraints
- Validation rules
- Default values
- Indexes for performance
- Virtual fields
- Instance methods
- Static methods
- Pre/post hooks (middleware)

**Example: Candidate Model Features**:
```javascript
// 1. Schema definition with validation
const candidateSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"]
    },
    // ... other fields
});

// 2. Virtual fields (computed, not stored)
candidateSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// 3. Pre-save middleware (runs before saving)
candidateSchema.pre('save', async function(next) {
    // Hash password if modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// 4. Instance methods (available on documents)
candidateSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// 5. Indexes for query performance
candidateSchema.index({ skills: 1 });
candidateSchema.index({ 'applications.jobId': 1 });

// 6. Export model
module.exports = mongoose.model('Candidate', candidateSchema);
```

---

## Security Implementation

### 1. Password Security
- **Hashing**: bcryptjs with 12 rounds (configurable)
- **Storage**: Passwords never stored in plain text
- **Queries**: `select: false` prevents password from being returned
- **Comparison**: Using bcrypt.compare() prevents timing attacks

### 2. JWT Token Security
- **Secret**: Stored in environment variable (JWT_SECRET)
- **Expiration**: Tokens expire after 24 hours (configurable)
- **Storage**: Client-side in localStorage (consider httpOnly cookies for production)
- **Verification**: Every protected route verifies token signature

### 3. Input Validation
- **express-validator**: Validates and sanitizes user input
- **Mongoose validation**: Schema-level validation
- **Type checking**: Ensures correct data types
- **Custom validators**: Age verification, URL format, etc.

### 4. Authorization
- **Role-based**: Separate middleware for candidates and recruiters
- **Ownership verification**: Users can only modify their own data
- **Resource access**: Recruiters can only view resumes of applicants

### 5. CORS Configuration
```javascript
cors({
    origin: [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
})
```

### 6. File Upload Security
- **File type restriction**: Only PDFs allowed for resumes
- **File size limit**: Configurable (currently 10MB for JSON, multer defaults for files)
- **Filename sanitization**: Random prefixes prevent collisions and security issues
- **Storage location**: Outside public web directory

### 7. MongoDB Security
- **Connection string**: Stored in environment variables
- **Mongoose schemas**: Prevent NoSQL injection
- **Validation**: Schema validation before saving
- **Indexes**: Improve performance and prevent resource exhaustion

---

## Error Handling

### Global Error Handler (`server.js`)
```javascript
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // Invalid ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    
    // Duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate field value entered'
        });
    }
    
    // Generic error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

## Frontend-Backend Communication

### API Client (`client/src/utils/api.js`)

**Base Configuration**:
```javascript
const API_BASE_URL = "http://localhost:5000/api";

const makeRequest = async (url, options = {}) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    };
    
    // Add authorization token if exists
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    
    return data;
};
```

**Usage in React Components**:
```javascript
import { candidateAPI } from '../utils/api';

// Login
const handleLogin = async (credentials) => {
    try {
        const response = await candidateAPI.login(credentials);
        // Store token
        localStorage.setItem('token', response.token);
        // Update UI
        navigate('/dashboard');
    } catch (error) {
        console.error(error.message);
    }
};

// Get jobs
const fetchJobs = async () => {
    try {
        const data = await jobAPI.getAllJobs({ search, location, type });
        setJobs(data.jobs);
    } catch (error) {
        console.error(error.message);
    }
};
```

---

## Environment Variables (.env)

Required environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/job-orbit
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-orbit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Bcrypt Configuration
BCRYPT_ROUNDS=12

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## Database Queries & Performance

### Optimized Queries

**1. Pagination**:
```javascript
const jobs = await Job.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
```

**2. Population** (JOIN-like operations):
```javascript
const job = await Job.findById(id)
    .populate('recruiter', 'company firstName lastName')
    .populate('applicants.candidateId', 'firstName lastName email skills');
```

**3. Text Search**:
```javascript
// Schema index: { title: "text", description: "text" }
const jobs = await Job.find({ $text: { $search: searchQuery } });
```

**4. Filtering**:
```javascript
const query = {
    isActive: true,
    type: 'full-time',
    'location.city': { $regex: 'New York', $options: 'i' },
    'salary.min': { $gte: 50000 }
};
```

---

## Testing the Backend

### Using Postman/Thunder Client

**1. Register Candidate**:
```
POST http://localhost:5000/api/auth/candidate/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890",
  "dateOfBirth": "1995-05-15"
}
```

**2. Login**:
```
POST http://localhost:5000/api/auth/candidate/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJI..."
}
```

**3. Get Profile (Protected)**:
```
GET http://localhost:5000/api/auth/candidate/me
Authorization: Bearer eyJhbGciOiJI...
```

**4. Create Job (Recruiter)**:
```
POST http://localhost:5000/api/jobs
Authorization: Bearer <recruiter-token>
Content-Type: application/json

{
  "title": "Senior Developer",
  "description": "We're hiring!",
  "type": "full-time",
  "salary": { "min": 80000, "max": 120000 },
  "location": { "city": "New York", "state": "NY", "country": "USA" },
  "skills": ["JavaScript", "React", "Node.js"]
}
```

---

## Deployment Considerations

### Production Checklist

1. **Environment Variables**:
   - Use strong JWT_SECRET (32+ random characters)
   - Set NODE_ENV=production
   - Use production MongoDB URI

2. **Security**:
   - Enable HTTPS
   - Use httpOnly cookies for tokens
   - Implement rate limiting
   - Add helmet.js for security headers
   - Enable CORS only for production domain

3. **Database**:
   - Use MongoDB Atlas or managed database
   - Set up database backups
   - Enable authentication
   - Configure connection pooling

4. **Performance**:
   - Enable compression middleware
   - Implement caching (Redis)
   - Optimize database queries
   - Add logging (Winston/Morgan)

5. **Error Handling**:
   - Don't expose stack traces in production
   - Implement proper logging
   - Set up error monitoring (Sentry)

6. **File Storage**:
   - Use cloud storage (AWS S3, Azure Blob) instead of local filesystem
   - Implement file size limits
   - Scan uploaded files for malware

---

## Conclusion

This Job Orbit backend is a well-structured RESTful API built with:
- **Express.js** for server framework
- **MongoDB** with Mongoose for database
- **JWT** for authentication
- **Bcrypt** for password security
- **Multer** for file uploads
- **Express-validator** for input validation

The architecture follows best practices with:
- Clear separation of concerns (MVC pattern)
- Role-based authentication and authorization
- Comprehensive error handling
- Input validation and sanitization
- Secure password handling
- Efficient database queries with indexes
- Proper documentation

The system supports two main user types (Candidates and Recruiters) with features for job posting, job applications, resume management, and interview scheduling, all connected through a well-designed MongoDB schema with proper relationships and data integrity.

---

## Quick Reference

### Server Commands
```bash
# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev

# Start production server
npm start
```

### Key Files
- **Entry Point**: `server/server.js`
- **Database Config**: `server/config/db.js`
- **Auth Middleware**: `server/middleware/auth.js`
- **Models**: `server/models/*.js`
- **Controllers**: `server/controllers/*.js`
- **Routes**: `server/routes/*.js`

### Port Configuration
- **Backend Server**: Port 5000 (configurable)
- **Frontend Client**: Port 5173 (Vite) or 3000 (CRA)

---

**Document Version**: 1.0  
**Last Updated**: October 29, 2025  
**Created For**: Backend Evaluation & Documentation
