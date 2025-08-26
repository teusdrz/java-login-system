Java Login System
This is a simple user authentication and registration system developed in Java. The application is built following the Model-View-Controller (MVC) architectural pattern and uses the command line for user interaction.

Project Structure
The project is organized using the standard Java project directory structure, which simplifies compilation and execution.

.
├── out/                        # Directory for compiled files (.class)
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── loginapp/
│                   ├── controller/     # Controller layer (business logic)
│                   │   └── AuthController.java
│                   ├── model/          # Model layer (data and domain logic)
│                   │   ├── User.java
│                   │   └── UserDatabase.java
│                   ├── view/           # View layer (user interface)
│                   │   └── ConsoleView.java
│                   └── Main.java       # Application entry point
└── README.md

How to Compile and Run
This project does not use a build automation tool like Maven or Gradle. Compilation and execution are handled directly via the command line.

1. Compilation
Navigate to the project's root directory (java-login-system) and use the javac compiler to compile all source files.

javac -d out -sourcepath src src/main/java/com/loginapp/*.java src/main/java/com/loginapp/controller/*.java src/main/java/com/loginapp/model/*.java src/main/java/com/loginapp/view/*.java

This command compiles all .java files in the loginapp, controller, model, and view packages and places the compiled bytecode (.class) in the out directory.

2. Execution
After compilation, run the application using the java command and specifying the classpath to your out directory.

java -cp out com.loginapp.Main

Features
The application provides the following functionalities through its main menu:

Login: Authenticates an existing user.

Register: Creates a new user with validation checks for credentials (username, password, and email).

View Statistics: Displays the total number of registered users and recent login history.

Exit: Closes the application.

The system also includes a user dashboard with options to view profile, change password, and logout.

Author
Matheus Vinicius
