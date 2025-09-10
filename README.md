# JobOrbit - Smart Job Board with Resume Parser & Tracker

A full-stack MERN application that provides an intelligent job board platform with advanced resume parsing and application tracking capabilities.

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
- 🔄 **Resume Parser**: AI-powered resume parsing (PDF/DOCX support) - *Coming Soon*

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
- 🔄 **Cloudinary** - Cloud file storage - *Coming Soon*
- 🔄 **PDF-Parse/Mammoth.js** - Resume parsing - *Coming Soon*

## 📁 Project Structure

```
job-orbit/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Footer.jsx
│   │   │   ├── InterviewScheduler.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ResumeViewer.jsx
│   │   ├── context/        # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── useAuth.js
│   │   ├── layouts/        # Page layouts
│   │   │   ├── CandidateLayout.jsx
│   │   │   └── RecruiterLayout.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── candidate/  # Job seeker pages
│   │   │   ├── recruiter/  # Recruiter pages
│   │   │   └── common/     # Shared pages
│   │   ├── routes/         # Routing configuration
│   │   │   └── AppRoutes.jsx
│   │   ├── utils/          # Utility functions & API calls
│   │   │   └── api.js
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Backend Node.js application
│   ├── config/             # Database and app configuration
│   │   └── db.js
│   ├── controllers/        # Request handlers
│   │   ├── authCandidate.js
│   │   ├── authRecruiter.js
│   │   └── jobs.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── models/             # MongoDB schemas
│   │   ├── Candidate.js
│   │   ├── Interview.js
│   │   ├── Job.js
│   │   └── Recruiter.js
│   ├── routes/             # API routes
│   │   ├── authCandidate.js
│   │   ├── authRecruiter.js
│   │   ├── interviews.js
│   │   ├── jobs.js
│   │   └── resume.js
│   ├── uploads/            # File storage
│   │   └── resumes/        # Resume PDF files
│   ├── package.json
│   └── server.js           # Server entry point
└── README.md
```

## 🚦 Current Status

### ✅ Completed Features

#### Frontend (Phase 1)
- ✅ Project setup with Vite + React + Tailwind
- ✅ Routing system with protected routes
- ✅ Authentication context and UI
- ✅ Responsive navigation and layout
- ✅ Complete candidate portal with all pages
- ✅ Complete recruiter portal with all pages
- ✅ Landing pages (Home, About)
- ✅ 404 error page
- ✅ Mobile-responsive design

#### Backend (Phase 2 - Recently Completed)
- ✅ Express.js API server setup
- ✅ MongoDB database connection and configuration
- ✅ Comprehensive user authentication APIs
  - JWT-based authentication
  - Secure password hashing
  - Input validation
- ✅ Complete job management system
  - Job posting, updating, and deletion
  - Advanced job search with filters
  - Job applications and status tracking
- ✅ User profile management
  - Candidate and recruiter profiles
  - Profile updates and password changes
- ✅ Real-time dashboard analytics
  - Live stats for recruiters (active jobs, applications, hires)
  - Application tracking for candidates
- ✅ Application workflow management
  - Apply to jobs instantly
  - Save/bookmark jobs
  - Status updates (applied → under-review → interviewed → hired/rejected)
- ✅ **Resume Management System**
  - PDF resume upload with Multer
  - File storage and retrieval
  - Resume viewing for recruiters
- ✅ **Interview Management System**
  - Complete interview scheduling workflow
  - Multiple interview types (video, phone, in-person)
  - Interview status tracking and feedback
  - Calendar integration

#### Database Models
- ✅ **User Models**: Comprehensive Candidate and Recruiter schemas
- ✅ **Job Model**: Full job posting with applicant tracking
- ✅ **Interview Model**: Complete interview management with scheduling
- ✅ **Authentication**: JWT middleware and protected routes
- ✅ **File Upload**: Multer integration for resume management
- ✅ **Validation**: Express-validator for all inputs
- ✅ **Statistics**: Auto-updating dashboard metrics

### 🔄 Next Phase (Phase 3 - Advanced Features)
- [ ] Cloud file storage integration with Cloudinary
- [ ] Resume parsing with pdf-parse/mammoth.js
- [ ] Email integration for notifications
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced search with Elasticsearch
- [ ] Admin panel for platform management
- [ ] Payment integration for premium features
- [ ] Company verification system
- [ ] Video interview integration
- [ ] Advanced interview feedback system

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local installation or MongoDB Atlas)
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

4. **Environment Configuration**
   
   Create `server/.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/joborbit
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
```5. **Start the Application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Create Upload Directory**
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
- `POST /api/candidate/upload-resume` - Upload resume PDF
- `GET /api/candidate/profile` - Get full candidate profile with resume
- `GET /api/recruiter/resume/:candidateId` - View candidate resume (recruiter only)

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
5. Schedule interviews as recruiter
6. View resumes using the integrated PDF viewer
7. Track applications and update statuses
8. View real-time dashboard analytics

## 📱 Features Demo

### Job Seeker Flow
1. **Register/Login** → Create candidate account
2. **Complete Profile** → Add education, experience, skills
3. **Upload Resume** → Upload PDF resume for applications
4. **Browse Jobs** → Search with advanced filters
5. **Apply to Jobs** → Submit applications instantly
6. **Track Applications** → Monitor status updates in real-time
7. **Interview Management** → View and manage scheduled interviews
8. **Save Jobs** → Bookmark interesting positions
9. **Dashboard Analytics** → View application insights

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

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## � Contact

For questions or support, please contact bhuvangoyal6002@gmail.com

---

**JobOrbit** - A comprehensive job portal solution with modern technology stack and real-time features. Perfect for companies looking to streamline their hiring process and job seekers wanting to track their applications efficiently.
