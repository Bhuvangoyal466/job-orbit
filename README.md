# JobOrbit - Smart Job Board with Resume Parser & Tracker

A full-stack MERN application that provides an intelligent job board platform with advanced resume parsing and application tracking capabilities.

## 🚀 Features

### For Job Seekers (Candidates)
- ✅ **User Authentication**: Secure JWT-based authentication
- ✅ **Profile Management**: Complete candidate profile system with education, experience, and skills
- ✅ **Job Board**: Advanced job search with filters (location, type, salary, skills)
- ✅ **Job Applications**: Apply to jobs with cover letters
- ✅ **Application Tracker**: Real-time tracking of job applications with status updates
- ✅ **Saved Jobs**: Bookmark and manage favorite job listings
- ✅ **Dashboard Analytics**: Visual insights into application progress
- 🔄 **Resume Parser**: AI-powered resume parsing (PDF/DOCX support) - *Coming Soon*
- 🔄 **Cover Letter Manager**: Template management system - *Coming Soon*

### For Recruiters
- ✅ **Recruiter Portal**: Dedicated dashboard for hiring managers
- ✅ **Job Posting**: Easy job posting with comprehensive job details
- ✅ **Job Management**: Update, delete, and manage posted jobs
- ✅ **Applicant Management**: Advanced candidate filtering and management
- ✅ **Application Status**: Update application statuses (applied, under-review, interviewed, hired, rejected)
- ✅ **Real-time Analytics**: Live dashboard with hiring pipeline metrics
- ✅ **Company Profile**: Complete company information and verification system
- ✅ **Subscription Management**: Tiered plans with job posting limits

## 🛠️ Technology Stack

### Frontend
- **React** (v19.1.0) - Modern UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

### Backend
- ✅ **Node.js** - Server runtime
- ✅ **Express.js** - Web framework
- ✅ **MongoDB** - NoSQL database with Mongoose ODM
- ✅ **JWT** - Authentication tokens
- ✅ **bcryptjs** - Password hashing
- ✅ **express-validator** - Input validation
- ✅ **CORS** - Cross-origin resource sharing
- 🔄 **Cloudinary** - File upload and storage - *Coming Soon*
- 🔄 **PDF-Parse/Mammoth.js** - Resume parsing - *Coming Soon*

## 📁 Project Structure

```
job-orbit/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
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
│   │   │   ├── api.js
│   │   │   └── helpers.js
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
│   │   ├── Job.js
│   │   └── Recruiter.js
│   ├── routes/             # API routes
│   │   ├── authCandidate.js
│   │   ├── authRecruiter.js
│   │   └── jobs.js
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
  - Apply to jobs with cover letters
  - Save/bookmark jobs
  - Status updates (applied → under-review → interviewed → hired/rejected)

#### Database Models
- ✅ **User Models**: Comprehensive Candidate and Recruiter schemas
- ✅ **Job Model**: Full job posting with applicant tracking
- ✅ **Authentication**: JWT middleware and protected routes
- ✅ **Validation**: Express-validator for all inputs
- ✅ **Statistics**: Auto-updating dashboard metrics

### 🔄 Next Phase (Phase 3 - Advanced Features)
- [ ] File upload integration with Cloudinary
- [ ] Resume parsing with pdf-parse/mammoth.js
- [ ] Email integration for notifications
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced search with Elasticsearch
- [ ] Admin panel for platform management
- [ ] Payment integration for premium features
- [ ] Company verification system
- [ ] Interview scheduling system

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
   ```

5. **Start the Application**
   
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

6. **Access the Application**
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

### Test Data
To test the application:
1. Register as both candidate and recruiter
2. Post jobs as recruiter
3. Apply to jobs as candidate
4. Track applications and update statuses
5. View real-time dashboard analytics

## 📱 Features Demo

### Job Seeker Flow
1. **Register/Login** → Create candidate account
2. **Complete Profile** → Add education, experience, skills
3. **Browse Jobs** → Search with advanced filters
4. **Apply to Jobs** → Submit applications with cover letters
5. **Track Applications** → Monitor status updates in real-time
6. **Save Jobs** → Bookmark interesting positions
7. **Dashboard Analytics** → View application insights

### Recruiter Flow
1. **Register/Login** → Create recruiter account
2. **Complete Company Profile** → Add company information
3. **Post Jobs** → Create detailed job listings
4. **Manage Applications** → Review candidate applications
5. **Update Status** → Progress candidates through hiring pipeline
6. **Dashboard Analytics** → View hiring metrics and statistics
7. **Job Management** → Edit, update, or delete job postings

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Mobile-first approach with seamless experience
- **Interactive Elements**: Smooth animations and transitions
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
