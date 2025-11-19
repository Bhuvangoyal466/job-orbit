# JobOrbit - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Authentication & Security](#authentication--security)
6. [Frontend Components](#frontend-components)
7. [Backend APIs](#backend-apis)
8. [AI Resume Parser](#ai-resume-parser)
9. [Routing System](#routing-system)
10. [State Management](#state-management)
11. [File Upload System](#file-upload-system)
12. [Features Deep Dive](#features-deep-dive)
13. [Development Environment](#development-environment)
14. [Deployment](#deployment)

---

## 🎯 Project Overview

**JobOrbit** is a comprehensive full-stack job board platform built with the MERN stack, featuring:
- **Dual User System**: Candidates and Recruiters with separate dashboards
- **AI-Powered Resume Parser**: Using Google Gemini AI through FastAPI
- **Real-time Application Tracking**: Live status updates for job applications
- **Advanced Job Matching**: Skill-based job recommendations
- **Interview Management**: Complete scheduling and management system

### Key Statistics
- **Frontend**: React 18.3.1 with 20+ components
- **Backend**: Node.js/Express with 4 main controllers
- **Database**: MongoDB with 4 main collections
- **AI Service**: Python FastAPI with Google Gemini integration
- **File Handling**: PDF resume upload with Multer

---

## 🛠️ Technology Stack

### Frontend Technologies
```javascript
{
  "react": "^18.3.1",                    // Core UI library
  "react-router-dom": "^7.7.0",         // Client-side routing
  "tailwind-css": "^4.1.11",            // Utility-first CSS
  "framer-motion": "^12.23.24",         // Animations
  "react-toastify": "^11.0.5",          // Toast notifications
  "lucide-react": "^0.525.0",           // Modern icons
  "aos": "^2.3.4",                      // Scroll animations
  "lottie-react": "^2.4.1"              // Lottie animations
}
```

### Backend Technologies
```javascript
{
  "express": "^4.18.2",                 // Web framework
  "mongoose": "^8.16.5",                // MongoDB ODM
  "jsonwebtoken": "^9.0.2",             // JWT authentication
  "bcryptjs": "^3.0.2",                 // Password hashing
  "multer": "^2.0.2",                   // File uploads
  "express-validator": "^7.0.1",        // Input validation
  "cors": "^2.8.5"                      // Cross-origin requests
}
```

### AI Service (Python)
```python
{
  "fastapi": "latest",                   # Modern API framework
  "google-generativeai": "latest",      # Google Gemini AI
  "PyPDF2": "latest",                   # PDF processing
  "uvicorn": "latest"                   # ASGI server
}
```

### Build Tools
- **Vite 7.0.4**: Lightning-fast build tool and dev server
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing with Tailwind
- **Nodemon**: Auto-restart development server

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Service    │
│   React/Vite    │◄──►│   Node.js/      │◄──►│   FastAPI/      │
│   Port: 5173    │    │   Express       │    │   Python        │
│                 │    │   Port: 5000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Database      │
                    │                 │
                    └─────────────────┘
```

### Project Structure
```
job-orbit/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context for state
│   │   ├── routes/           # Routing configuration
│   │   ├── utils/            # Utility functions
│   │   └── layouts/          # Layout components
│   └── public/               # Static assets
├── server/                   # Node.js backend
│   ├── controllers/          # Business logic
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Authentication & validation
│   ├── services/            # External services
│   └── config/              # Database configuration
├── jobOrbitResume/          # Python AI service
│   ├── main.py             # FastAPI application
│   └── resume_parser.py    # Resume processing logic
└── uploads/                # File storage
    └── resumes/           # PDF resume storage
```

---

## 🗄️ Database Schema

### MongoDB Collections

#### 1. Candidates Collection
```javascript
{
  _id: ObjectId,
  // Personal Information
  firstName: String (required, max: 50),
  lastName: String (required, max: 50),
  email: String (unique, required, validated),
  password: String (hashed, min: 6),
  phone: String (validated format),
  dateOfBirth: Date (required),
  
  // Professional Information
  education: [{
    degree: String,
    institution: String,
    graduationYear: Number,
    grade: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  skills: [String],
  
  // Location & Preferences
  location: {
    city: String,
    state: String,
    country: String
  },
  
  // Resume Information
  resume: {
    filename: String,
    originalName: String,
    uploadDate: Date,
    parsedData: Object
  },
  
  // System Fields
  isActive: { type: Boolean, default: true },
  profileCompleted: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max: 100),
  description: String (required, max: 3000),
  type: Enum ['full-time', 'part-time', 'contract', 'internship', 'remote'],
  
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  
  location: {
    city: String,
    state: String,
    country: String,
    remote: { type: Boolean, default: false }
  },
  
  skills: [String],
  requirements: [String],
  benefits: [String],
  
  company: {
    name: String,
    description: String,
    website: String,
    size: String,
    industry: String
  },
  
  recruiter: { type: ObjectId, ref: 'Recruiter', required: true },
  
  applicants: [{
    candidateId: { type: ObjectId, ref: 'Candidate' },
    status: Enum ['applied', 'under-review', 'interviewed', 'hired', 'rejected'],
    appliedAt: Date,
    statusHistory: [{
      status: String,
      date: Date,
      note: String
    }]
  }],
  
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Recruiters Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (unique, required),
  password: String (hashed),
  phone: String,
  
  company: {
    name: String (required),
    description: String,
    website: String,
    size: Enum ['1-10', '11-50', '51-200', '201-1000', '1000+'],
    industry: String,
    location: {
      city: String,
      state: String,
      country: String
    }
  },
  
  subscription: {
    plan: Enum ['free', 'basic', 'premium'],
    startDate: Date,
    endDate: Date,
    jobPostLimit: Number
  },
  
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Interviews Collection
```javascript
{
  _id: ObjectId,
  job: { type: ObjectId, ref: 'Job', required: true },
  candidate: { type: ObjectId, ref: 'Candidate', required: true },
  recruiter: { type: ObjectId, ref: 'Recruiter', required: true },
  
  scheduledDate: Date (required),
  duration: Number, // in minutes
  type: Enum ['video', 'phone', 'in-person'],
  
  meetingDetails: {
    platform: String, // Zoom, Teams, etc.
    meetingUrl: String,
    meetingId: String,
    passcode: String
  },
  
  location: {
    address: String,
    city: String,
    instructions: String
  },
  
  status: Enum ['scheduled', 'completed', 'cancelled', 'rescheduled'],
  notes: String,
  feedback: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow

#### 1. Registration Process
```javascript
// Client Side (React)
const registerCandidate = async (userData) => {
  const response = await fetch('/api/auth/candidate/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (response.ok) {
    const { token, user } = await response.json();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};
```

#### 2. Login Process
```javascript
// Server Side (Node.js)
const loginCandidate = async (req, res) => {
  const { email, password } = req.body;
  
  // Find user and include password for verification
  const candidate = await Candidate.findOne({ email }).select('+password');
  
  if (!candidate || !(await candidate.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT token
  const token = jwt.sign({ id: candidate._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
  
  res.json({ token, user: candidate });
};
```

#### 3. Protected Route Middleware
```javascript
// Middleware (auth.js)
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try candidate first, then recruiter
    let user = await Candidate.findById(decoded.id);
    let userType = 'candidate';
    
    if (!user) {
      user = await Recruiter.findById(decoded.id);
      userType = 'recruiter';
    }
    
    req.user = user;
    req.userType = userType;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' });
  }
};
```

### Password Security
- **Hashing**: bcryptjs with salt rounds of 12
- **Validation**: Minimum 6 characters, stored encrypted
- **Reset**: Secure password reset with email verification

---

## 🎨 Frontend Components

### Key Components Architecture

#### 1. App.jsx - Main Application
```javascript
// Entry point with providers and global setup
function App() {
  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
          <QuickActions />
          <ProfileCompletionWizard />
          <ToastContainer />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}
```

#### 2. AuthContext - State Management
```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (userData, token) => {
    authUtils.setAuth(userData, token);
    setUser(userData);
  };

  const logout = () => {
    authUtils.clearAuth();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isCandidate: () => user?.role === 'candidate',
    isRecruiter: () => user?.role === 'recruiter'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### 3. ProtectedRoute - Route Guard
```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### Layout Components

#### 1. Navbar - Dynamic Navigation
```javascript
// Features:
- Role-based navigation (Candidate/Recruiter/Public)
- Authentication state handling
- Mobile responsive with hamburger menu
- Profile dropdown with logout
- Search functionality integration
```

#### 2. Layout Systems
```javascript
// CandidateLayout.jsx
- Sidebar navigation for candidates
- Quick actions panel
- Application notifications
- Profile completion status

// RecruiterLayout.jsx  
- Recruiter dashboard sidebar
- Job posting shortcuts
- Applicant notifications
- Company profile management
```

### Major Page Components

#### 1. Dashboard Components
```javascript
// CandidateDashboard.jsx
- Application statistics cards
- Recent applications list
- Recommended jobs section
- Profile completion wizard
- Interview notifications

// RecruiterDashboard.jsx
- Hiring pipeline metrics
- Recent applicants overview
- Job posting analytics
- Interview schedule preview
```

#### 2. Job Management
```javascript
// JobBoard.jsx (Candidates)
- Advanced search and filtering
- Skill-based job matching
- Save/bookmark functionality
- Infinite scroll pagination

// ManageJobs.jsx (Recruiters)
- Job listing with status
- Edit/delete functionality
- Applicant count tracking
- Job performance metrics
```

---

## 🔌 Backend APIs

### API Endpoint Structure

#### 1. Authentication Routes
```javascript
// Candidate Authentication
POST   /api/auth/candidate/register    // Register new candidate
POST   /api/auth/candidate/login       // Login candidate
GET    /api/auth/candidate/me          // Get current user
PUT    /api/auth/candidate/profile     // Update profile
GET    /api/auth/candidate/dashboard   // Get dashboard stats

// Recruiter Authentication  
POST   /api/auth/recruiter/register    // Register new recruiter
POST   /api/auth/recruiter/login       // Login recruiter
GET    /api/auth/recruiter/me          // Get current user
PUT    /api/auth/recruiter/profile     // Update profile
GET    /api/auth/recruiter/dashboard   // Get dashboard stats
```

#### 2. Job Management Routes
```javascript
// Public Job Routes
GET    /api/jobs                      // Get all jobs with filters
GET    /api/jobs/:id                  // Get single job details

// Candidate Job Routes (Protected)
POST   /api/jobs/:id/apply            // Apply for job
GET    /api/jobs/applications         // Get my applications
PUT    /api/jobs/applications/:id     // Update application

// Recruiter Job Routes (Protected)
POST   /api/jobs                      // Create new job
PUT    /api/jobs/:id                  // Update job
DELETE /api/jobs/:id                  // Delete job
GET    /api/jobs/recruiter/my-jobs    // Get recruiter's jobs
GET    /api/jobs/:id/applicants       // Get job applicants
PUT    /api/jobs/applications/:id/status // Update application status
```

#### 3. Resume Processing Routes
```javascript
// Resume Upload & Parsing
POST   /api/candidate/resume/upload   // Upload PDF resume
POST   /api/candidate/resume/parse    // Parse existing resume
GET    /api/candidate/resume          // Get resume info
DELETE /api/candidate/resume          // Delete resume
```

#### 4. Interview Management Routes
```javascript
// Interview Scheduling
POST   /api/interviews                // Create interview
GET    /api/interviews                // Get interviews (role-based)
PUT    /api/interviews/:id            // Update interview
DELETE /api/interviews/:id            // Cancel interview
PUT    /api/interviews/:id/reschedule // Reschedule interview
```

### Controller Logic Examples

#### 1. Job Search with Skill Matching
```javascript
exports.getAllJobs = async (req, res) => {
  const { search, location, type, sortBySkillMatch } = req.query;
  
  // Build query object
  const query = { isActive: true };
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'company.name': { $regex: search, $options: 'i' } },
      { skills: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  // Get candidate skills for matching
  let candidateSkills = [];
  if (req.user?.role === 'candidate') {
    const candidate = await Candidate.findById(req.user.id);
    candidateSkills = candidate.skills || [];
  }
  
  let jobs = await Job.find(query)
    .populate('recruiter', 'company')
    .sort({ createdAt: -1 });
  
  // Apply skill matching algorithm
  if (sortBySkillMatch && candidateSkills.length > 0) {
    jobs = jobs.map(job => ({
      ...job.toObject(),
      skillMatchPercentage: calculateSkillMatch(candidateSkills, job.skills)
    })).sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);
  }
  
  res.json({ jobs, total: jobs.length });
};
```

#### 2. Application Status Management
```javascript
exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status, note } = req.body;
  
  const job = await Job.findOne({
    'applicants._id': applicationId,
    recruiter: req.user.id
  });
  
  if (!job) {
    return res.status(404).json({ message: 'Application not found' });
  }
  
  const applicant = job.applicants.id(applicationId);
  
  // Update status and add to history
  applicant.status = status;
  applicant.statusHistory.push({
    status,
    date: new Date(),
    note
  });
  
  await job.save();
  
  // Send notification to candidate (if implemented)
  
  res.json({ message: 'Application status updated' });
};
```

---

## 🤖 AI Resume Parser

### Python FastAPI Service Architecture

#### 1. Main Service (main.py)
```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
from resume_parser import process_resume

app = FastAPI(title="Resume Parser API", version="1.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/parse-resume/")
async def parse_resume(file: UploadFile = File(...)):
    # Validate PDF file
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files supported")
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Process resume with AI
        result = process_resume(tmp_path)
        return result
    finally:
        # Cleanup
        os.unlink(tmp_path)
```

#### 2. Resume Processing Logic
```python
# resume_parser.py
import google.generativeai as genai
import PyPDF2
import json

def process_resume(pdf_path):
    # Extract text from PDF
    text = extract_text_from_pdf(pdf_path)
    
    # Configure Google Gemini AI
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Analyze this resume and extract information in JSON format:
    
    Required fields:
    - personal_info: {{name, email, phone, location}}
    - education: [{{degree, institution, graduation_year, grade}}]
    - experience: [{{company, position, start_date, end_date, description}}]
    - skills: [technical skills array]
    - summary: professional summary text
    
    Resume text: {text}
    
    Return only valid JSON.
    """
    
    response = model.generate_content(prompt)
    
    # Parse and validate response
    try:
        parsed_data = json.loads(response.text)
        return transform_to_schema(parsed_data)
    except:
        return {"error": "Failed to parse resume"}
```

### Integration with Node.js Backend

#### 1. Resume Service (resumeParser.js)
```javascript
async function parseResumeWithAPI(filePath) {
  const formData = new FormData();
  const fileStream = fs.createReadStream(filePath);
  
  formData.append('file', fileStream, {
    filename: path.basename(filePath),
    contentType: 'application/pdf'
  });
  
  const response = await fetch(`${RESUME_PARSER_URL}/parse-resume/`, {
    method: 'POST',
    body: formData,
    headers: formData.getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Resume parsing failed: ${response.status}`);
  }
  
  const parsedData = await response.json();
  return transformParsedData(parsedData);
}

function transformParsedData(parsedData) {
  // Transform AI response to match Candidate schema
  return {
    firstName: parsedData.personal_info?.name?.split(' ')[0] || '',
    lastName: parsedData.personal_info?.name?.split(' ').slice(1).join(' ') || '',
    email: parsedData.personal_info?.email || '',
    phone: parsedData.personal_info?.phone || '',
    education: parsedData.education?.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      graduationYear: edu.graduation_year,
      grade: edu.grade
    })) || [],
    experience: parsedData.experience?.map(exp => ({
      company: exp.company,
      position: exp.position,
      startDate: parseDate(exp.start_date),
      endDate: parseDate(exp.end_date),
      description: exp.description
    })) || [],
    skills: parsedData.skills || []
  };
}
```

---

## 🛣️ Routing System

### Frontend Routing (React Router)

#### 1. Main Route Configuration
```javascript
// AppRoutes.jsx
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/jobs" element={<><Navbar /><JobBoard /><Footer /></>} />
        <Route path="/jobs/:id" element={<><Navbar /><JobDetails /><Footer /></>} />
        
        {/* Candidate Routes */}
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/signup" element={<CandidateSignup />} />
        <Route path="/candidate/dashboard" element={
          <ProtectedRoute requiredRole="candidate">
            <CandidateLayout><CandidateDashboard /></CandidateLayout>
          </ProtectedRoute>
        } />
        
        {/* Recruiter Routes */}
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/recruiter/signup" element={<RecruiterSignup />} />
        <Route path="/recruiter/dashboard" element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterLayout><RecruiterDashboard /></RecruiterLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};
```

#### 2. Protected Route Logic
```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

#### 3. Dynamic Navigation
```javascript
// Navbar.jsx - Role-based navigation
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'About', path: '/about' }
      ];
    }
    
    if (user.role === 'candidate') {
      return [
        { name: 'Dashboard', path: '/candidate/dashboard' },
        { name: 'Job Board', path: '/candidate/jobs' },
        { name: 'Applications', path: '/candidate/applications' },
        { name: 'Interviews', path: '/candidate/interviews' }
      ];
    }
    
    if (user.role === 'recruiter') {
      return [
        { name: 'Dashboard', path: '/recruiter/dashboard' },
        { name: 'Post Job', path: '/recruiter/post-job' },
        { name: 'Manage Jobs', path: '/recruiter/manage-jobs' },
        { name: 'Applicants', path: '/recruiter/applicants' }
      ];
    }
  };
  
  return (
    <nav>
      {getNavigationItems().map(item => (
        <Link key={item.path} to={item.path}>{item.name}</Link>
      ))}
    </nav>
  );
};
```

### Backend Routing

#### 1. Express Route Structure
```javascript
// server.js - Route mounting
app.use('/api/auth/candidate', candidateAuthRoutes);
app.use('/api/auth/recruiter', recruiterAuthRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidate', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
```

#### 2. Individual Route Files
```javascript
// routes/jobs.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRole } = require('../middleware/auth');
const jobController = require('../controllers/jobs');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Candidate routes
router.use(protect); // Apply authentication to all routes below
router.post('/:id/apply', authorizeRole('candidate'), jobController.applyForJob);
router.get('/applications', authorizeRole('candidate'), jobController.getMyApplications);

// Recruiter routes  
router.post('/', authorizeRole('recruiter'), jobController.createJob);
router.put('/:id', authorizeRole('recruiter'), jobController.updateJob);
router.delete('/:id', authorizeRole('recruiter'), jobController.deleteJob);

module.exports = router;
```

---

## 💾 State Management

### Context API Implementation

#### 1. AuthContext - Global Authentication
```javascript
// context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing auth
    const token = authUtils.getToken();
    const userData = authUtils.getUser();
    
    if (token && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (userData, token) => {
    authUtils.setAuth(userData, token);
    setUser(userData);
  };

  const logout = () => {
    authUtils.clearAuth();
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    authUtils.setAuth(newUserData, authUtils.getToken());
    setUser(newUserData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isCandidate: () => user?.role === 'candidate',
    isRecruiter: () => user?.role === 'recruiter'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### 2. Local State Management
```javascript
// Component-level state examples

// JobBoard.jsx - Job filtering and search
const [filters, setFilters] = useState({
  search: '',
  location: '',
  type: 'all',
  salary: '',
  skills: []
});

const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

// ApplicationTracker.jsx - Application management  
const [applications, setApplications] = useState([]);
const [statusFilter, setStatusFilter] = useState('all');
const [sortBy, setSortBy] = useState('recent');
```

#### 3. API State Management
```javascript
// utils/api.js - API utility functions
export const authUtils = {
  // Token management
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  
  // User data management
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  
  // Combined auth management
  setAuth: (user, token) => {
    authUtils.setToken(token);
    authUtils.setUser(user);
  },
  
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// API request wrapper with authentication
const makeRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Add auth header if token exists
  const token = authUtils.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (response.status === 401) {
    // Token expired, redirect to login
    authUtils.clearAuth();
    window.location.href = '/login';
  }
  
  return response.json();
};
```

---

## 📁 File Upload System

### Multer Configuration

#### 1. Backend File Upload Setup
```javascript
// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/resumes');
    cb(null, uploadPath);
  },
  
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${extension}`);
  }
});

// File filter - only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

module.exports = upload;
```

#### 2. Resume Upload Route
```javascript
// routes/resume.js
const upload = require('../middleware/upload');

router.post('/resume/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const candidate = await Candidate.findById(req.user.id);
    
    // Delete old resume file if exists
    if (candidate.resume?.filename) {
      const oldFilePath = path.join(__dirname, '../uploads/resumes', candidate.resume.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update candidate with new resume info
    candidate.resume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadDate: new Date(),
      parsedData: null
    };

    await candidate.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      filename: req.file.filename
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});
```

#### 3. Frontend File Upload
```javascript
// components/UploadResume.jsx
const UploadResume = () => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/candidate/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authUtils.getToken()}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Resume uploaded successfully!');
        // Trigger parsing
        await parseResume();
      } else {
        throw new Error('Upload failed');
      }

    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div 
      className={`upload-zone ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept=".pdf"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      
      <div className="upload-content">
        <FileIcon size={48} />
        <p>Drop your PDF resume here or click to browse</p>
        <button onClick={() => fileInputRef.current.click()}>
          Choose File
        </button>
      </div>
      
      {uploading && <LoadingSpinner />}
    </div>
  );
};
```

---

## ✨ Features Deep Dive

### 1. Advanced Job Search & Filtering

#### Search Algorithm Implementation
```javascript
// Job search with multiple criteria
const buildSearchQuery = (filters) => {
  const query = { isActive: true };
  
  // Text search across multiple fields
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { 'company.name': { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { skills: { $in: [new RegExp(filters.search, 'i')] } }
    ];
  }
  
  // Location filter
  if (filters.location) {
    query.$or = query.$or || [];
    query.$or.push(
      { 'location.city': { $regex: filters.location, $options: 'i' } },
      { 'location.state': { $regex: filters.location, $options: 'i' } },
      { 'location.remote': filters.location.includes('remote') }
    );
  }
  
  // Job type filter
  if (filters.type && filters.type !== 'all') {
    query.type = filters.type;
  }
  
  // Salary range filter
  if (filters.salaryMin || filters.salaryMax) {
    query['salary.min'] = { $gte: filters.salaryMin || 0 };
    query['salary.max'] = { $lte: filters.salaryMax || 1000000 };
  }
  
  return query;
};
```

#### Skill Matching Algorithm
```javascript
// utils/skillMatching.js
const calculateAdvancedSkillMatchPercentage = (candidateSkills, jobSkills) => {
  if (!candidateSkills.length || !jobSkills.length) return 0;
  
  // Normalize skills (lowercase, trim)
  const normalizedCandidateSkills = candidateSkills.map(skill => 
    skill.toLowerCase().trim()
  );
  const normalizedJobSkills = jobSkills.map(skill => 
    skill.toLowerCase().trim()
  );
  
  let matchCount = 0;
  let partialMatchCount = 0;
  
  normalizedJobSkills.forEach(jobSkill => {
    // Exact match
    if (normalizedCandidateSkills.includes(jobSkill)) {
      matchCount++;
    } 
    // Partial match (contains)
    else if (normalizedCandidateSkills.some(candidateSkill => 
      candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)
    )) {
      partialMatchCount += 0.5;
    }
  });
  
  const totalMatches = matchCount + partialMatchCount;
  return Math.min(100, Math.round((totalMatches / normalizedJobSkills.length) * 100));
};
```

### 2. Real-time Application Tracking

#### Application Status System
```javascript
// Application status flow
const APPLICATION_STATUSES = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under-review', 
  INTERVIEWED: 'interviewed',
  HIRED: 'hired',
  REJECTED: 'rejected'
};

// Status update with history tracking
const updateApplicationStatus = async (applicationId, newStatus, note) => {
  const job = await Job.findOne({ 'applicants._id': applicationId });
  const applicant = job.applicants.id(applicationId);
  
  // Add to status history
  applicant.statusHistory.push({
    status: applicant.status,
    date: new Date(),
    note: 'Previous status'
  });
  
  // Update current status
  applicant.status = newStatus;
  applicant.statusHistory.push({
    status: newStatus,
    date: new Date(),
    note: note || `Status updated to ${newStatus}`
  });
  
  await job.save();
  
  // Real-time notification (if Socket.io was implemented)
  // io.to(applicant.candidateId).emit('statusUpdate', { applicationId, newStatus });
};
```

#### Dashboard Analytics
```javascript
// Candidate dashboard statistics
const getCandidateDashboardStats = async (candidateId) => {
  const applications = await Job.aggregate([
    { $unwind: '$applicants' },
    { $match: { 'applicants.candidateId': candidateId } },
    {
      $group: {
        _id: '$applicants.status',
        count: { $sum: 1 },
        applications: { $push: {
          jobId: '$_id',
          jobTitle: '$title',
          company: '$company.name',
          appliedAt: '$applicants.appliedAt',
          status: '$applicants.status'
        }}
      }
    }
  ]);
  
  const stats = {
    total: 0,
    applied: 0,
    underReview: 0,
    interviewed: 0,
    hired: 0,
    rejected: 0
  };
  
  applications.forEach(app => {
    stats.total += app.count;
    stats[app._id.replace('-', '')] = app.count;
  });
  
  return stats;
};
```

### 3. Interview Management System

#### Interview Scheduling
```javascript
// Create interview with validation
const scheduleInterview = async (req, res) => {
  const { jobId, candidateId, scheduledDate, duration, type, meetingDetails } = req.body;
  
  // Validate job and candidate
  const job = await Job.findById(jobId);
  const candidate = await Candidate.findById(candidateId);
  
  if (!job || !candidate) {
    return res.status(404).json({ message: 'Job or candidate not found' });
  }
  
  // Check if candidate applied for this job
  const application = job.applicants.find(app => 
    app.candidateId.toString() === candidateId
  );
  
  if (!application) {
    return res.status(400).json({ message: 'Candidate has not applied for this job' });
  }
  
  // Create interview
  const interview = new Interview({
    job: jobId,
    candidate: candidateId,
    recruiter: req.user.id,
    scheduledDate: new Date(scheduledDate),
    duration: duration || 60,
    type: type || 'video',
    meetingDetails: type === 'video' ? meetingDetails : undefined,
    location: type === 'in-person' ? meetingDetails : undefined,
    status: 'scheduled'
  });
  
  await interview.save();
  
  // Update application status
  application.status = 'interviewed';
  await job.save();
  
  res.status(201).json({
    success: true,
    interview,
    message: 'Interview scheduled successfully'
  });
};
```

### 4. Profile Completion Wizard

#### Smart Profile Completion
```javascript
// components/ProfileCompletionWizard.jsx
const ProfileCompletionWizard = () => {
  const { user, updateUser } = useAuth();
  const [completionStatus, setCompletionStatus] = useState({});

  useEffect(() => {
    if (user) {
      const status = calculateProfileCompletion(user);
      setCompletionStatus(status);
    }
  }, [user]);

  const calculateProfileCompletion = (userData) => {
    const checks = {
      basicInfo: !!(userData.firstName && userData.lastName && userData.email && userData.phone),
      education: !!(userData.education && userData.education.length > 0),
      experience: !!(userData.experience && userData.experience.length > 0),
      skills: !!(userData.skills && userData.skills.length >= 3),
      resume: !!(userData.resume && userData.resume.filename)
    };

    const completedCount = Object.values(checks).filter(Boolean).length;
    const totalCount = Object.keys(checks).length;
    
    return {
      checks,
      percentage: Math.round((completedCount / totalCount) * 100),
      completed: completedCount,
      total: totalCount
    };
  };

  const getNextStep = () => {
    const { checks } = completionStatus;
    
    if (!checks.basicInfo) return { step: 'basicInfo', text: 'Complete basic information' };
    if (!checks.resume) return { step: 'resume', text: 'Upload your resume' };
    if (!checks.skills) return { step: 'skills', text: 'Add your skills' };
    if (!checks.education) return { step: 'education', text: 'Add your education' };
    if (!checks.experience) return { step: 'experience', text: 'Add work experience' };
    
    return null;
  };

  if (completionStatus.percentage === 100) return null;

  return (
    <div className="profile-completion-wizard">
      <div className="progress-header">
        <h3>Complete Your Profile</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${completionStatus.percentage}%` }}
          />
        </div>
        <span>{completionStatus.percentage}% Complete</span>
      </div>
      
      <div className="next-steps">
        {getNextStep() && (
          <button 
            onClick={() => navigateToStep(getNextStep().step)}
            className="next-step-btn"
          >
            {getNextStep().text}
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## 🔧 Development Environment

### Environment Configuration

#### 1. Backend Environment Variables
```bash
# .env file for server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/joborbit
# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/joborbit

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration  
CLIENT_URL=http://localhost:5173

# Resume Parser Service
RESUME_PARSER_URL=http://127.0.0.1:8000

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google AI API (for resume parsing)
GOOGLE_API_KEY=your_google_gemini_api_key
```

#### 2. Python Environment Setup
```python
# requirements.txt for jobOrbitResume
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
google-generativeai==0.3.2
PyPDF2==3.0.1
python-dotenv==1.0.0

# .env for Python service
GOOGLE_API_KEY=your_google_gemini_api_key
```

### Development Scripts

#### 1. Package.json Scripts
```json
// server/package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}

// client/package.json  
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

#### 2. Development Workflow
```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start backend server
cd server
npm run dev

# Terminal 3: Start Python AI service
cd jobOrbitResume
python -m uvicorn main:app --reload --port 8000

# Terminal 4: Start frontend development server
cd client  
npm run dev
```

### Build Configuration

#### 1. Vite Configuration
```javascript
// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
```

#### 2. Tailwind Configuration
```javascript
// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

---

## 🚀 Deployment

### Production Environment Setup

#### 1. Environment Variables (Production)
```bash
# Production .env
NODE_ENV=production
PORT=5000

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/joborbit?retryWrites=true&w=majority

# JWT - Strong secret for production
JWT_SECRET=super_complex_production_secret_key_here
JWT_EXPIRE=30d

# CORS - Specific domain
CLIENT_URL=https://your-domain.com

# Resume Parser - Production URL
RESUME_PARSER_URL=https://your-ai-service.com

# Email Service
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key

# Google AI
GOOGLE_API_KEY=your_production_google_api_key
```

#### 2. Build Process
```bash
# Build frontend for production
cd client
npm run build

# The build creates optimized static files in client/dist/
# These files need to be served by a web server (Nginx, Apache)

# Backend remains the same but with production environment variables
cd server
npm start
```

#### 3. Production Considerations

**Security Enhancements:**
- Use HTTPS for all communications
- Implement rate limiting
- Add input sanitization
- Use helmet.js for security headers
- Implement CSRF protection

**Performance Optimizations:**
- Database indexing for faster queries
- Image optimization and CDN
- API response caching
- Database connection pooling
- Gzip compression

**Monitoring & Logging:**
- Implement proper logging (Winston)
- Error tracking (Sentry)
- Performance monitoring
- Health check endpoints

---

## 📊 Key Questions & Answers for Viva

### 1. **Architecture Questions**

**Q: Explain the overall architecture of your application.**
**A:** The application follows a **3-tier architecture**:
- **Presentation Layer**: React frontend with Vite, handles UI and user interactions
- **Application Layer**: Node.js/Express backend, handles business logic and API endpoints
- **Data Layer**: MongoDB for data persistence, plus a separate Python FastAPI service for AI resume parsing

**Q: Why did you choose MERN stack?**
**A:** 
- **MongoDB**: Flexible document structure perfect for varying job/candidate data
- **Express**: Lightweight, fast web framework with excellent middleware support
- **React**: Component-based architecture for reusable UI, excellent ecosystem
- **Node.js**: JavaScript throughout the stack, fast I/O for real-time features

### 2. **Authentication & Security**

**Q: How is authentication implemented?**
**A:** Using **JWT (JSON Web Tokens)**:
- User credentials verified against bcrypt-hashed passwords
- JWT signed with secret key, includes user ID and role
- Token stored in localStorage on frontend
- Every protected API request includes Bearer token in Authorization header
- Middleware verifies token and attaches user to request object

**Q: How do you handle different user roles?**
**A:** **Role-based access control**:
- Database stores user role ('candidate' or 'recruiter')
- JWT token includes role information
- Frontend routes protected by `ProtectedRoute` component checking user role
- Backend middleware `authorizeRole()` restricts API endpoints by role

### 3. **Database Design**

**Q: Explain your database schema.**
**A:** **4 main collections**:
- **Candidates**: Personal info, education, experience, skills, resume data
- **Jobs**: Job details, requirements, applicants array with application status
- **Recruiters**: Company info, subscription details
- **Interviews**: Scheduling data, meeting details, status tracking

**Q: How do you handle job applications?**
**A:** **Embedded documents approach**:
- Job document contains `applicants` array
- Each applicant has `candidateId`, `status`, `appliedAt`, and `statusHistory`
- Status history tracks all status changes with timestamps and notes
- Allows for efficient queries and atomic updates

### 4. **File Upload & AI Integration**

**Q: How does the resume upload work?**
**A:** **Multi-step process**:
1. **Frontend**: File validation (PDF only, size limits), drag-and-drop interface
2. **Backend**: Multer middleware handles file storage, generates unique filenames
3. **AI Processing**: File sent to Python FastAPI service via HTTP request
4. **AI Parsing**: Google Gemini AI extracts structured data from PDF text
5. **Data Integration**: Parsed data transformed to match Candidate schema, stored in MongoDB

**Q: Why separate Python service for AI?**
**A:** **Separation of concerns**:
- Python has better AI/ML libraries (Google AI SDK, PyPDF2)
- Microservice architecture allows independent scaling
- Node.js handles web requests, Python handles AI processing
- Easy to replace/upgrade AI service without affecting main application

### 5. **Frontend Architecture**

**Q: How is state managed in React?**
**A:** **Context API + Local State**:
- `AuthContext` manages global authentication state
- Component-level `useState` for local data (job filters, forms)
- `localStorage` for persistence of auth tokens
- Custom hooks like `useAuth` abstract context usage

**Q: How does routing work?**
**A:** **React Router with protection**:
- `AppRoutes` component defines all routes
- `ProtectedRoute` wrapper checks authentication and role
- Dynamic navigation based on user role
- Automatic redirects for unauthorized access

### 6. **API Design**

**Q: Explain your API structure.**
**A:** **RESTful design with role-based endpoints**:
- `/api/auth/candidate/*` - Candidate authentication
- `/api/auth/recruiter/*` - Recruiter authentication  
- `/api/jobs/*` - Public job listings, applications
- `/api/candidate/*` - Candidate-specific features (resume)
- `/api/interviews/*` - Interview management

**Q: How do you handle errors?**
**A:** **Centralized error handling**:
- Global error middleware catches all errors
- Specific error types (ValidationError, CastError, etc.) handled differently
- Consistent error response format with status codes
- Frontend displays user-friendly error messages via toast notifications

### 7. **Features Implementation**

**Q: How does job search work?**
**A:** **Advanced search algorithm**:
- MongoDB aggregation pipeline for complex queries
- Full-text search across title, company, description, skills
- Location search with remote job support
- Salary range filtering
- Skill-based job matching with percentage calculation

**Q: Explain the skill matching algorithm.**
**A:** **Multi-level matching**:
- Exact skill matches get full points
- Partial matches (substring matching) get half points
- Skills normalized (lowercase, trimmed) for better matching
- Percentage calculated: (matches / total job skills) * 100

### 8. **Performance & Optimization**

**Q: How do you optimize database queries?**
**A:** **Multiple strategies**:
- Database indexes on frequently queried fields (email, job titles)
- Pagination for large result sets
- Selective field projection to reduce data transfer
- Populate only necessary fields in joins

**Q: How is the frontend optimized?**
**A:** **Build optimization**:
- Vite for fast development and optimized production builds
- Code splitting with React lazy loading
- Image optimization and lazy loading
- Tailwind CSS for minimal bundle size

### 9. **Development Process**

**Q: What tools did you use for development?**
**A:** 
- **Build Tools**: Vite (frontend), Nodemon (backend auto-restart)
- **Code Quality**: ESLint for JavaScript standards
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth transitions

**Q: How would you deploy this application?**
**A:** **Three-service deployment**:
- **Frontend**: Static hosting (Netlify, Vercel) serving built React app
- **Backend**: Node.js hosting (Heroku, Railway, AWS) with environment variables
- **AI Service**: Python hosting (Railway, AWS Lambda) for resume parsing
- **Database**: MongoDB Atlas for managed database hosting

### 10. **Future Enhancements**

**Q: What features would you add next?**
**A:** 
- **Real-time notifications** using WebSocket/Socket.io
- **Video calling** integration for remote interviews
- **Advanced analytics** for recruiters (hiring funnel, time-to-hire)
- **Email notifications** for application status updates
- **Mobile app** using React Native
- **AI recommendations** for job matching improvements

This comprehensive documentation covers every aspect of your JobOrbit project. Use it to confidently answer any questions during your viva! 🚀