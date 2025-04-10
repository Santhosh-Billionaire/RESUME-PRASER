# Resume Parser

A modern web application that parses resumes in PDF and DOCX formats to extract structured information. Built with React, Material-UI, and Node.js.

## Features

- Drag and drop interface for file upload
- Support for PDF and DOCX files
- Extracts key information:
  - Personal details (name, contact, email)
  - Skills
  - Education
  - Experience
  - Certificates
  - Achievements
- Modern, responsive UI
- Export parsed data as JSON
- Print functionality

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node index.js
```

The backend API will be available at http://localhost:3001

## API Endpoints

### POST /api/parse-resume

Accepts a multipart form data with a file field named 'resume'. Returns parsed resume data in JSON format.

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - react-dropzone
  - axios
- Backend:
  - Express.js
  - multer
  - PyMuPDF (fitz)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. "# RESUME-PRASER" 
