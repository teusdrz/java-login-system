# 🔐 Java Authentication System - Enhanced Security Edition

<div align="center">

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![MVC](https://img.shields.io/badge/Architecture-MVC-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-RBAC-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

*A comprehensive console-based authentication system with role-based access control, built following MVC architecture principles.*

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Security](#-security)

</div>

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Recent Updates](#️-recent-updates)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🛡️ Security Features](#️-security-features)
- [🎯 User Roles & Permissions](#-user-roles--permissions)
- [⚙️ Installation](#️-installation)
- [🖥️ Usage](#️-usage)
- [🧪 Testing](#-testing)
- [📝 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🛠️ Recent Updates

### ✅ **System Stability Improvements** (Latest Release)
- 🔧 **Fixed all compilation errors** - System now compiles and runs without issues
- 🎯 **Simplified controllers** - Streamlined AuthController and NotificationController for better maintainability
- 🏗️ **Improved architecture** - Better separation of concerns and cleaner code structure
- 📦 **Enhanced BackupController** - Restructured backup management with proper error handling
- 🔐 **Corrected method signatures** - Fixed all method calls to match existing API
- 🧹 **Code cleanup** - Removed unused imports and resolved dependency issues

### 🔄 **What Was Fixed**
- **AuthController**: Simplified to use only implemented features, fixed registration flow
- **BackupController**: Complete restructure with proper class organization
- **NotificationController**: Simplified implementation with essential functionality  
- **Main.java**: Fixed method calls to match controller interface
- **Compilation Issues**: Resolved all missing method and import errors

---

## 🚀 Features

### 🔐 **Authentication & Authorization**
- ✅ Secure user registration with data validation
- ✅ User login/logout with session management
- ✅ Role-Based Access Control (RBAC)
- ✅ Account lockout protection after failed attempts
- ✅ Password strength validation

### 👤 **User Management**
- ✅ Comprehensive user profile management
- ✅ User search and filtering capabilities
- ✅ Account activation/deactivation
- ✅ Role assignment and modification
- ✅ User deletion with confirmation

### 📊 **System Administration**
- ✅ Real-time system statistics
- ✅ Audit logging and security reports
- ✅ Login history tracking
- ✅ System health monitoring
- ✅ User activity analytics

### 🛡️ **Security Features**
- ✅ Input validation and sanitization
- ✅ Failed login attempt tracking
- ✅ Account lockout mechanisms
- ✅ Permission-based access control
- ✅ Secure password handling

---

## 🏗️ Architecture

This project follows the **MVC (Model-View-Controller)** design pattern with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      VIEW       │◄──►│   CONTROLLER    │◄──►│      MODEL      │
│                 │    │                 │    │                 │
│ • ConsoleView   │    │ • AuthController│    │ • User          │
│ • User Interface│    │ • Business Logic│    │ • UserDatabase  │
│ • Input/Output  │    │ • Flow Control  │    │ • Data Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    SERVICES     │
                       │                 │
                       │ • PermissionSvc │
                       │ • Security Logic│
                       └─────────────────┘
```

---

## 📁 Project Structure

```
java-login-system/
├── 📁 src/main/java/com/loginapp/
│   ├── 📄 Main.java                    # Application entry point
│   ├── 📁 controller/
│   │   └── 📄 AuthController.java      # Main application controller
│   ├── 📁 model/
│   │   ├── 📄 User.java               # User entity model
│   │   ├── 📄 UserDatabase.java       # Data access layer
│   │   ├── 📄 Role.java               # Role enumeration
│   │   └── 📄 RegistrationResult.java # Registration response model
│   ├── 📁 services/
│   │   └── 📄 PermissionService.java  # Authorization service
│   └── 📁 view/
│       └── 📄 ConsoleView.java        # User interface layer
├── 📄 README.md                       # Project documentation
└── 📄 .gitignore                      # Git ignore file
```

---

## 🛡️ Security Features

### 🔒 **Account Protection**
- **Failed Login Protection**: Automatic account lockout after 5 failed attempts
- **Password Validation**: Enforced minimum 6 characters, maximum 50 characters
- **Input Sanitization**: All user inputs are validated and sanitized
- **Session Management**: Secure session handling with proper logout

### 📝 **Audit & Logging**
- **Login History**: Complete tracking of login attempts and sessions
- **Audit Trail**: Comprehensive logging of all system operations
- **Security Reports**: Real-time security status and threat detection

---

## 🎯 User Roles & Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| 🔴 **Admin** | Full System Access | • Manage all users and roles<br>• Access system administration<br>• View audit logs and reports<br>• System configuration |
| 🟡 **Moderator** | User Management | • Manage regular users<br>• Content moderation<br>• View user statistics<br>• Limited admin functions |
| 🟢 **User** | Basic Access | • Manage own profile<br>• Change password<br>• View public statistics<br>• Basic system usage |

### 🔐 **Default Test Accounts**

| Username | Password | Role | Purpose |
|----------|----------|------|---------|
| `admin` | `admin123` | Administrator | Full system testing |
| `moderator` | `mod123` | Moderator | User management testing |
| `testuser` | `password123` | User | Basic functionality testing |

> ⚠️ **Security Note**: Change default passwords in production environments!

---

## ⚙️ Installation

### 📋 **Prerequisites**
- ☕ Java 17 or higher
- 🔧 Git (for cloning)
- 💻 Terminal/Command Prompt

### 🚀 **Quick Start**

1. **Clone the repository**
```bash
git clone https://github.com/teusdrz/java-login-system.git
cd java-login-system
```

2. **Compile the project**
```bash
javac -d out -cp src src/main/java/com/loginapp/**/*.java
```

3. **Run the application**
```bash
java -cp out com.loginapp.Main
```

### 🐳 **Alternative: Using Docker** (Coming Soon)
```bash
docker build -t java-login-system .
docker run -it java-login-system
```

---

## 🖥️ Usage

### 🎮 **Main Menu Options**

```
================================
           MAIN MENU
================================
1. Login
2. Register
3. View Public Statistics
4. Exit
================================
```

### 👤 **User Dashboard**

After successful login, users see role-specific options:

```
================================
        USER DASHBOARD
================================
Welcome, [User Name]!
Role: [User Role]
Email: [User Email]
Account Status: [Active/Locked]

PROFILE OPTIONS:
1. View Profile Details
2. Edit Profile
3. Change Password

[Role-specific options appear here]

0. Logout
================================
```

### 🔧 **Admin Functions**

Administrators have access to advanced features:

- 👥 **User Management**: Create, modify, delete users
- 📊 **System Statistics**: View comprehensive system metrics
- 🔍 **Audit Logs**: Review security and system events
- ⚙️ **System Health**: Monitor application performance

---

## 🧪 Testing

### 🎯 **Test Scenarios**

1. **Authentication Testing**
   - Valid/invalid login attempts
   - Account lockout scenarios
   - Password validation

2. **Authorization Testing**
   - Role-based access verification
   - Permission boundary testing
   - Privilege escalation prevention

3. **Data Validation Testing**
   - Input sanitization
   - Email format validation
   - Username requirements

### 🏃‍♂️ **Running Tests**

```bash
# Compile and run basic functionality test
java -cp out com.loginapp.Main

# Test with default accounts
# Username: admin, Password: admin123
# Username: moderator, Password: mod123
# Username: testuser, Password: password123
```

---

## 📝 API Documentation

### 🔑 **Core Classes**

#### `AuthController`
Main application controller handling user interactions and business logic.

```java
public class AuthController {
    public void startApplication()           // Main application loop
    private void handleLogin()               // User authentication
    private void handleRegistration()        // User registration
    private void handleUserManagement()     // Admin user management
    // ... additional methods
}
```

#### `User`
User entity with comprehensive validation and role management.

```java
public class User {
    // Core properties
    private String username, password, email;
    private String firstName, lastName;
    private Role role;
    private boolean isActive, isLocked;
    
    // Validation methods
    public boolean isValidUsername()
    public boolean isValidPassword()
    public boolean isValidEmail()
    // ... additional methods
}
```

#### `PermissionService`
Centralized authorization and permission management.

```java
public class PermissionService {
    public boolean hasPermission(User user, String permission)
    public boolean canManageUser(User manager, User target)
    public boolean canChangeUserRole(User changer, User target, Role newRole)
    // ... additional methods
}
```

---

## 🚧 Roadmap

### 🎯 **Upcoming Features**

- [ ] 🗄️ **Database Integration** (MySQL/PostgreSQL)
- [ ] 🌐 **Web Interface** (Spring Boot)
- [ ] 🔐 **JWT Authentication**
- [ ] 📧 **Email Verification**
- [ ] 🔑 **Two-Factor Authentication (2FA)**
- [ ] 📱 **Mobile App Support**
- [ ] 🐳 **Docker Containerization**
- [ ] ☁️ **Cloud Deployment** (AWS/Azure)

### 🔄 **Recent Updates**

- ✅ **v1.2.0** - Enhanced role-based access control
- ✅ **v1.1.0** - Added audit logging and security reports
- ✅ **v1.0.0** - Initial release with basic authentication

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 **Fork the repository**
2. 🌿 **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. 📤 **Push to the branch** (`git push origin feature/amazing-feature`)
5. 🔄 **Open a Pull Request**

### 📝 **Contribution Guidelines**

- Follow Java coding conventions
- Add unit tests for new features
- Update documentation as needed
- Ensure backward compatibility

---

## 🐛 Issue Reporting

Found a bug? Please create an issue with:

- 🔍 **Clear description** of the problem
- 📝 **Steps to reproduce** the issue
- 💻 **Environment details** (Java version, OS)
- 📸 **Screenshots** if applicable

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Matheus Vinicius dos Reis Souza**
- GitHub: [@teusdrz](https://github.com/teusdrz)
- Project: [java-login-system](https://github.com/teusdrz/java-login-system)

---

## 🙏 Acknowledgments

- ☕ Built with Java
- 🏗️ MVC Architecture Pattern
- 🛡️ Security Best Practices
- 📚 Educational Purpose

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Matheus Vinicius](https://github.com/teusdrz)

</div>