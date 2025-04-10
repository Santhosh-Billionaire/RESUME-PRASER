import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box } from '@mui/material';
import ResumeUploader from './components/ResumeUploader';
import ParsedData from './components/ParsedData';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [parsedData, setParsedData] = useState(null);

  const handleParsedData = (data) => {
    setParsedData(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Resume Parser</h1>
          <ResumeUploader onParsedData={handleParsedData} />
          {parsedData && <ParsedData data={parsedData} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 