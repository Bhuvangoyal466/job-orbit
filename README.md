# JobOrbit - Smart Job Board with Resume Parser & Tracker

A comprehensive full-stack job board platform built with MERN stack and powered by AI. Features intelligent resume parsing with Google Gemini AI, real-time application tracking, and advanced recruitment management tools.

## 🚀 Features

### For Job Seekers (Candidates)
- ✅ **User Authentication**: Secure JWT-based authentication
- ✅ **Profile Management**: Complete candidate profile system with education, experience, and skills
- ✅ **Job Board**: Advanced job search with filters (location, type, salary, skills)
- ✅ **Job Applications**: Apply to jobs instantly
- ✅ **Resume Upload**: PDF resume upload with file management system
- ✅ **Application Tracker**: Real-time tracking of job applications with status updates
- ✅ **Interview Management**: View and manage scheduled interviews
- ✅ **Saved Jobs**: Bookmark and manage favorite job listings
- ✅ **Dashboard Analytics**: Visual insights into application progress
- ✅ **AI Resume Parser**: Intelligent resume parsing using Google Gemini AI (PDF support)
- ✅ **Auto-Profile Filling**: Automatically extract and populate candidate information from resumes
- ✅ **Re-parse Functionality**: Re-analyze existing resumes for improved data extraction

### For Recruiters
- ✅ **Recruiter Portal**: Dedicated dashboard for hiring managers
- ✅ **Job Posting**: Easy job posting with comprehensive job details
- ✅ **Job Management**: Update, delete, and manage posted jobs
- ✅ **Applicant Management**: Advanced candidate filtering and management
- ✅ **Application Status**: Update application statuses (applied, under-review, interviewed, hired, rejected)
- ✅ **Interview Scheduling**: Complete interview management system with multiple types (video, phone, in-person)
- ✅ **Resume Viewing**: Integrated PDF resume viewer for candidate evaluation
- ✅ **Real-time Analytics**: Live dashboard with hiring pipeline metrics
- ✅ **Company Profile**: Complete company information and verification system
- ✅ **Subscription Management**: Tiered plans with job posting limits

## 🛠️ Technology Stack

### Frontend
- **React** (v19.1.0) - Modern UI library with latest features
- **React Router DOM** (v7.7.0) - Advanced client-side routing
- **Tailwind CSS** (v4.1.11) - Utility-first CSS framework
- **React Toastify** (v11.0.5) - Toast notifications system
- **Lucide React** (v0.525.0) - Modern icon library
- **Vite** (v7.0.4) - Lightning-fast build tool and dev server

### Backend
- ✅ **Node.js** - Server runtime
- ✅ **Express.js** (v4.18.2) - Web framework
- ✅ **MongoDB** - NoSQL database with Mongoose ODM (v8.16.5)
- ✅ **JWT** (v9.0.2) - Authentication tokens
- ✅ **bcryptjs** (v3.0.2) - Password hashing
- ✅ **express-validator** (v7.0.1) - Input validation
- ✅ **Multer** (v2.0.2) - File upload handling for resumes
- ✅ **CORS** (v2.8.5) - Cross-origin resource sharing
- ✅ **dotenv** (v16.3.1) - Environment variable management
- ✅ **form-data** - HTTP form data for microservice communication

### AI Resume Parser Service
- ✅ **FastAPI** - High-performance Python web framework for microservices
- ✅ **Google Generative AI (Gemini 2.5 Flash)** - Advanced AI for intelligent resume parsing
- ✅ **pdfplumber** - Robust PDF text extraction library
- ✅ **python-multipart** - Form data handling for file uploads
- ✅ **python-dotenv** - Environment configuration management
- ✅ **uvicorn** - Lightning-fast ASGI server for FastAPI

### Database & Storage
- ✅ **MongoDB** - NoSQL document database with Mongoose ODM
- ✅ **File Storage** - Local file system with organized directory structure
- ✅ **Data Validation** - Comprehensive schema validation and sanitization
- 🔄 **Cloudinary** - Cloud file storage - *Coming Soon*
- 🔄 **PDF-Parse/Mammoth.js** - Resume parsing - *Coming Soon*

## 📁 Project Structure

```
job-orbit/
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Footer.jsx          # Site footer
│   │   │   ├── InterviewScheduler.jsx  # Interview scheduling modal
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   │   └── ResumeViewer.jsx    # PDF resume viewer modal
│   │   ├── context/               # React Context providers
│   │   │   ├── AuthContext.jsx    # Authentication state management
│   │   │   └── useAuth.js         # Auth hook
│   │   ├── layouts/               # Page layout components
│   │   │   ├── CandidateLayout.jsx # Candidate portal layout
│   │   │   └── RecruiterLayout.jsx # Recruiter portal layout
│   │   ├── pages/                 # Page components
│   │   │   ├── candidate/         # Candidate portal pages
│   │   │   │   ├── CandidateDashboard.jsx
│   │   │   │   ├── JobBoard.jsx
│   │   │   │   ├── UploadResume.jsx    # AI resume parsing page
│   │   │   │   ├── ApplicationTracker.jsx
│   │   │   │   └── InterviewManagement.jsx
│   │   │   ├── recruiter/         # Recruiter portal pages
│   │   │   │   ├── RecruiterDashboard.jsx
│   │   │   │   ├── PostJob.jsx
│   │   │   │   ├── ManageApplicants.jsx
│   │   │   │   └── RecruiterInterviewManagement.jsx
│   │   │   └── common/            # Shared pages
│   │   │       ├── Home.jsx       # Landing page
│   │   │       ├── About.jsx      # About page
│   │   │       └── NotFound.jsx   # 404 error page
│   │   ├── routes/               # Routing configuration
│   │   │   └── AppRoutes.jsx     # Main route definitions
│   │   ├── utils/                # Utility functions & API calls
│   │   │   └── api.js            # Centralized API client
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # App entry point
│   ├── public/                   # Static assets
│   ├── package.json             # Frontend dependencies
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── vite.config.js           # Vite build configuration
├── server/                       # Express.js Backend API
│   ├── config/                  # Configuration files
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/            # Business logic handlers
│   │   ├── authCandidate.js   # Candidate authentication
│   │   ├── authRecruiter.js   # Recruiter authentication
│   │   └── jobs.js            # Job management
│   ├── middleware/             # Custom Express middleware
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/                 # MongoDB/Mongoose schemas
│   │   ├── Candidate.js       # Candidate data model
│   │   ├── Interview.js       # Interview data model
│   │   ├── Job.js            # Job posting data model
│   │   └── Recruiter.js      # Recruiter data model
│   ├── routes/                # API route definitions
│   │   ├── authCandidate.js  # Candidate auth routes
│   │   ├── authRecruiter.js  # Recruiter auth routes
│   │   ├── interviews.js     # Interview management routes
│   │   ├── jobs.js          # Job management routes
│   │   └── resume.js        # Resume upload & parsing routes
│   ├── services/             # External service integrations
│   │   └── resumeParser.js  # AI resume parsing service
│   ├── utils/               # Utility scripts
│   │   ├── fix-profile-completeness.js
│   │   └── migrate-under-review.js
│   ├── uploads/             # File storage
│   │   └── resumes/        # Resume PDF files
│   ├── package.json        # Backend dependencies
│   └── server.js          # Express server entry point
├── jobOrbitResume/          # AI Resume Parser Microservice
│   ├── main.py             # FastAPI application
│   ├── resume_parser.py    # Core AI parsing logic
│   ├── .env               # Environment variables (Gemini API key)
│   └── venv/              # Python virtual environment
├── BACKEND_DOCUMENTATION.md      # Detailed API documentation
├── RESUME_PARSER_INTEGRATION.md  # AI integration guide
├── start-all-services.bat        # Automated startup script
└── README.md                     # Main project documentation
```

## 🚦 Current Status

### ✅ Phase 1 & 2 - Core Platform (COMPLETED)

#### Frontend Application
- ✅ **Modern React Setup**: Vite + React 19 + Tailwind CSS 4.1
- ✅ **Authentication System**: Complete login/register flows for candidates and recruiters
- ✅ **Protected Routing**: Role-based access control with React Router
- ✅ **Responsive Design**: Mobile-first approach with seamless UX
- ✅ **Candidate Portal**: Job search, application tracking, profile management
- ✅ **Recruiter Portal**: Job posting, applicant management, interview scheduling
- ✅ **Dashboard Analytics**: Real-time insights and statistics
- ✅ **File Management**: Drag-and-drop resume upload with PDF viewer

#### Backend API & Services
- ✅ **RESTful API**: Complete Express.js backend with comprehensive endpoints
- ✅ **Authentication**: JWT-based security with bcrypt password hashing
- ✅ **Database**: MongoDB with Mongoose ODM and optimized schemas
- ✅ **Job Management**: Full CRUD operations for job postings and applications
- ✅ **User Profiles**: Dynamic profile completeness calculation (auto-updating)
- ✅ **Interview System**: Scheduling, management, and feedback workflows
- ✅ **File Storage**: Multer integration for resume uploads and retrieval
- ✅ **Data Validation**: Express-validator for all API inputs
- ✅ **Error Handling**: Comprehensive error responses and logging

### ✅ Phase 3 - AI Integration (RECENTLY COMPLETED)

#### AI-Powered Resume Parser
- ✅ **FastAPI Microservice**: Python service for AI-powered resume parsing
- ✅ **Google Gemini Integration**: Advanced AI for intelligent text extraction
- ✅ **Auto-Profile Population**: Automatic candidate profile filling from resumes
- ✅ **Smart Data Mapping**: Intelligent field mapping with merge logic
- ✅ **Re-parsing Capability**: Update profiles with improved AI extraction
- ✅ **Error Handling**: Graceful fallbacks when AI service is unavailable
- ✅ **PDF Processing**: Extract text from PDF resumes using pdfplumber
- ✅ **Service Integration**: Seamless backend communication between services

### 🚀 Phase 4 - Advanced Features (NEXT)

#### Enhanced User Experience
- [ ] **Real-time Notifications**: Socket.io integration for live updates
- [ ] **Email System**: Automated notifications and communication
- [ ] **Advanced Search**: Elasticsearch integration with intelligent matching
- [ ] **Video Interviews**: Built-in video calling system
- [ ] **Mobile App**: React Native mobile application

#### Enterprise Features
- [ ] **Company Verification**: KYC system for recruiter verification
- [ ] **Payment Gateway**: Stripe/PayPal integration for premium features
- [ ] **Admin Dashboard**: Platform management and analytics
- [ ] **API Rate Limiting**: Advanced security and usage controls
- [ ] **Multi-tenancy**: Support for multiple organizations

#### AI & Analytics
- [ ] **Resume Scoring**: AI-based candidate ranking and matching
- [ ] **Job Recommendations**: ML-powered job suggestions
- [ ] **Interview Insights**: AI analysis of interview performance
- [ ] **Predictive Analytics**: Hiring success predictions
- [ ] **Skills Gap Analysis**: Market trends and skill demands

#### Technical Improvements
- [ ] **Cloud Storage**: Cloudinary/AWS S3 integration for resume files
- [ ] **Microservices**: Further break down monolith into focused services
- [ ] **Caching**: Redis implementation for performance optimization
- [ ] **Load Balancing**: Handle high traffic scenarios with clustering
- [ ] **CI/CD Pipeline**: Automated testing and deployment workflows
- [ ] **Docker Containerization**: Complete containerization for easy deployment
- [ ] **API Gateway**: Centralized API management and rate limiting

## ⚠️ Current Limitations & Known Issues

### Technical Constraints
- **AI Service Dependency**: Resume parsing requires active FastAPI service and Gemini API
- **File Format Support**: Currently limited to PDF resumes only (no DOC/DOCX)
- **Local File Storage**: Files stored locally (not cloud-optimized for production)
- **Single AI Provider**: Dependent on Google Gemini (no fallback providers)
- **Manual Service Management**: Requires manual startup of multiple services

### Parsing Limitations
- **Scanned PDFs**: May not work well with image-based PDF resumes
- **Complex Layouts**: Advanced resume designs might cause parsing issues
- **Language Support**: Primarily optimized for English resumes
- **Data Quality**: Parsing accuracy depends on resume format and quality

### Scalability Considerations
- **Concurrent Users**: Not yet tested for high concurrent usage
- **File Size Limits**: Current resume file size limits not production-optimized
- **Database Performance**: No indexing optimization for large datasets
- **API Rate Limits**: No rate limiting implemented for AI service calls

## 🔮 Development Roadmap

### Phase 4 - Production Readiness (Next 2-3 months)
1. **Cloud Infrastructure**: Deploy to AWS/Azure with proper scaling
2. **File Storage Migration**: Move to cloud storage (Cloudinary/S3)
3. **Performance Optimization**: Implement caching and database indexing
4. **Security Hardening**: Add rate limiting, API security, and monitoring
5. **Testing**: Comprehensive unit, integration, and load testing

### Phase 5 - Advanced AI Features (3-6 months)
1. **Multi-format Support**: Add DOC/DOCX and image-based resume parsing
2. **Resume Scoring**: AI-based candidate ranking and job matching
3. **Interview Intelligence**: AI analysis of interview performance
4. **Predictive Analytics**: Hiring success rate predictions
5. **Skills Gap Analysis**: Market trend analysis and recommendations

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Python (v3.8+ for resume parser)
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key (for AI resume parsing)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-orbit
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file with the following variables:
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

4. **AI Resume Parser Setup**
   ```bash
   cd ../jobOrbitResume
   
   # Create virtual environment
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   
   # Install dependencies
   pip install fastapi uvicorn python-multipart google-generativeai pdfplumber python-dotenv
   
   # Create .env file and add your Gemini API key
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

5. **Environment Configuration**
   
   Create `server/.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/joborbit
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   UPLOAD_PATH=./uploads
   RESUME_PARSER_URL=http://127.0.0.1:8000
   ```

   Create `jobOrbitResume/.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. **Start the Application**
   
   **🚀 Quick Start (Windows) - Recommended:**
   ```bash
   # Simply double-click or run the startup script
   start-all-services.bat
   ```
   This will automatically start all three services in separate terminal windows.

   **Manual Startup (All Platforms):**
   
   You'll need 3 separate terminals:
   
   **Terminal 1 - AI Resume Parser:**
   ```bash
   cd jobOrbitResume
   .\venv\Scripts\activate     # Windows
   # source venv/bin/activate  # Mac/Linux
   uvicorn main:app --reload --port 8000
   ```

   **Terminal 2 - Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 3 - Frontend Application:**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the Application**

   Once all services are running (wait ~10-15 seconds for full startup):
   
   - 🌐 **Main Application**: http://localhost:5173
   - 🔧 **Backend API**: http://localhost:5000/api/health
   - 🤖 **AI Parser API**: http://127.0.0.1:8000/docs
   - 📚 **API Documentation**: http://127.0.0.1:8000/docs

8. **Verify Installation**
   
   To ensure everything is working correctly:
   
   1. **Check Services**: Visit http://localhost:5173 (should load the homepage)
   2. **Test AI Parser**: Visit http://127.0.0.1:8000/docs (should show FastAPI docs)
   3. **Create Account**: Register as a candidate or recruiter
   4. **Upload Resume**: Test the AI resume parsing feature
   5. **Browse Features**: Explore job posting, application tracking, etc.

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 🔧 Service Not Starting
**Problem**: One or more services fail to start
**Solutions**:
- Ensure all dependencies are installed (`npm install` and `pip install`)
- Check if ports 3000, 5000, 5173, and 8000 are available
- Verify MongoDB is running locally or connection string is correct
- Check `.env` files contain valid Gemini API key

#### 🤖 AI Parsing Not Working
**Problem**: Resume upload works but no auto-filling occurs
**Solutions**:
- Verify FastAPI service is running on port 8000
- Check if GEMINI_API_KEY is valid in `jobOrbitResume/.env`
- Ensure you have sufficient Gemini API quota
- Try with a simple, text-based PDF resume first

#### 💾 Database Connection Issues
**Problem**: Backend can't connect to MongoDB
**Solutions**:
- Start MongoDB service locally: `mongod`
- Update `MONGODB_URI` in `server/.env`
- For MongoDB Atlas, ensure IP is whitelisted
- Check firewall settings for MongoDB port (27017)

#### 🔒 Authentication Problems
**Problem**: Login/register not working
**Solutions**:
- Clear browser cookies and localStorage
- Check if JWT_SECRET is set in `server/.env`
- Verify backend server is running on port 5000
- Check browser console for detailed error messages

#### 📱 Frontend Not Loading
**Problem**: http://localhost:5173 shows error
**Solutions**:
- Run `npm install` in client directory
- Check if Vite dev server started successfully
- Clear browser cache and try incognito mode
- Ensure no conflicting processes on port 5173

### Performance Tips

- **RAM Usage**: The application uses ~300-500MB RAM total
- **CPU**: AI parsing is CPU-intensive, expect higher usage during parsing
- **Storage**: Resume files accumulate in `server/uploads/resumes/`
- **Network**: Gemini AI calls require stable internet connection

### Getting Help

1. **Check Logs**: Each service shows detailed logs in terminal
2. **Browser DevTools**: Check console for JavaScript errors
3. **API Testing**: Use tools like Postman to test backend endpoints
4. **Documentation**: Refer to `BACKEND_DOCUMENTATION.md` for API details

9. **Create Upload Directory (if needed)**
   ```bash
   # Create uploads directory for resume storage
   cd server
   mkdir -p uploads/resumes
   ```

7. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### Available Scripts

#### Frontend (Client)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend (Server)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/candidate/register` - Register candidate
- `POST /api/auth/candidate/login` - Login candidate
- `POST /api/auth/recruiter/register` - Register recruiter
- `POST /api/auth/recruiter/login` - Login recruiter
- `GET /api/auth/candidate/me` - Get candidate profile
- `GET /api/auth/recruiter/me` - Get recruiter profile
- `GET /api/auth/recruiter/dashboard` - Get recruiter dashboard stats

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (recruiter only)
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)
- `POST /api/jobs/:id/apply` - Apply to job (candidate only)
- `POST /api/jobs/:id/save` - Save job (candidate only)
- `PUT /api/jobs/:id/status` - Update application status (recruiter only)

### Interviews
- `POST /api/interviews` - Schedule interview (recruiter only)
- `GET /api/interviews/recruiter` - Get recruiter's interviews
- `GET /api/interviews/candidate` - Get candidate's interviews
- `PUT /api/interviews/:id` - Update interview details
- `DELETE /api/interviews/:id` - Cancel interview
- `POST /api/interviews/:id/feedback` - Add interview feedback

### Resume Management
- `POST /api/candidate/upload-resume` - Upload resume PDF with AI parsing
- `POST /api/candidate/parse-existing` - Re-parse existing resume
- `GET /api/candidate/profile` - Get full candidate profile with resume
- `GET /api/recruiter/resume/:candidateId` - View candidate resume (recruiter only)

### AI Resume Parser Service (FastAPI)
- `POST /parse-resume/` - Parse PDF resume and extract structured data using Google Gemini AI
- `GET /docs` - Interactive Swagger API documentation
- `GET /` - Service health check

### User Management
- `GET /api/jobs/applications` - Get candidate applications
- `GET /api/jobs/saved` - Get saved jobs
- `GET /api/jobs/recruiter/myjobs` - Get recruiter's posted jobs

## 🎯 Demo & Testing

### Database Setup
The application uses MongoDB. You can either:
- **Local MongoDB**: Install MongoDB locally
- **MongoDB Atlas**: Use cloud MongoDB (recommended)

### Authentication
The application now uses **real JWT-based authentication**. You need to register accounts to access features.

### File Storage
Resume files are stored locally in the `server/uploads/resumes/` directory. Make sure this directory exists and has proper permissions.

### Test Data
To test the application:
1. Register as both candidate and recruiter
2. Upload resume as candidate (PDF format)
3. Post jobs as recruiter
4. Apply to jobs as candidate
5. Upload resume with AI parsing (NEW!)
6. Auto-fill profile from resume data (NEW!)
7. Schedule interviews as recruiter
8. View resumes using the integrated PDF viewer
9. Track applications and update statuses
10. View real-time dashboard analytics

## 🤖 AI Resume Parser Features

### What it does:
- **Intelligent Text Extraction**: Uses Google Gemini AI to accurately extract information from PDF resumes
- **Auto-Profile Population**: Automatically fills candidate profile fields with extracted data
- **Smart Data Mapping**: Intelligently maps resume content to appropriate profile sections
- **Re-parsing Capability**: Allows users to re-analyze existing resumes for improved accuracy

### Extracted Information:
- **Personal Details**: Name, email, phone number
- **Professional Info**: Skills, experience level, education details
- **Contact Information**: Portfolio URLs, LinkedIn profiles
- **Location Data**: Address and location preferences

### User Experience:
1. **Upload Resume**: Drag & drop or select PDF resume
2. **AI Processing**: System automatically extracts structured data
3. **Review & Edit**: User reviews auto-filled information
4. **Save Profile**: Confirm and save the complete profile
5. **Re-parse Option**: Re-analyze resume anytime for updates

## 🎯 Current Feature Status (What Works Now)

### ✅ Fully Functional Features

#### For Candidates (Job Seekers)
- **Complete Registration/Login**: Secure JWT authentication with profile validation
- **AI Resume Upload**: Upload PDF resumes with automatic information extraction
- **Smart Profile Auto-Fill**: AI extracts name, email, phone, skills, education, experience
- **Profile Management**: Edit and update all profile information with completeness tracking
- **Job Search & Discovery**: Browse jobs with advanced filters (location, salary, type, skills)
- **Instant Job Applications**: Apply to jobs with one click
- **Application Tracking**: Real-time status updates (applied → under-review → interviewed → hired/rejected)
- **Interview Management**: View and manage scheduled interviews
- **Dashboard Analytics**: Visual insights into application progress and profile completeness
- **Resume Re-parsing**: Re-analyze existing resumes for improved data extraction

#### For Recruiters (Hiring Managers)
- **Company Registration**: Complete recruiter onboarding with company information
- **Job Posting Management**: Create, edit, update, and delete job listings
- **Advanced Applicant Management**: Filter, sort, and manage candidate applications
- **Resume Viewing**: Integrated PDF viewer for candidate resume evaluation
- **Interview Scheduling**: Complete workflow for video, phone, and in-person interviews
- **Application Status Control**: Update candidate status through hiring pipeline
- **Analytics Dashboard**: Live hiring metrics, application counts, and success rates
- **Candidate Profile Review**: View complete candidate profiles with completeness scores

#### Technical Infrastructure
- **AI-Powered Parsing**: Google Gemini AI integration for intelligent resume processing
- **Microservices Architecture**: Separate FastAPI service for AI functionality
- **Real-time Data**: Live updates across dashboards and application tracking
- **File Management**: Secure PDF upload, storage, and retrieval system
- **Data Validation**: Comprehensive input validation on frontend and backend
- **Error Handling**: Robust error management with user-friendly messages
- **Responsive Design**: Mobile-first approach with seamless cross-device experience

### 🔧 System Capabilities

#### Performance & Reliability
- **Fast Load Times**: Optimized with Vite build system and efficient API calls
- **Graceful Degradation**: Resume upload works even if AI parsing fails
- **Data Integrity**: Automatic profile completeness calculation and validation
- **Security**: JWT authentication, bcrypt password hashing, input sanitization
- **Scalable Architecture**: Modular design ready for horizontal scaling

## 📱 Features Demo

### Job Seeker Flow
1. **Register/Login** → Create candidate account
2. **Upload Resume** → Upload PDF resume with AI parsing (NEW!)
3. **Auto-Profile Creation** → Review and edit AI-extracted profile data (NEW!)
4. **Complete Profile** → Add additional details as needed
5. **Browse Jobs** → Search with advanced filters
6. **Apply to Jobs** → Submit applications instantly
7. **Track Applications** → Monitor status updates in real-time
8. **Interview Management** → View and manage scheduled interviews
9. **Save Jobs** → Bookmark interesting positions
10. **Dashboard Analytics** → View application insights
11. **Re-parse Resume** → Update profile with improved AI extraction (NEW!)

### Recruiter Flow
1. **Register/Login** → Create recruiter account
2. **Complete Company Profile** → Add company information
3. **Post Jobs** → Create detailed job listings
4. **Manage Applications** → Review candidate applications
5. **View Resumes** → Access candidate resumes with integrated PDF viewer
6. **Schedule Interviews** → Set up video, phone, or in-person interviews
7. **Update Status** → Progress candidates through hiring pipeline
8. **Interview Management** → Track and manage all scheduled interviews
9. **Dashboard Analytics** → View hiring metrics and statistics
10. **Job Management** → Edit, update, or delete job postings

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface with Tailwind CSS v4.1.11
- **Responsive Layout**: Mobile-first approach with seamless experience
- **Interactive Elements**: Smooth animations and transitions
- **Toast Notifications**: React Toastify integration for user feedback
- **Modal Components**: Interview scheduler and resume viewer modals
- **File Upload UI**: Drag-and-drop resume upload interface
- **PDF Viewer**: Integrated resume viewing with download functionality
- **Real-time Updates**: Live dashboard statistics and notifications
- **Loading States**: Proper loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and retry options
- **Accessibility**: WCAG-compliant components
- **Form Validation**: Comprehensive input validation on frontend and backend

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/joborbit
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-complex
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=./uploads
```

#### Frontend (Optional - for different API URL)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### MongoDB Setup

#### Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt install mongodb

# Start MongoDB service
mongod
```

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get connection string
4. Add to `MONGODB_URI` in `.env`

### Security Configuration
- Use strong JWT secrets in production
- Enable MongoDB authentication
- Configure CORS for production domains
- Use HTTPS in production
- Set secure cookie flags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code structure and naming conventions
- Add proper error handling and validation
- Update documentation for new features
- Test both frontend and backend changes
- Ensure mobile responsiveness

## � Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
cd server
# Set environment variables in hosting platform
# Deploy with start script
```

### Environment Variables for Production
- Set secure JWT secrets
- Configure production database URLs
- Update CORS origins
- Enable proper logging

## 🏆 Project Summary

**JobOrbit** represents a cutting-edge solution in the recruitment technology space, successfully combining traditional job board functionality with modern AI capabilities. This full-stack application demonstrates the power of integrating multiple technologies to create a seamless, intelligent hiring platform.

### Key Achievements
- ✅ **Complete MERN Stack Implementation** with microservices architecture
- ✅ **AI-Powered Resume Processing** using Google Gemini for intelligent data extraction
- ✅ **Real-time Application Tracking** with live status updates and analytics
- ✅ **Professional User Experience** with modern, responsive design
- ✅ **Scalable Architecture** ready for production deployment and horizontal scaling

### Technical Excellence
- 🔧 **Robust Backend API** with comprehensive validation and error handling
- 🤖 **Intelligent Parsing Service** with graceful fallbacks and error recovery
- 📱 **Modern Frontend** built with latest React and Tailwind CSS
- 🛡️ **Security Best Practices** including JWT authentication and input sanitization
- 📊 **Data-Driven Insights** with automatic completeness tracking and analytics

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📞 Contact & Support

**Developer**: Bhuvan Goyal  
📧 **Email**: bhuvangoyal6002@gmail.com  
💼 **GitHub**: [Bhuvangoyal466](https://github.com/Bhuvangoyal466)

For bug reports, feature requests, or technical support, please use the GitHub Issues tab or contact directly via email.

---

⭐ **If you find this project useful, please consider giving it a star!** ⭐

**JobOrbit** - Revolutionizing recruitment with AI-powered intelligence and modern technology. Built for the future of hiring.
