import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputBase,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';

const ParsedData = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [parsedHistory, setParsedHistory] = useState([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('resumeParseHistory');
    if (savedHistory) {
      setParsedHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Update history when new data comes in
  useEffect(() => {
    if (data) {
      const newHistory = [...parsedHistory];
      // Add new data only if it's different from the last entry
      if (newHistory.length === 0 || 
          JSON.stringify(newHistory[0].data) !== JSON.stringify(data)) {
        newHistory.unshift({
          data,
          timestamp: new Date().toISOString()
        });
        setParsedHistory(newHistory);
        localStorage.setItem('resumeParseHistory', JSON.stringify(newHistory));
      }
    }
  }, [data]);

  const handleExport = () => {
    const exportData = JSON.stringify(parsedHistory, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-parse-history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearHistory = () => {
    setParsedHistory([]);
    localStorage.removeItem('resumeParseHistory');
  };

  const filteredHistory = parsedHistory.filter(entry =>
    Object.values(entry.data).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Parsed Resume Data
        </Typography>
        <Box>
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            onClick={handleExport}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            startIcon={<PrintIcon />}
            variant="outlined"
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={handleClearHistory}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Paper>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Education</TableCell>
              <TableCell>Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.map((entry, index) => (
              <TableRow
                key={entry.timestamp}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: index === 0 ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                }}
              >
                <TableCell>{entry.data.name}</TableCell>
                <TableCell>{entry.data.experience}</TableCell>
                <TableCell>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {entry.data.projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {entry.data.skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        sx={{
                          backgroundColor: getSkillColor(skill),
                          color: getSkillColor(skill) === '#FFF9C4' ? 'black' : 'white'
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {Array.isArray(entry.data.education) 
                      ? entry.data.education.join('\n') 
                      : entry.data.education}
                  </Typography>
                </TableCell>
                <TableCell style={{ whiteSpace: 'pre-line' }}>
                  {`${entry.data.email}\n${entry.data.contact}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// Function to get color for skill chips
const getSkillColor = (skill) => {
  const colorMap = {
    'React': '#61DAFB',
    'Node.js': '#68A063',
    'Python': '#3776AB',
    'JavaScript': '#FFF9C4',
    'AWS': '#FF9900',
    'SQL': '#00758F',
    'Java': '#007396',
    'HTML': '#E34F26',
    'CSS': '#1572B6',
    'Git': '#F05032',
    'GitHub': '#181717'
  };
  
  return colorMap[skill] || '#757575'; // Default gray color for unknown skills
};

export default ParsedData; 