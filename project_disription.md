# Chopistics 

## Project Overview
**Project Name:** Chopistics
**Project Type:** Course management web application using fundamental web technologies

## Scope 

### Core Features ()
- **Multi-page Web Application**
  - Static HTML pages with dynamic content via JavaScript
  - Client-side routing simulation
  - Form-based interactions

- **Role-Based Authentication**
  - Login/Register forms with client-side validation
  - Session simulation using localStorage
  - Admin vs Student interface switching

- **Course Management (Admin)**
  - Admin dashboard page
  - Create/edit course forms
  - Course content with rich text (HTML)
  - Upload video links (YouTube embed)

- **Question Management (Admin)**
  - Create/edit question forms
  - Associate questions with courses
  - LeetCode link management

- **Student Experience**
  - Course catalog page
  - Course detail pages with content
  - Question lists with LeetCode links
  - Progress tracking with checkboxes (localStorage)

### Technical Architecture

**Frontend Only ( Phase):**
- **HTML5** - Semantic markup and forms
- **CSS3** - Custom styles and animations
- **Bootstrap 5** - Responsive grid and components
- **Vanilla JavaScript** - DOM manipulation and interactions
- **TypeScript** - Type safety (compiled to JS)
- **LocalStorage** - Data persistence simulation

**Build Tools:**
- **TypeScript Compiler** - For TS to JS compilation
- **Live Server** - Development server
- **Git** - Version control

### File Structure
```
chopistics-/
├── index.html (Landing/Login)
├── dashboard.html (Role-based dashboard)
├── courses.html (Course catalog)
├── course-detail.html (Individual course)
├── admin/
│   ├── create-course.html
│   ├── create-question.html
│   └── manage-courses.html
├── css/
│   ├── main.css
│   ├── dashboard.css
│   └── course.css
├── src/ (TypeScript source files)
│   ├── auth.ts
│   ├── courses.ts
│   ├── questions.ts
│   ├── progress.ts
│   ├── utils.ts
│   └── types.ts
├── dist/ (Generated JavaScript - created automatically)
│   ├── auth.js
│   ├── courses.js
│   ├── questions.js
│   ├── progress.js
│   ├── utils.js
│   └── types.js
├── tsconfig.json (TypeScript configuration)
├── package.json (Build scripts)
└── assets/
    ├── images/
    └── videos/
```

**Setup Commands:**
```bash
npm init -y
npm install -D typescript
npx tsc --init
npm run build  # Compiles all .ts files to .js
```

## Development Tasks Breakdown

### Phase 1: Foundation & Authentication 
- [ ] Project structure and HTML templates
- [ ] Bootstrap integration and responsive layout
- [ ] TypeScript setup and build process
- [ ] Authentication system (localStorage based)
- [ ] Role-based page access and navigation
- [ ] Form validation and user feedback

### Phase 2: Admin Features 
- [ ] Admin dashboard with course overview
- [ ] Course creation and editing forms
- [ ] Rich text content editor (simple HTML)
- [ ] Question creation and management
- [ ] Course-question association interface
- [ ] Data persistence with localStorage

### Phase 3: Student Features 
- [ ] Course catalog with search/filter
- [ ] Course detail pages with content display
- [ ] Video embedding and content formatting
- [ ] Question lists with LeetCode integration
- [ ] Progress tracking system
- [ ] Student dashboard with statistics

### Phase 4: Polish & Enhancement 
- [ ] UI/UX improvements and animations
- [ ] Mobile responsiveness testing
- [ ] Error handling and edge cases
- [ ] Data validation and sanitization
- [ ] Performance optimization
- [ ] Documentation and code cleanup

## Team Roles & Responsibilities

### Role 1: Frontend Architecture & TypeScript 
**Primary Focus:** Project structure, TypeScript, and core functionality

**Responsibilities:**
- Set up project structure and build process
- Configure TypeScript compilation and types
- Create utility functions and helper classes
- Implement authentication logic
- Handle localStorage data management
- Create reusable JavaScript modules
- Code quality and standards enforcement

**Key Files:** 
- `src/types.ts`, `src/utils.ts`, `src/auth.ts`
- `tsconfig.json` and build configuration

### Role 2: UI/UX Developer & Bootstrap 
**Primary Focus:** Visual design and user interface

**Responsibilities:**
- Design all HTML page layouts
- Implement responsive design with Bootstrap
- Create custom CSS styles and animations
- Handle form design and validation feedback
- Ensure mobile-first responsive design
- Create consistent visual identity
- User experience optimization

**Key Files:**
- All `.html` files, `css/` directory
- Bootstrap customization and responsive breakpoints

### Role 3: Features Developer & Integration 
**Primary Focus:** Core features and user interactions

**Responsibilities:**
- Implement course management functionality
- Create question management system
- Build progress tracking features
- Handle dynamic content loading
- Create interactive elements and forms
- Integrate all components together
- Testing and debugging

**Key Files:**
- `src/courses.ts`, `src/questions.ts`, `src/progress.ts`
- Feature integration and dynamic content generation

## Key Pages & Functionality

### 1. Landing/Login Page (`index.html`)
```html
- Hero section with project description
- Login/Register forms with validation
- Role selection (Admin/Student)
- Responsive design with Bootstrap cards
```

### 2. Dashboard (`dashboard.html`)
```html
Admin View:
- Course management overview
- Quick stats (total courses, questions)
- Recent activity feed
- Navigation to admin tools

Student View:  
- Enrolled courses with progress
- Recently accessed content
- Achievement indicators
- Continue learning section
```

### 3. Course Catalog (`courses.html`)
```html
- Grid layout of course cards
- Search and filter functionality
- Course preview with description
- Difficulty and progress indicators
```

### 4. Course Detail (`course-detail.html`)
```html
- Course content display (HTML rich text)
- Embedded video player
- Associated questions list
- Progress tracking checkboxes
- Navigation between sections
```

### 5. Admin Tools (`admin/`)
```html
- Course creation/editing forms
- Question management interface
- Drag-and-drop question ordering
- Preview functionality
```

## Data Models (LocalStorage)

### TypeScript Interfaces
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  content: string; // HTML content
  videoUrl?: string;
  createdBy: string;
  createdAt: string;
}

interface Question {
  id: string;
  courseId: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeUrl: string;
  order: number;
}

interface UserProgress {
  userId: string;
  questionId: string;
  completed: boolean;
  completedAt?: string;
}
```

## Key JavaScript Functionality

### Authentication System
```javascript
// Simulated login with role-based redirect
function login(username, password) {
  // Validate credentials
  // Store user session in localStorage
  // Redirect based on role
}

// Role-based page protection
function checkAuth() {
  // Verify user session
  // Redirect if unauthorized
}
```

### Course Management
```javascript
// CRUD operations using localStorage
function createCourse(courseData) {
  // Validate and save course
  // Update UI dynamically
}

function loadCourses() {
  // Retrieve from localStorage
  // Render course cards
}
```

### Progress Tracking
```javascript
// Track question completion
function markComplete(questionId) {
  // Update progress in localStorage
  // Update UI indicators
  // Calculate completion percentage
}
```