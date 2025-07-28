# JobOrbit - Smart Job Board with Resume Parser & Tracker

A full-stack MERN application that provides an intelligent job board platform with advanced resume parsing and application tracking capabilities.

## 🚀 Features

### For Job Seekers (Candidates)
- **User Authentication**: Secure JWT-based authentication
- **Smart Resume Parser**: AI-powered resume parsing (PDF/DOCX support)
- **Job Board**: Advanced job search with filters and matching
- **Application Tracker**: Real-time tracking of job applications with status updates
- **Dashboard Analytics**: Visual insights into application progress
- **Cover Letter Manager**: Template management system
- **Profile Management**: Complete candidate profile system

### For Recruiters
- **Recruiter Portal**: Dedicated dashboard for hiring managers
- **Job Posting**: Easy job posting with rich text editor
- **Applicant Management**: Advanced candidate filtering and management
- **Resume Viewing**: Integrated resume viewing and parsing
- **Application Status**: Update application statuses in real-time
- **Analytics**: Hiring pipeline analytics and insights

## 🛠️ Technology Stack

### Frontend
- **React** (v19.1.0) - Modern UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

### Planned Backend (Phase 2)
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cloudinary** - File upload and storage
- **PDF-Parse/Mammoth.js** - Resume parsing

## 📁 Project Structure

```
job-orbit/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/            # React Context providers
│   │   └── AuthContext.jsx
│   ├── layouts/            # Page layouts
│   │   ├── CandidateLayout.jsx
│   │   └── RecruiterLayout.jsx
│   ├── pages/              # Page components
│   │   ├── candidate/      # Job seeker pages
│   │   ├── recruiter/      # Recruiter pages
│   │   └── common/         # Shared pages
│   ├── routes/             # Routing configuration
│   │   └── AppRoutes.jsx
│   ├── utils/              # Utility functions
│   │   └── helpers.js
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global styles
│   ├── index.css          # Base styles
│   └── main.jsx           # App entry point
├── public/                 # Static assets
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚦 Current Status

### ✅ Completed (Phase 1 - Frontend Foundation)
- ✅ Project setup with Vite + React + Tailwind
- ✅ Routing system with protected routes
- ✅ Authentication context and UI
- ✅ Responsive navigation and layout
- ✅ Complete candidate portal:
  - Dashboard with analytics
  - Job board with search/filters
  - Resume upload interface (UI only)
  - Application tracker
  - Cover letter manager
- ✅ Complete recruiter portal:
  - Recruiter dashboard
  - Job posting form
  - Applicant management interface
- ✅ Landing pages (Home, About)
- ✅ 404 error page
- ✅ Mobile-responsive design

### 🔄 Next Phase (Backend Integration)
- [ ] Express.js API server setup
- [ ] MongoDB database design and connection
- [ ] User authentication APIs
- [ ] Resume parsing with pdf-parse/mammoth.js
- [ ] File upload integration with Cloudinary
- [ ] Job posting and search APIs
- [ ] Application tracking APIs
- [ ] Real-time notifications
- [ ] Email integration
- [ ] Admin panel

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-orbit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:5173` to see the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Demo Credentials

### For Testing (Mock Authentication)
- **Candidate Account**: Any email/password combination
- **Recruiter Account**: Any email/password combination

*Note: Currently using mock authentication. Real authentication will be implemented in Phase 2.*

## 📱 Features Demo

### Job Seeker Flow
1. **Register/Login** → Access candidate dashboard
2. **Upload Resume** → AI parsing simulation (UI only)
3. **Browse Jobs** → Search with filters
4. **Apply to Jobs** → Track applications
5. **Manage Cover Letters** → Template system

### Recruiter Flow
1. **Register/Login** → Access recruiter dashboard
2. **Post Jobs** → Create job listings
3. **Manage Applicants** → Review and track candidates
4. **Update Status** → Change application statuses

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first approach
- **Interactive Elements**: Smooth animations and transitions
- **Accessibility**: WCAG-compliant components
- **Dark/Light Theme**: Ready for theme switching
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### Environment Variables (For Future Backend)
```env
VITE_API_BASE_URL=http://localhost:3001/api
MONGODB_URI=mongodb://localhost:27017/joborbit
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or support, please contact [bhuvangoyal6002@gmail.com]

---

**Note**: This is currently a frontend-only implementation. The backend API, database integration, and file upload functionality will be implemented in the next phase of development.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
