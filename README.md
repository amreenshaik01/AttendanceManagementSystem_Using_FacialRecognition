# 📷 Attendance Management System using Face Recognition

Welcome to the **Face Recognition-based Attendance Management System** — a modern, AI-powered solution to mark and manage employee attendance accurately and effortlessly. Built using **React.js + Flask**, it ensures smooth interaction between frontend and backend with real-time facial recognition.

---

## 🚀 Features

### 👩‍💼 Admin
- 🔐 Secure login
- 👨‍💼 Register new employees
- 📸 Capture face data via webcam
- 🧠 Train face recognition model
- 📅 View attendance reports by date or employee
- 📤 Export reports to CSV

### 👩‍💻 Employee
- 🔐 Secure login
- 🕘 Mark Time In / 🕔 Time Out using face recognition
- 📈 View attendance history

---

## 🛠️ Tech Stack

| 💻 Frontend | ⚙️ Backend | 🧠 ML/AI | 🗄️ Database |
|-------------|-------------|-----------|-------------|
| React.js + TailwindCSS | Flask (Python) | face_recognition, OpenCV | SQLite |

---

## 🖥️ Setup Instructions

### 1️⃣ Clone the Repository

git clone https://github.com/YalagadaDurga/Attendance-Management-System-using-FR.git
cd Attendance-Management-System-using-FR

### 2️⃣ Frontend Setup (React)

cd frontend
npm install
npm start

🌐 Runs at: http://localhost:3000

### 3️⃣ Backend Setup (Flask)

cd backend
python -m venv venv
venv\Scripts\activate  # (use source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
python app.py

🛠️ Backend API running at: http://localhost:5000

### 4️⃣ Train the Face Recognition Model

python train.py

🔁 This processes face images from /dataset/ folder and generates encodings.

### 🗂️ Folder Structure for Face Data

```
dataset/
├── YalagadaDurga/
│   ├── img1.jpg
│   ├── img2.jpg
├── Madhavi/
│   ├── img1.jpg
│   └── img2.jpg
```
📸 Each folder is named after the employee and contains multiple face images captured via webcam.


### ⚠️ Note
To run this project successfully, you must manually download the following essential file:

shape_predictor_68_face_landmarks.dat
📦 Download Here

⬇ Place it in:
venv/Lib/site-packages/face_recognition_models/models/


### 📊 Reporting Dashboard
📆 View employee-wise or date-wise records

📈 Visual charts for weekly/monthly attendance

📂 Export attendance as .CSV file


### 🎯 Goals & Scope
✅ Accurate face-based attendance

✅ User-friendly UI for Admin & Employee

✅ Easily deployable for educational or office use
