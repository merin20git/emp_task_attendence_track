=> Employee Features

Employee login (JWT authentication)
Check-In / Check-Out with automatic time logging
Automatic checkout after 8 hours
View attendance status
View assigned tasks
Start/Stop task timer
Logout

=> Admin Features

Admin login (JWT)
Assign tasks to employees
Create and manage tasks
View all employee attendance
View employees currently checked-in
Logout

=> Security

Passwords encrypted using bcrypt
JWT-based protected authentication
RESTful API architecture

Project Structure

ATTENDENCE_TRACK/
│── attendence_backend/
│   ├── models/
│   ├── app.js
│   ├── package.json
│   ├── .gitignore
│
│── attendence_frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .gitignore
│
│── .gitignore  (root)
│── README.md

API Endpoints (Backend)
=>Authentication
POST /signup
POST /signIn

=>Attendance
POST /checkin
POST /checkout
GET /admin/attendance
GET /admin/attendance/:userId

=>Tasks
POST /createTask
GET /tasks/user/:userId
POST /task/start
POST /task/stop
