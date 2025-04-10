const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const path = require('path');
const pool = require('./db');  

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Utility functions
const extractText = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw error;
    }
};

const extractName = (text) => {
    const lines = text.split('\n');
    for (const line of lines) {
        if (line.trim().length > 3 && !/^[0-9@]/.test(line) && !line.includes('@')) {
            return line.trim();
        }
    }
    return "Name not found";
};

const extractContactInfo = (text) => {
    const phone = text.match(/\b(?:\+\d{1,2}[-\s]?)?\d{10}\b/);
    const email = text.match(/[\w\.-]+@[\w\.-]+/);
    return {
        phone: phone ? phone[0] : "Phone not found",
        email: email ? email[0] : "Email not found"
    };
};

const extractSkills = (text) => {
    const skillKeywords = {
        'python': 'Python',
        'java': 'Java',
        'c\\+\\+': 'C++',
        'c#': 'C#',
        'javascript': 'JavaScript',
        'html': 'HTML',
        'css': 'CSS',
        'sql': 'SQL',
        'r': 'R',
        'go': 'Go',
        'aws': 'AWS',
        'azure': 'Azure',
        'gcp': 'GCP',
        'docker': 'Docker',
        'kubernetes': 'Kubernetes',
        'linux': 'Linux',
        'git': 'Git',
        'github': 'GitHub',
        'tensorflow': 'TensorFlow',
        'pytorch': 'PyTorch',
        'opencv': 'OpenCV',
        'react': 'React',
        'node.js': 'Node.js',
        'express': 'Express',
        'mongodb': 'MongoDB',
        'postgresql': 'PostgreSQL',
        'mysql': 'MySQL',
        'power bi': 'Power BI',
        'excel': 'Excel',
        'machine learning': 'Machine Learning',
        'artificial intelligence': 'AI',
        'data science': 'Data Science',
        'data analytics': 'Data Analytics',
        'cnn': 'CNN',
        'lstm': 'LSTM',
        'neural networks': 'Neural Networks'
    };
    
    const skills = new Set();
    
    // First try exact matches
    for (const [pattern, skill] of Object.entries(skillKeywords)) {
        try {
            const regex = new RegExp(`\\b${pattern}\\b`, 'i');
            if (regex.test(text)) {
                skills.add(skill);
            }
        } catch (error) {
            console.error(`Error with regex for skill ${skill}:`, error);
        }
    }

    // Look for skills in Programming/Skills section
    const lines = text.split('\n');
    let inSkillsSection = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes('skills') || line.includes('programming') || line.includes('technical skills')) {
            inSkillsSection = true;
            continue;
        }
        if (inSkillsSection && line.trim() === '') {
            inSkillsSection = false;
            continue;
        }
        if (inSkillsSection) {
            const skillsList = line.split(/[,:]/).map(s => s.trim());
            for (const skill of skillsList) {
                if (skill) {
                    const matchedSkill = Object.entries(skillKeywords).find(([pattern]) => 
                        new RegExp(`\\b${pattern}\\b`, 'i').test(skill)
                    );
                    if (matchedSkill) {
                        skills.add(matchedSkill[1]);
                    }
                }
            }
        }
    }
    
    return Array.from(skills);
};

const extractEducation = (text) => {
    const lines = text.split('\n');
    const educationEntries = [];
    let inEducationSection = false;
    let currentEntry = {
        institution: '',
        degree: '',
        grade: '',
        year: ''
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();

        // Start of education section
        if (lowerLine === 'education' || lowerLine.includes('educational')) {
            inEducationSection = true;
            continue;
        }

        // End of education section
        if (inEducationSection && 
            (line === '' || /^(experience|skills|projects|certifications|internship)/i.test(line))) {
            if (currentEntry.institution) {
                educationEntries.push(formatEducationEntry(currentEntry));
                currentEntry = {
                    institution: '',
                    degree: '',
                    grade: '',
                    year: ''
                };
            }
            if (/^(experience|skills|projects|certifications|internship)/i.test(line)) {
                inEducationSection = false;
            }
            continue;
        }

        if (inEducationSection && line) {
            // Match institution names
            if (/(university|institute|college|school)/i.test(line) && !currentEntry.institution) {
                currentEntry.institution = line;
            }
            // Match degree information
            else if (/\b(b\.?tech|b\.?e|m\.?tech|m\.?e|b\.?sc|m\.?sc|phd|bachelor|master)/i.test(line)) {
                currentEntry.degree = line;
            }
            // Match grade/CGPA information
            else if (/\b(cgpa|percentage|grade|score)[:.]?\s*([-–]?\s*\d+\.?\d*)/i.test(line)) {
                const gradeMatch = line.match(/\b(cgpa|percentage|grade|score)[:.]?\s*([-–]?\s*\d+\.?\d*)/i);
                currentEntry.grade = `${gradeMatch[1]}: ${gradeMatch[2]}`;
            }
            // Match year information
            else if (/\b20\d{2}\b/.test(line)) {
                currentEntry.year = line;
            }

            // If we have all information or hit a blank line, save the entry
            if ((currentEntry.institution && currentEntry.degree) || 
                (i + 1 < lines.length && lines[i + 1].trim() === '')) {
                if (currentEntry.institution) {
                    educationEntries.push(formatEducationEntry(currentEntry));
                    currentEntry = {
                        institution: '',
                        degree: '',
                        grade: '',
                        year: ''
                    };
                }
            }
        }
    }

    // Add any remaining entry
    if (currentEntry.institution) {
        educationEntries.push(formatEducationEntry(currentEntry));
    }

    return educationEntries.length ? educationEntries : ["Education not found"];
};

const formatEducationEntry = (entry) => {
    const parts = [];
    if (entry.institution) parts.push(entry.institution);
    if (entry.degree) parts.push(entry.degree);
    if (entry.grade) parts.push(entry.grade);
    if (entry.year) parts.push(entry.year);
    return parts.join(' | ');
};

const extractExperience = (text) => {
    const lines = text.split('\n');
    const experiences = [];
    let inExperienceSection = false;
    let currentExperience = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        const lowerLine = trimmedLine.toLowerCase();

        // Start of experience/internship section
        if (lowerLine === 'experience' || lowerLine === 'internship' || 
            lowerLine.includes('work experience') || lowerLine.includes('professional experience')) {
            inExperienceSection = true;
            continue;
        }

        // End of experience section
        if (inExperienceSection && 
            (trimmedLine === '' || /^(education|skills|projects|certifications)/i.test(trimmedLine))) {
            if (currentExperience.length > 0) {
                experiences.push(currentExperience.join('\n'));
                currentExperience = [];
            }
            if (/^(education|skills|projects|certifications)/i.test(trimmedLine)) {
                inExperienceSection = false;
            }
            continue;
        }

        if (inExperienceSection && trimmedLine) {
            // Remove bullet points and other markers
            const cleanedLine = trimmedLine
                .replace(/^[-•*]\s*/, '')
                .replace(/^[0-9]+\.\s*/, '')
                .trim();
            
            if (cleanedLine.length > 0) {
                currentExperience.push(cleanedLine);
            }
        }
    }

    // Add any remaining experience
    if (currentExperience.length > 0) {
        experiences.push(currentExperience.join('\n'));
    }

    return experiences.length ? experiences : ["No experience found"];
};

const extractProjects = (text) => {
    const projectKeywords = ['project:', 'projects', 'developed', 'created', 'built', 'implemented'];
    const matches = [];
    const lines = text.split('\n');
    let inProjectSection = false;
    let currentProject = [];
    
    for (const line of lines) {
        const lowerLine = line.toLowerCase().trim();

        // Check if we're entering projects section
        if (lowerLine === 'projects' || lowerLine.startsWith('project')) {
            inProjectSection = true;
            continue;
        }

        // Exit projects section if we hit another major section
        if (inProjectSection && /^(experience|skills|education|certifications|internship)/i.test(lowerLine)) {
            inProjectSection = false;
            if (currentProject.length > 0) {
                matches.push(currentProject.join(' '));
                currentProject = [];
            }
            continue;
        }

        if (inProjectSection) {
            if (line.trim() === '' && currentProject.length > 0) {
                matches.push(currentProject.join(' '));
                currentProject = [];
            } else if (line.trim() !== '') {
                // Remove bullet points and other markers
                const cleanedLine = line.trim()
                    .replace(/^[-•*]\s*/, '')
                    .replace(/^[0-9]+\.\s*/, '')
                    .trim();
                if (cleanedLine.length > 0) {
                    currentProject.push(cleanedLine);
                }
            }
        }
    }

    // Add any remaining project
    if (currentProject.length > 0) {
        matches.push(currentProject.join(' '));
    }

    return matches.length ? matches : ["No projects found"];
};

// API Endpoint
app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Only PDF files are supported' });
        }

        const text = await extractText(req.file.buffer);
        const name = extractName(text);
        const contactInfo = extractContactInfo(text);
        const skills = extractSkills(text);
        const education = extractEducation(text);
        const experience = extractExperience(text);
        const projects = extractProjects(text);

        // 👇 Insert into PostgreSQL database
        await pool.query(
            `INSERT INTO resumes 
            (name, phone, email, skills, education, experience, projects, contact_info, total_experience, achievements, certificates, languages, educational)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '', '', '', '', '')`,
            [
                name || '',
                contactInfo?.phone || '',
                contactInfo?.email || '',
                JSON.stringify(skills || []),
                JSON.stringify(education || []),
                JSON.stringify(experience || []),
                JSON.stringify(projects || []),
                JSON.stringify(contactInfo || {}),
            ]
        );
        

        res.json({
            name,
            contact: contactInfo.phone,
            email: contactInfo.email,
            skills,
            education,
            experience,
            projects,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error parsing resume:', error);
        res.status(500).json({ error: 'Error parsing resume' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 