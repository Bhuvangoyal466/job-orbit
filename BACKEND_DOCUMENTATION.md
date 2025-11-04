# JobOrbit Backend Documentation

## 🎯 Project Overview
JobOrbit is a full-stack job board application with resume parsing and interview management capabilities. The backend is built using Node.js, Express.js, and MongoDB, providing RESTful APIs for candidate and recruiter functionalities.

---

## 🏗️ Backend Architecture

### Technology Stack
- **Runtime Environment**: Node.js
- **Web Framework**: Express.js (v4.18.2)
- **Database**: MongoDB with Mongoose ODM (v8.16.5)
- **Authentication**: JWT (JSON Web Tokens) v9.0.2
- **Password Hashing**: bcryptjs v3.0.2
- **Input Validation**: express-validator v7.0.1
- **File Upload**: Multer v2.0.2
- **Cross-Origin Resource Sharing**: CORS v2.8.5
- **Environment Variables**: dotenv v16.3.1
- **External Communication**: node-fetch, form-data

---

## 📁 Backend File Structure

```
server/
├── server.js                    # Main server entry point
├── package.json                 # Dependencies and scripts
├── config/
│   └── db.js                   # MongoDB connection configuration
├── controllers/                 # Business logic handlers
│   ├── authCandidate.js        # Candidate authentication logic
│   ├── authRecruiter.js        # Recruiter authentication logic
│   └── jobs.js                 # Job management logic
├── middleware/                  # Custom Express middleware
│   └── auth.js                 # JWT authentication & authorization
├── models/                      # MongoDB/Mongoose schemas
│   ├── Candidate.js            # Candidate data model
│   ├── Interview.js            # Interview data model
│   ├── Job.js                  # Job posting data model
│   └── Recruiter.js            # Recruiter data model
├── routes/                      # API route definitions
│   ├── authCandidate.js        # Candidate authentication routes
│   ├── authRecruiter.js        # Recruiter authentication routes
│   ├── interviews.js           # Interview management routes
│   ├── jobs.js                 # Job management routes
│   └── resume.js               # Resume upload & parsing routes
├── services/                    # External service integrations
│   └── resumeParser.js         # AI resume parsing service
└── uploads/                     # File storage
    └── resumes/                # Resume PDF files storage
```

---

## 🔌 Database Connection

### MongoDB Configuration (`config/db.js`)
- **Connection**: Mongoose-based MongoDB connection
- **Environment Variables**: Uses `MONGODB_URI` or `MONGO_URI`
- **Features**:
  - Automatic connection retry
  - Graceful shutdown handling
  - Index management (drops and recreates indexes on startup)
  - Connection event monitoring (error, disconnected)
  - Process termination handling with proper cleanup

### Database Structure
- **Primary Database**: MongoDB (NoSQL)
- **ODM**: Mongoose for data modeling and validation
- **Connection Pooling**: Handled automatically by Mongoose
- **Indexing**: Text search indexes on jobs collection for title and description

---

## 🗄️ Data Models (Schemas)

### 1. Candidate Model (`models/Candidate.js`)
```javascript
// Personal Information
- firstName, lastName (required, trimmed, max 50 chars)
- email (required, unique, validated format)
- password (required, min 6 chars, hashed with bcrypt)
- phone (required, regex validated)
- dateOfBirth (required, age validation ≥18)

// Address Information
- address: { street, city, state, zipCode, country }

// Professional Information
- experience (number, default 0)
- skills (array of strings)
- education (array of degree objects)
- projects (array of project objects)
- certifications (array of certification objects)

// Application Management
- applications (array of job applications with status)
- savedJobs (array of saved job references)
- resume (file information object)
- profileCompleteness (calculated percentage)

// Account Management
- isActive (boolean, default true)
- isEmailVerified (boolean, default false)
- loginAttempts, lockUntil, isLocked (security features)
```

### 2. Recruiter Model (`models/Recruiter.js`)
```javascript
// Personal Information
- firstName, lastName (required, validated)
- email (required, unique, validated)
- password (required, hashed)
- phone (required, validated)
- dateOfBirth (required, age ≥18)

// Company Information
- company: {
    name (required),
    industry (enum: Technology, Healthcare, Finance, etc.),
    size (enum: 1-10, 11-50, 51-200, etc.),
    website, description, address, logo
  }

// Subscription Information
- subscription: {
    type (enum: free, premium, enterprise),
    startDate, endDate, isActive
  }

// Management
- profileCompleteness (calculated)
- isActive (boolean)
```

### 3. Job Model (`models/Job.js`)
```javascript
// Job Details
- title (required)
- description (required, max 3000 chars)
- type (enum: full-time, part-time, contract, internship, remote)
- salary: { min, max, currency }
- location: { city, state, country, remote }

// Requirements & Details
- skills (array of required skills)
- perks, benefits (arrays)
- numberOfOpenings (default 1)
- applicationDeadline (date)

// Management
- recruiter (ObjectId reference)
- company (embedded object)
- applicants (array with candidate references and status)
- savedBy (array of candidate references)
- isActive (boolean, default true)

// Indexing
- Text index on title and description
- Index on skills for filtering
```

### 4. Interview Model (`models/Interview.js`)
```javascript
// References
- job (ObjectId to Job)
- candidate (ObjectId to Candidate)
- recruiter (ObjectId to Recruiter)

// Interview Details
- title, description
- type (enum: video, phone, in-person)
- scheduledDateTime (future date validation)
- duration (15-480 minutes)

// Meeting Information
- location (required for in-person)
- meetingLink (required for video)
- phoneNumber (required for phone)

// Status & Management
- status (enum: scheduled, rescheduled, completed, cancelled, no-show)
- notes: { recruiterNotes, candidateNotes, interviewNotes }
- feedback: { rating, comments, strengths, weaknesses, recommendation }
- reminders (array of reminder objects)
```

---

## 🔐 Authentication & Authorization

### JWT Authentication (`middleware/auth.js`)
**Features**:
- Bearer token authentication
- Automatic user type detection (candidate/recruiter)
- Role-based access control
- Token verification and expiration handling

**Middleware Functions**:
1. **`protect`**: General authentication (identifies user type)
2. **`protectCandidate`**: Candidate-specific protection
3. **`protectRecruiter`**: Recruiter-specific protection
4. **`authorize(...roles)`**: Role-based authorization

### Password Security
- **Hashing**: bcryptjs with salt rounds
- **Validation**: Minimum 6 characters, complexity requirements

### Token Management
- **Generation**: JWT with user ID payload
- **Expiration**: Configurable (default: 7 days)
- **Storage**: Frontend stores in localStorage
- **Format**: `Authorization: Bearer <token>`

---

## 🛣️ API Routes & Endpoints

### 1. Candidate Authentication (`routes/authCandidate.js`)
```
POST /api/auth/candidate/register     # Register new candidate
POST /api/auth/candidate/login        # Candidate login
POST /api/auth/candidate/reset-password # Reset password
GET  /api/auth/candidate/me           # Get current candidate profile
PUT  /api/auth/candidate/profile      # Update candidate profile
PUT  /api/auth/candidate/password     # Change password
DELETE /api/auth/candidate/account    # Deactivate account
GET  /api/auth/candidate/dashboard    # Dashboard statistics
```

### 2. Recruiter Authentication (`routes/authRecruiter.js`)
```
POST /api/auth/recruiter/register     # Register new recruiter
POST /api/auth/recruiter/login        # Recruiter login
POST /api/auth/recruiter/reset-password # Reset password
GET  /api/auth/recruiter/me           # Get current recruiter profile
PUT  /api/auth/recruiter/profile      # Update recruiter profile
PUT  /api/auth/recruiter/password     # Change password
PUT  /api/auth/recruiter/subscription # Update subscription
DELETE /api/auth/recruiter/account    # Deactivate account
GET  /api/auth/recruiter/dashboard    # Dashboard statistics

```

### 3. Job Management (`routes/jobs.js`)
```
# Public Routes
GET  /api/jobs                        # Get all jobs (with filtering)
GET  /api/jobs/:id                    # Get specific job details

# Candidate Protected Routes
GET  /api/jobs/saved                  # Get saved jobs
GET  /api/jobs/applications           # Get candidate's applications
POST /api/jobs/:id/apply              # Apply to a job
POST /api/jobs/:id/save               # Save a job
DELETE /api/jobs/:id/unsave           # Unsave a job

# Recruiter Protected Routes
GET  /api/jobs/recruiter/myjobs       # Get recruiter's posted jobs
GET  /api/jobs/recruiter/applicants   # Get job applicants
POST /api/jobs                        # Create new job posting
PUT  /api/jobs/:id                    # Update job posting
DELETE /api/jobs/:id                  # Delete job posting
PUT  /api/jobs/:id/status             # Update application status
```

### 4. Resume Management (`routes/resume.js`)
```
POST /api/resume/upload-resume        # Upload resume with AI parsing
GET  /api/resume/:filename            # Download/view resume file
PUT  /api/resume/update-profile       # Update profile from parsed data
GET  /api/resume/candidate/:id        # View candidate resume (recruiters)
```

### 5. Interview Management (`routes/interviews.js`)
```
POST /api/interviews                  # Schedule new interview (recruiter)
GET  /api/interviews                  # Get interviews (role-based filtering)
GET  /api/interviews/:id              # Get specific interview details
PUT  /api/interviews/:id              # Update interview details
DELETE /api/interviews/:id            # Cancel/delete interview
PUT  /api/interviews/:id/status       # Update interview status
POST /api/interviews/:id/feedback     # Add interview feedback
PUT  /api/interviews/:id/reschedule   # Reschedule interview
```

---

## 🔧 Controllers (Business Logic)

### 1. Candidate Controller (`controllers/authCandidate.js`)
**Key Functions**:
- `registerCandidate()`: User registration with validation
- `loginCandidate()`: Authentication with account status checking
- `getCurrentCandidate()`: Profile retrieval
- `updateCandidateProfile()`: Profile updates with completeness calculation
- `changePassword()`: Secure password change
- `getDashboardStats()`: Dashboard analytics
- `recalculateProfileCompleteness()`: Dynamic profile completion tracking

### 2. Recruiter Controller (`controllers/authRecruiter.js`)
**Key Functions**:
- `registerRecruiter()`: Recruiter registration with company details
- `loginRecruiter()`: Authentication and account validation
- `updateRecruiterProfile()`: Profile and company information updates
- `updateSubscription()`: Subscription plan management
- `getDashboardStats()`: Recruiter dashboard analytics


### 3. Jobs Controller (`controllers/jobs.js`)
**Key Functions**:
- `getAllJobs()`: Public job listings with search, filter, pagination
- `createJob()`: Job posting with limit validation
- `updateJob()`: Job modification (owner verification)
- `deleteJob()`: Job removal with applicant notification
- `applyToJob()`: Job application with duplicate prevention
- `saveJob()`: Job bookmarking functionality
- `getRecruiterJobs()`: Recruiter's job listings
- `updateApplicationStatus()`: Application status management

---

## 🔍 Data Validation & Error Handling

### Input Validation (`express-validator`)
**Validation Rules Applied**:
- **Email**: Format validation, normalization
- **Password**: Length, complexity (uppercase, lowercase, number)
- **Phone**: Regex pattern validation
- **Age**: Minimum 18 years validation
- **File Upload**: PDF only, size limits

**Error Response Format**:
```javascript
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Global Error Handling
- **Duplicate Key Errors**: MongoDB duplicate field handling
- **Validation Errors**: Mongoose validation error formatting
- **JWT Errors**: Token verification failure handling
- **File Upload Errors**: Multer error processing
- **404 Handling**: Route not found responses

---

## 📁 File Management

### Resume Upload System (`services/resumeParser.js`)
**File Storage**:
- **Storage**: Local file system (`uploads/resumes/`)
- **Naming**: Timestamp + random number + original name
- **Format**: PDF only (MIME type validation)
- **Size Limit**: Configurable through Multer

**AI Resume Parsing**:
- **Service**: External FastAPI microservice
- **Endpoint**: `POST /parse-resume/`
- **Process**: Upload → Parse → Extract data → Update profile
- **Data Extraction**: Skills, experience, education, contact info

---

## 🔄 Data Flow & Rendering Process

### 1. Authentication Flow
```
Client Request → JWT Middleware → Database Query → Response
```
1. Client sends request with Bearer token
2. `auth.js` middleware validates token
3. User information attached to `req.user`
4. Controller accesses user data for business logic
5. Database operations performed
6. JSON response sent to client

### 2. Job Application Flow
```
Candidate → Apply → Job Model → Recruiter Notification
```
1. Candidate applies to job via API
2. Application added to job's applicants array
3. Candidate's applications array updated
4. Status tracking enabled for both parties

### 3. Resume Processing Flow
```
Upload → File Storage → AI Parsing → Data Extraction → Profile Update
```
1. File uploaded via Multer middleware
2. Stored in local file system
3. Sent to AI parsing service
4. Parsed data returned
5. Candidate profile auto-updated with extracted information

---

## 🔧 Environment Configuration

### Required Environment Variables (`.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/joborbit

# Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-complex
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_PATH=./uploads

# Resume Parser Service
RESUME_PARSER_URL=http://127.0.0.1:8000
```

---

## 🚀 Server Setup & Initialization

### Main Server File (`server.js`)
**Configuration**:
1. **Express Setup**: App initialization with middleware
2. **Database Connection**: MongoDB connection via `connectDB()`
3. **CORS Configuration**: Multiple origin support for development
4. **Body Parsing**: JSON and URL-encoded data (10MB limit)
5. **Route Registration**: All API routes mounted
6. **Error Handling**: Global error middleware
7. **404 Handler**: Catch-all route for undefined endpoints

**Server Features**:
- **Port Configuration**: Environment variable or default 5000
- **Graceful Shutdown**: Proper database disconnection
- **Request Logging**: Development mode logging
- **Security Headers**: CORS and content type handling

---

## 📊 Data Relationships

### Entity Relationships
1. **Recruiter → Jobs**: One-to-many relationship
2. **Job → Applicants**: Many-to-many via embedded array
3. **Candidate → Applications**: Tracked in both models
4. **Interview → Job/Candidate/Recruiter**: Many-to-one relationships
5. **Candidate → SavedJobs**: Many-to-many reference array

### Data Integrity
- **Referential Integrity**: ObjectId references with population
- **Cascade Operations**: Manual handling for deletions
- **Validation**: Schema-level and application-level validation
- **Indexing**: Optimized queries for search and filtering

---

## 🔒 Security Features

### Implementation Details
1. **Password Security**: bcryptjs hashing with salt
2. **JWT Security**: Signed tokens with expiration
3. **Input Sanitization**: express-validator sanitization
4. **File Security**: MIME type validation, size limits
5. **Rate Limiting**: Application-level controls
6. **Account Security**: Login attempt limiting, account locking

### Access Control
- **Role-Based Access**: Separate candidate/recruiter permissions
- **Resource Ownership**: Users can only access their own data

- **Subscription Management**: Plan-based feature access

---

## 🎯 Key Backend Features

### 1. Smart Job Search & Filtering
- **Text Search**: MongoDB text indexes for title/description
- **Skill Matching**: Array-based skill filtering
- **Location Search**: City, state, country, and remote options
- **Salary Range**: Min/max salary filtering
- **Pagination**: Efficient data loading

### 2. Resume Processing & AI Integration
- **File Upload**: Secure PDF handling
- **AI Parsing**: External service integration
- **Auto-filling**: Profile completion from resume data
- **Data Extraction**: Skills, experience, education parsing

### 3. Interview Management System
- **Scheduling**: Future date validation
- **Multiple Types**: Video, phone, in-person support
- **Status Tracking**: Complete interview lifecycle
- **Feedback System**: Rating and recommendation capture

### 4. Real-time Dashboard Analytics
- **Candidate Stats**: Applications, interviews, profile completion
- **Recruiter Stats**: Job posts, applicants, interview analytics
- **Dynamic Calculations**: Auto-updating statistics

---

## 📈 Performance Optimizations

### Database Optimization
- **Indexing Strategy**: Text indexes for search, field indexes for filters
- **Pagination**: Limit-based pagination for large datasets
- **Population**: Selective field population to reduce data transfer
- **Query Optimization**: Efficient aggregation pipelines

### File Handling
- **Streaming**: File upload streaming for large files
- **Path Management**: Secure file path handling
- **Cleanup**: Orphaned file management (planned)

---

This comprehensive backend documentation covers all aspects of the JobOrbit backend system, including architecture, authentication, data models, API endpoints, file management, and security features. The system is designed for scalability, security, and maintainability with clear separation of concerns and robust error handling.