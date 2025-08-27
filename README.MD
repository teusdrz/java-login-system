# Java Login System with Advanced Dashboard

A comprehensive full-stack application featuring a Java backend with a modern React frontend, complete with advanced GSAP animations and professional dashboard interface.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Java](https://img.shields.io/badge/Java-17+-orange)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![GSAP](https://img.shields.io/badge/GSAP-3.12+-green)

## 🚀 Features

### 🎯 **Advanced Dashboard with GSAP Animations**
- **Professional Admin Panel** with smooth GSAP-powered animations
- **Real-time System Monitoring** with animated metrics (CPU, Memory, Disk, Network)
- **Interactive Charts** using Recharts with smooth transitions
- **Responsive Design** optimized for all screen sizes
- **Dark/Light Theme** support with seamless switching

### 👥 **Comprehensive User Management**
- **Full CRUD Operations** - Create, Read, Update, Delete users
- **Role-based Access Control** (Admin, Moderator, User)
- **Advanced Search & Filtering** capabilities
- **User Status Management** with real-time updates
- **Animated Forms** with GSAP transitions

### 📊 **Analytics & Reporting**
- **Revenue Tracking** with growth indicators
- **User Engagement Analytics** and session monitoring
- **Growth Charts** with interactive data visualization
- **Error Rate Monitoring** and system performance metrics
- **Export Functionality** for reports and data

### 🔍 **Activity Monitoring**
- **Real-time Activity Timeline** with animated entries
- **Comprehensive Logging System** with filtering options
- **Visual Activity Indicators** with color-coded status
- **Event Tracking** for user actions and system events
- **Export Logs** functionality

### ⚙️ **System Configuration**
- **Security Settings** with timeout and authentication controls
- **System Maintenance** mode and backup settings
- **API Rate Limiting** configuration
- **User Registration** controls
- **Notification Settings** management

### 🔔 **Notifications Center**
- **Real-time Notifications** with animated alerts
- **Read/Unread Status** management
- **Categorized Alerts** (Success, Warning, Error, Info)
- **Interactive Management** with mark as read functionality

## �️ Technology Stack

### Backend (Java)
- **Java 17+** - Modern Java features
- **Maven** - Dependency management
- **RESTful API** - Clean API architecture
- **JSON Processing** - Data serialization
- **Basic Authentication** - Secure user authentication

### Frontend (React + TypeScript)
- **React 18+** - Modern React with hooks
- **TypeScript** - Type-safe development
- **GSAP + @gsap/react** - Professional animations
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Modern icon system

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Hot Reload** - Development server
- **TypeScript Compiler** - Type checking

## 📁 Project Structure

```
java-login-system/
├── src/main/java/com/loginapp/     # Java Backend
│   ├── Main.java                   # Application entry point
│   ├── api/                        # REST API endpoints
│   ├── controller/                 # Request controllers
│   ├── model/                      # Data models
│   ├── security/                   # Authentication logic
│   ├── server/                     # HTTP server
│   └── services/                   # Business logic
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── contexts/               # React contexts
│   │   ├── pages/                  # Application pages
│   │   │   └── Dashboard.tsx       # Main dashboard with GSAP
│   │   ├── services/               # API services
│   │   └── types/                  # TypeScript definitions
│   ├── public/                     # Static assets
│   └── package.json                # Frontend dependencies
├── postman/                        # API testing
│   ├── collections/                # Postman collections
│   └── environments/               # Test environments
└── api-tests/                      # HTTP test files
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+** installed
- **Node.js 18+** and npm
- **Maven 3.6+**

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/teusdrz/java-login-system.git
cd java-login-system

# Compile Java backend
mvn compile

# Run the backend server
java -cp target/classes com.loginapp.Main
```
The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install GSAP for animations
npm install gsap @gsap/react

# Start development server
npm start
```
The frontend will start on `http://localhost:3000`

## 📋 API Endpoints

### Authentication
```http
POST /api/auth/login    # User login
POST /api/auth/logout   # User logout
POST /api/auth/register # User registration
```

### User Management
```http
GET    /api/users       # Get all users
POST   /api/users       # Create new user
PUT    /api/users/:id   # Update user
DELETE /api/users/:id   # Delete user
```

### System
```http
GET /api/system/stats   # System statistics
GET /api/system/health  # Health check
GET /api/activity/logs  # Activity logs
```

## 🎨 Dashboard Features

### Main Dashboard
- **Real-time Metrics**: Live system monitoring with animated counters
- **User Statistics**: Total users, active users, new registrations
- **System Health**: CPU, Memory, Disk, and Network usage
- **Interactive Charts**: Growth trends and role distribution
- **Recent Activity**: Timeline of system events

### User Management
- **User Table**: Sortable and searchable user list
- **CRUD Operations**: Complete user lifecycle management
- **Role Assignment**: Admin, Moderator, User roles
- **Status Control**: Active/Inactive user management
- **Bulk Actions**: Multiple user operations

### Analytics
- **Revenue Tracking**: Financial metrics with growth indicators
- **Session Analytics**: User engagement and session duration
- **Growth Charts**: Visual representation of user growth
- **Error Monitoring**: System error rates and alerts

### Activity Monitor
- **Real-time Logs**: Live activity feed with animations
- **Event Filtering**: Filter by event type and user
- **Timeline View**: Chronological activity display
- **Export Options**: Download logs in various formats

### System Settings
- **Security Controls**: Timeout, 2FA, and authentication settings
- **Maintenance Mode**: System-wide maintenance controls
- **Backup Settings**: Automated backup configuration
- **API Configuration**: Rate limiting and access controls

## 🎬 Animations & Interactions

### GSAP Animations
- **Page Transitions**: Smooth navigation between sections
- **Card Animations**: Hover effects and loading states
- **Chart Animations**: Data visualization with smooth transitions
- **Form Interactions**: Animated form controls and validation
- **Timeline Effects**: Activity logs with staggered animations

### Interactive Elements
- **Hover States**: Professional hover effects on all interactive elements
- **Loading States**: Smooth loading animations for data fetching
- **Progress Bars**: Animated progress indicators for system metrics
- **Toggle Switches**: Smooth toggle animations for settings
- **Modal Dialogs**: Animated modals for user actions

## 🔧 Development

### Run Tests
```bash
# Backend tests
mvn test

# Frontend tests
cd frontend && npm test
```

### Build for Production
```bash
# Build frontend
cd frontend && npm run build

# Compile backend
mvn compile
```

### API Testing
Use the provided Postman collections in the `/postman` directory for comprehensive API testing.

## 📊 Performance

- **Fast Loading**: Optimized bundle size with code splitting
- **Smooth Animations**: 60fps GSAP animations
- **Responsive Design**: Mobile-first approach
- **Efficient Rendering**: React optimization techniques
- **Lazy Loading**: Components loaded on demand

## 🔒 Security Features

- **Authentication System**: Secure user login/logout
- **Role-based Access**: Granular permission controls
- **Session Management**: Configurable session timeouts
- **Input Validation**: Frontend and backend validation
- **Security Headers**: Proper HTTP security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GSAP** for the amazing animation library
- **React Team** for the excellent framework
- **Tailwind CSS** for the utility-first styling
- **Recharts** for beautiful data visualizations
- **Lucide** for the consistent icon system

---

**Made with ❤️ using Java, React, TypeScript, and GSAP**

*For more information or support, please open an issue in the repository.*

