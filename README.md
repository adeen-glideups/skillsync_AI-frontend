# SkillSync AI - Frontend Application

A modern web application designed to help job seekers match their resumes with job opportunities using AI-powered resume screening and job matching capabilities.

**Live Application**: [https://skillsync-ai-snowy.vercel.app](https://skillsync-ai-snowy.vercel.app)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Development Guide](#development-guide)
6. [Features](#features)
7. [File Organization](#file-organization)
8. [API Integration](#api-integration)
9. [Styling & Theme](#styling--theme)
10. [Authentication](#authentication)
11. [State Management](#state-management)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)
14. [Contributing](#contributing)

---

## 🎯 Project Overview

**SkillSync AI** is an intelligent job matching platform that:
- Enables users to upload and manage their resumes
- Uses AI to analyze resume content and match with job opportunities
- Provides a dashboard for tracking job applications
- Allows easy job applications with the Easy Apply feature
- Displays match scores and compatibility metrics

The application features a responsive, mobile-first design optimized for devices of all sizes.

**Current Version**: 0.0.0 (Development)

---

## 🛠️ Technology Stack

### Frontend Framework & Build Tools
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI library and component framework |
| **Vite** | 7.3.1 | Modern build tool and dev server |
| **React Router** | 7.13.1 | Client-side routing and navigation |
| **Babel/SWC** | Latest | JavaScript transpilation with Fast Refresh |

### Styling & CSS
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 4.2.1 | Utility-first CSS framework |
| **PostCSS** | 8.5.8 | CSS transformation and processing |
| **Autoprefixer** | 10.4.27 | Vendor prefix automation |
| **Custom CSS** | - | Custom stylesheets for specific components |

### Backend Integration & HTTP
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Axios** | 1.13.6 | HTTP client for API requests |
| **Firebase** | 12.10.0 | Authentication and backend services |

### State Management
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Zustand** | 5.0.11 | Lightweight state management |
| **React Context API** | Built-in | Local component state |

### Development Tools
| Technology | Version | Purpose |
|-----------|---------|---------|
| **ESLint** | 9.39.1 | JavaScript code quality and linting |
| **ESLint Plugin React** | 7.0.1 | React-specific linting rules |
| **ESLint Plugin React Refresh** | 0.4.24 | React Fast Refresh validation |

### Utilities
| Technology | Version | Purpose |
|-----------|---------|---------|
| **clsx** | 2.1.1 | Conditional CSS class names |

---

## 📁 Project Structure

```
skillsync-frontend/
├── public/                          # Static files
├── src/
│   ├── api/                         # API service layer
│   │   ├── auth.api.js              # Authentication endpoints
│   │   ├── easyApply.api.js         # Easy Apply endpoints
│   │   ├── jobs.api.js              # Job search endpoints
│   │   ├── matches.api.js           # Resume match endpoints
│   │   ├── resume.api.js            # Resume upload/management endpoints
│   │   └── index.js                 # API exports
│   │
│   ├── assets/                      # Static assets
│   │   ├── fonts/                   # Custom fonts
│   │   └── images/                  # Images and icons
│   │
│   ├── components/                  # Reusable React components
│   │   ├── EasyApplyModal.jsx       # Easy Apply form modal
│   │   ├── jobs/                    # Job-related components
│   │   │   ├── JobCard.jsx          # Individual job card
│   │   │   ├── JobList.jsx          # Job list container
│   │   │   └── MatchScoreBadge.jsx  # Match score display
│   │   ├── layout/                  # Layout components
│   │   │   ├── DashboardLayout.jsx  # Main dashboard wrapper
│   │   │   ├── Footer.jsx           # Application footer
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── PageWrapper.jsx      # Page container wrapper
│   │   ├── resume/                  # Resume-related components
│   │   │   ├── MatchList.jsx        # Match list container
│   │   │   ├── MatchResult.jsx      # Individual match result
│   │   │   └── ResumeUploader.jsx   # Resume upload form
│   │   └── ui/                      # Base UI components
│   │       ├── Badge.jsx            # Badge component
│   │       ├── Button.jsx           # Button component
│   │       ├── Card.jsx             # Card container
│   │       ├── Input.jsx            # Input field
│   │       ├── Modal.jsx            # Modal dialog
│   │       └── Spinner.jsx          # Loading spinner
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js               # Authentication hook
│   │   ├── useJobs.js               # Job fetching hook
│   │   └── useResumeMatch.js        # Resume match hook
│   │
│   ├── lib/                         # Third-party library setup
│   │   └── firebase.js              # Firebase configuration
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── DashboardPage.jsx        # Dashboard overview
│   │   ├── ForgotPasswordPage.jsx   # Password recovery
│   │   ├── JobsPage.jsx             # Job listing page
│   │   ├── LandingPage.jsx          # Landing/home page
│   │   ├── LoginPage.jsx            # User login
│   │   ├── MatchResultsPage.jsx     # Match results page
│   │   ├── RegisterPage.jsx         # User registration
│   │   └── dashboard/               # Dashboard sub-pages
│   │       ├── DashApplicationsPage.jsx   # User applications
│   │       ├── DashHomePage.jsx           # Dashboard home
│   │       ├── DashJobDetailPage.jsx      # Job detail view
│   │       ├── DashJobsPage.jsx           # Dashboard jobs list
│   │       ├── DashMatchesPage.jsx        # Dashboard matches
│   │       ├── DashProfilePage.jsx        # User profile
│   │       └── DashUploadPage.jsx         # Resume upload page
│   │
│   ├── routes/                      # Routing configuration
│   │   └── AppRouter.jsx            # Main router setup
│   │
│   ├── store/                       # Global state stores (Zustand)
│   │   ├── authStore.js             # Authentication state
│   │   └── matchStore.js            # Match results state
│   │
│   ├── styles/                      # Global and component styles
│   │   ├── auth.css                 # Authentication page styles
│   │   ├── dashboard.css            # Dashboard page styles
│   │   ├── easy-apply.css           # Easy Apply modal styles
│   │   ├── globals.css              # Global CSS variables & resets
│   │   ├── landing.css              # Landing page styles
│   │   └── theme.js                 # Theme configuration
│   │
│   ├── utils/                       # Utility functions
│   │   ├── cn.js                    # CSS class combine utility
│   │   ├── formatScore.js           # Score formatting utility
│   │   └── stripHtml.js             # HTML stripping utility
│   │
│   ├── App.jsx                      # Root component
│   └── main.jsx                     # Entry point
│
├── index.html                       # Main HTML file
├── landing.html                     # Landing page HTML
├── dashboard.html                   # Dashboard HTML
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── eslint.config.js                 # ESLint configuration
├── package.json                     # Dependencies and scripts
├── API_DOCUMENTATION.md             # API endpoint documentation
├── EASY_APPLY_API.md                # Easy Apply API specifics
└── README.md                        # This file
```

---

## 💻 Installation & Setup

### Prerequisites
- **Node.js**: 16.x or higher
- **npm** or **yarn**: Latest version
- **Git**: Version control

### Step 1: Clone the Repository
```bash
git clone https://github.com/adeen-glideups/skillsync_AI-frontend.git
cd skillsync-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all dependencies listed in `package.json`:
- React and React DOM
- React Router for navigation
- Axios for HTTP requests
- Firebase SDK
- Tailwind CSS and PostCSS
- Vite and build tools
- ESLint for code quality

### Step 3: Environmental Configuration
Create a `.env.local` file in the root directory for local development:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 4: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or next available port).

### Step 5: Build for Production
```bash
npm run build
```

This generates an optimized build in the `dist/` directory.

### Step 6: Preview Production Build
```bash
npm run preview
```

---

## 🚀 Development Guide

### Available npm Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Development Workflow

#### 1. **Hot Module Replacement (HMR)**
Vite provides instant HMR. Changes to components/styles are reflected immediately without full page reload.

#### 2. **Component Development**
Create new components in `src/components/` following naming conventions:
```jsx
// src/components/YourComponent.jsx
export default function YourComponent({ prop }) {
  return <div>{prop}</div>;
}
```

#### 3. **Styling Components**
- Use **Tailwind CSS** for utility classes (preferred)
- Component-specific styles in `src/styles/*.css`
- Import styles in components: `import '../styles/auth.css'`

#### 4. **API Integration**
Create API handlers in `src/api/` using Axios:
```javascript
// src/api/example.api.js
import axios from 'axios';

export const exampleAPI = {
  fetch: async () => {
    const response = await axios.get('/api/endpoint');
    return response.data;
  }
};
```

#### 5. **State Management**
Use Zustand stores for global state:
```javascript
// src/store/exampleStore.js
import { create } from 'zustand';

export const useExampleStore = create((set) => ({
  state: value,
  setState: (newValue) => set({ state: newValue }),
}));
```

---

## ✨ Features

### 1. **Authentication**
- User registration with email and password
- Secure login and logout
- Password recovery/reset functionality
- OTP verification for account security
- Auto-login capability with session persistence
- Firebase authentication backend

### 2. **Resume Management**
- Upload resume (PDF, DOC, DOCX formats)
- Multiple resume support (upload multiple versions)
- Resume preview functionality
- Resume parsing and analysis
- Resume deletion and replacement

### 3. **Job Matching**
- AI-powered resume-to-job matching
- Match score calculation (0-100%)
- Skill compatibility analysis
- Experience level alignment
- Detailed match breakdowns

### 4. **Job Search & Browsing**
- Comprehensive job listing with filters
- Search by keyword, location, company
- Sort by relevance, salary, recency
- Job detail view with full information
- Company information display

### 5. **Job Applications**
- Easy Apply feature for quick applications
- Pre-filled information from profile
- Application tracking
- Status monitoring (applied, in process, rejected)
- Application history

### 6. **Dashboard**
- Personalized user dashboard
- Quick stats (total applications, matches, etc.)
- Upcoming interviews schedule
- Application pipeline view
- Profile management
- Settings and preferences

### 7. **Responsive Design**
- Mobile-first design approach
- Optimized for all screen sizes (mobile, tablet, desktop)
- Touch-friendly interface
- Fast load times
- Offline capability (PWA features)

### 8. **AI-Powered Features**
- Intelligent resume parsing
- Job matching algorithm
- Skill extraction from resume
- Experience level detection
- Salary prediction

---

## 🎨 File Organization & Conventions

### Component Naming
- **Functional components**: PascalCase (e.g., `UserProfile.jsx`)
- **Custom hooks**: camelCase with `use` prefix (e.g., `useAuth.js`)
- **Utility files**: camelCase (e.g., `formatScore.js`)
- **Store files**: camelCase with `Store` suffix (e.g., `authStore.js`)

### CSS Class Naming (BEM Methodology)
```css
/* Block */
.dashboard { }

/* Block__Element */
.dashboard__header { }

/* Block__Element--Modifier */
.dashboard__header--dark { }
```

### Import Paths
Use alias for cleaner imports:
```javascript
// Instead of: import Component from '../../../components/...'
// Use: import Component from '@/components/...'
```

Configured in `vite.config.js`:
```javascript
resolve: {
  alias: {
    "@": "/src",
  },
}
```

---

## 🔌 API Integration

### Base Configuration
- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Authentication**: Bearer token in `Authorization` header
- **Content Type**: `application/json` or `multipart/form-data`

### API Modules

#### Authentication API (`src/api/auth.api.js`)
```javascript
// Registration
POST /api/auth/signup
{ email, password, name, gender, profileImage }

// Login
POST /api/auth/login
{ email, password }

// Logout
POST /api/auth/logout

// Password Reset
POST /api/auth/forgot-password
{ email }
```

#### Resume API (`src/api/resume.api.js`)
```javascript
// Upload resume
POST /api/resume/upload
{ resume: File, metadata }

// Get all resumes
GET /api/resume/list
Auth: Yes

// Delete resume
DELETE /api/resume/:resumeId
Auth: Yes
```

#### Jobs API (`src/api/jobs.api.js`)
```javascript
// Get all jobs
GET /api/jobs?page=1&limit=20&search=keyword

// Get job details
GET /api/jobs/:jobId

// Search jobs
GET /api/jobs/search?q=keyword&location=location
```

#### Matches API (`src/api/matches.api.js`)
```javascript
// Get matches for resume
GET /api/matches/:resumeId
Auth: Yes

// Calculate match score
POST /api/matches/calculate
{ resumeId, jobId }
```

#### Easy Apply API (`src/api/easyApply.api.js`)
```javascript
// Quick apply to job
POST /api/easy-apply/apply
{ jobId, resumeId, coverLetter }

// Get easy apply status
GET /api/easy-apply/status/:applicationId
```

Refer to [API_DOCUMENTATION.md](API_DOCUMENTATION.md) and [EASY_APPLY_API.md](EASY_APPLY_API.md) for detailed endpoint specifications.

---

## 🎨 Styling & Theme

### CSS Architecture

#### Global Styles (`src/styles/globals.css`)
- CSS custom properties (variables)
- Color palette definitions
- Typography defaults
- Reset/normalize rules
- Animation keyframes

**CSS Variables Available:**
```css
--bg: Background color
--ink: Text color
--accent: Primary accent color
--rule: Border color
--shadow: Shadow styling
--border-radius: Default border radius
```

#### Theme System (`src/styles/theme.js`)
Centralized theme configuration:
```javascript
export const theme = {
  colors: { primary, secondary, success, error, warning, info },
  typography: { fontFamily, sizes, weights },
  spacing: { xs, sm, md, lg, xl },
  breakpoints: { mobile, tablet, desktop }
}
```

#### Tailwind CSS (`tailwind.config.js`)
- Configured with custom theme extensions
- Scans `./index.html` and `./src/**/*.{js,jsx}` for classes
- PostCSS integration for vendor prefixes

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| Mobile | < 600px | Phone devices |
| Tablet | 600px - 900px | Tablets and small devices |
| Desktop | > 901px | Large screens |

### Page-Specific Styles
- `auth.css`: Login, register, password reset pages
- `landing.css`: Landing/homepage
- `dashboard.css`: Dashboard and dashboard sub-pages
- `easy-apply.css`: Easy Apply modal and form

---

## 🔐 Authentication

### Authentication Flow

```
1. User submits login credentials
   ↓
2. Firebase authenticates and returns auth token
   ↓
3. Token stored in Zustand store (authStore)
   ↓
4. Token included in Authorization header for all API requests
   ↓
5. On app load, check for existing token and restore session
```

### Auth Store API (`src/store/authStore.js`)
```javascript
const { user, token, login, logout, register, isLoading } = useAuthStore();

// Check if user is authenticated
if (useAuthStore((state) => state.user)) {
  // User is logged in
}
```

### Protected Routes
Implemented in `src/routes/AppRouter.jsx` using React Router:
```jsx
<Route
  path="/dashboard"
  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
/>
```

### Session Persistence
- Token saved to localStorage
- Auto-restore on app initialization
- Auto-logout if token expires

---

## 🗂️ State Management

### Zustand Stores

#### Auth Store (`src/store/authStore.js`)
Manages:
- Current user data
- Authentication token
- Loading states
- Login/logout functions

#### Match Store (`src/store/matchStore.js`)
Manages:
- Matched jobs data
- Match filter preferences
- Selected resume for matching
- Match loading states

### Store Usage Pattern
```javascript
import { useAuthStore } from '@/store/authStore';

export default function Component() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  return <button onClick={logout}>Logout</button>;
}
```

---

## 🚀 Deployment

### Vercel Deployment (Current)
The application is deployed on Vercel at:
**https://skillsync-ai-snowy.vercel.app**

### Deployment Steps

#### 1. **Build Verification**
```bash
npm run build
npm run preview
```

#### 2. **Environment Variables**
Add to Vercel project settings:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_API_BASE_URL=...
```

#### 3. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

Or use GitHub integration for auto-deployment on push to main.

### Production Checklist
- [ ] All environment variables configured
- [ ] ESLint passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in production
- [ ] API endpoints tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized (lazy loading, code splitting)

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. **Dev Server Won't Start**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### 2. **Firebase Connection Issues**
- Verify `.env.local` has correct Firebase credentials
- Check Firebase project settings
- Ensure Firebase project is active

#### 3. **API Request 401 Errors**
- Token may have expired → logout and login again
- Check if token is being included in Authorization header
- Verify API endpoint is correct in environment variables

#### 4. **Styling Not Applying**
```bash
# Rebuild Tailwind CSS
npm run build
# Or restart dev server
npm run dev
```

#### 5. **Hot Reload Not Working**
- Check browser console for errors
- Restart dev server: `npm run dev`
- Clear browser cache

#### 6. **Build Size Too Large**
```bash
# Analyze bundle
# Add to package.json: npm install -D rollup-plugin-visualizer
# Use in vite.config.js for analysis
```

---

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest 2 | ✅ Full |
| Firefox | Latest 2 | ✅ Full |
| Safari | Latest 2 | ✅ Full |
| Edge | Latest 2 | ✅ Full |
| Mobile Safari | iOS 12+ | ✅ Full |
| Chrome Mobile | Latest | ✅ Full |

---

## 🤝 Contributing

### Git Workflow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: Add your feature description"

# 3. Push to origin
git push origin feature/your-feature-name

# 4. Create Pull Request on GitHub
```

### Code Style
- Follow ESLint rules: `npm run lint`
- Use Prettier for formatting
- Use semantic commit messages
- Write meaningful commit messages

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(dashboard): Add resume matching display

Add resume matching functionality to dashboard with score display
and job recommendations

Closes #123
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Axios Documentation](https://axios-http.com)

---

## 📝 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

## 👥 Team & Support

For questions or support, please contact the development team or create an issue on GitHub.

**Repository**: [adeen-glideups/skillsync_AI-frontend](https://github.com/adeen-glideups/skillsync_AI-frontend)

---

**Last Updated**: March 2026
**Version**: 0.0.0 (Development)
