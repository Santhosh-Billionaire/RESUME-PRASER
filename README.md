
# 🧠 Resume Parser

A modern full-stack web application that parses resumes (PDF & DOCX) and extracts structured data using AI.  
Built with **React**, **Material-UI**, and **Node.js**, this tool helps convert resumes into clean JSON outputs with support for **PostgreSQL** and **Python-based processing**.

---

## 🚀 Features

- 🖱️ Drag & Drop Resume Upload
- 📄 Supports PDF and DOCX formats
- 🔍 Extracts:
  - Personal Info (Name, Email, Phone)
  - Skills & Technologies
  - Education & Degrees
  - Work Experience
  - Projects
  - Achievements & Certificates
- 📤 Exports parsed data as JSON
- 🖨️ Option to print parsed content
- 🌐 Fully responsive modern UI

---

## 📁 Project Structure

```plaintext
resume/
├── src/           # React frontend
├── public/        # HTML & static assets
├── server/        # Node.js + Python backend
├── .env           # Environment variables (excluded from Git)
├── README.md
```

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js v14+
- npm or yarn
- Python 3.10+
- PostgreSQL installed and running

---

### 🌐 Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start frontend dev server
npm start
```

Frontend runs at: `http://localhost:3000`

---

### 🛠️ Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Start backend server
node index.js
```

Backend runs at: `http://localhost:3001`

---

### 🐘 PostgreSQL Setup

Ensure your `.env` file includes:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_db
DB_USER=postgres
DB_PASS=your_password
```

Make sure to create the database (`resume_db`) in PostgreSQL before running the backend.

---

## 📡 API Endpoints

### `POST /api/parse-resume`

- Accepts: `multipart/form-data`
- Field: `resume` (the file)
- Response: Extracted resume details in JSON format

```json
{
  "name": "John Doe",
  "contact_info": {
    "email": "john@example.com",
    "phone": "+1234567890",
    ...
  },
  "skills": ["Python", "React", "Node.js"],
  "experience": [...],
  "education": [...],
  "certificates": [...],
  "achievements": [...]
}
```

---

## 🛠 Tech Stack

### Frontend
- React
- Material-UI
- Axios
- react-dropzone

### Backend
- Express.js
- Multer (for file upload)
- PyMuPDF / python-docx (PDF/DOCX parsing)
- PostgreSQL + Sequelize ORM

---

## 📦 Deployment Notes

- Environment variables go in `.env` (NEVER push this to GitHub)
- Add `.env`, `node_modules/`, `venv/` to `.gitignore`
- Run Sequelize migrations if using models

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork this repo, submit a PR, or open an issue.

---

## 📃 License

This project is licensed under the MIT License.  
Feel free to use it for personal or commercial projects.

---

## 🌟 Show Your Support

If you find this project useful, leave a ⭐ on the repo or share it!

---

> Made with ❤️ by Santhosh
```

THANK YOU FOR YOUR SUPPORT AND CONTRIBUTION 
