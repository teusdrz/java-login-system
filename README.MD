Java Login System
A simple console-based login and registration system built in Java following MVC architecture.
📋 About
This is a basic Java project that demonstrates fundamental programming concepts including user authentication, data validation, and the MVC design pattern. The system allows users to register accounts, login, and manage their profiles through a console interface.
🛠️ Built With

Java 8+
Console-based interface
In-memory data storage

📁 Project Structure
java-login-system/
├── src/main/java/com/loginapp/
│   ├── Main.java                    # Application entry point
│   ├── model/
│   │   ├── User.java               # User data model
│   │   └── UserDatabase.java       # Database simulation
│   ├── view/
│   │   └── ConsoleView.java        # User interface
│   └── controller/
│       └── AuthController.java     # Application logic
└── README.md
⚙️ Prerequisites

Java JDK 8 or higher
Command line/terminal access

Check your Java installation:
bashjava --version
javac --version
🚀 Getting Started
1. Create Project Directory
bashmkdir java-login-system
cd java-login-system
2. Create Folder Structure
bashmkdir -p src/main/java/com/loginapp/model
mkdir -p src/main/java/com/loginapp/view
mkdir -p src/main/java/com/loginapp/controller
3. Create the Files
Create these 5 files and copy the provided code:

src/main/java/com/loginapp/Main.java
src/main/java/com/loginapp/model/User.java
src/main/java/com/loginapp/model/UserDatabase.java
src/main/java/com/loginapp/view/ConsoleView.java
src/main/java/com/loginapp/controller/AuthController.java

4. Compile the Project
bashjavac -d out -sourcepath src src/main/java/com/loginapp/*.java src/main/java/com/loginapp/*/*.java
5. Run the Application
bashjava -cp out com.loginapp.Main
🎮 How to Use
Default Test Accounts

Username: admin | Password: admin123
Username: testuser | Password: password123

Main Features

Login - Access with existing credentials
Register - Create new user account
View Profile - See user information
Change Password - Update password
View Statistics - See system info

📝 Input Requirements
Username Rules

3-20 characters long
Only letters, numbers, and underscores
Must be unique

Password Rules

6-50 characters long
Any characters allowed

Email Rules

Must contain @ and .
Minimum 5 characters

🧪 Testing
Try these scenarios:
Valid Registration:
Username: johndoe
Password: mypass123
Email: john@email.com
Invalid Registration:
Username: ab (too short)
Password: 123 (too short) 
Email: invalid (no @ or .)
🔧 Features Implemented

✅ User registration with validation
✅ User login/logout
✅ Password change functionality
✅ View user profile
✅ System statistics
✅ Error handling
✅ MVC architecture

🚧 Limitations

Data stored in memory only (resets when app closes)
Passwords stored as plain text
No database connection
Console interface only

🔄 Next Steps to Improve

Add database connectivity (MySQL/PostgreSQL)
Implement password encryption
Create web interface
Add user roles (admin/user)
Include email verification

🐛 Common Issues
Compilation Error:
bash# Make sure all files are created
find src -name "*.java" -type f
Can't Run:
bash# Check if Java is installed
java --version
Input Problems:

Don't use special characters when testing
Make sure console accepts input

📄 License
This project is for educational purposes.
👤 Author
Matheus Vinicius

Email: matheusviniciusdrs5555@gmail.com
LinkedIn: matheus-vinicius


Simple Java project for learning MVC architecture and basic authentication concepts.
