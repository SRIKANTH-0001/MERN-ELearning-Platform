# MERN Full Stack E-Learning Platform

A modern, role-based **E-Learning Platform** developed using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
The platform supports **course management, quizzes, student progress tracking, analytics, and certificate generation**.

---

## 📌 Features

### 👤 User Roles
- **Admin**
  - Manage users
  - Manage courses
  - View platform analytics

- **Instructor**
  - Create courses
  - Upload learning content
  - Create quizzes

- **Student**
  - Enroll in courses
  - Access learning content
  - Attempt quizzes
  - Track progress
  - Download certificates

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- HTML5, CSS3, JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

## 📁 Project Structure

MERN-ELearning-Platform/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── services/
│ └── server.js
│
├── frontend/
│ ├── index.html
│ ├── src/
│ │ ├── api/
│ │ ├── context/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── admin/
│ │ ├── instructor/
│ │ ├── student/
│ │ ├── styles/
│ │ ├── App.jsx
│ │ └── main.jsx
│
└── README.md


<!--Open browser-->
http://localhost:5173

<!--Backend Setup-->
cd Backend
npm install 

<!--Run Backend-->
npm run dev

<!-- Frontend Setup-->
cd frontend
npm install
npm run dev
