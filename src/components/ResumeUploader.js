import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper, Typography, Button, Box, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const ResumeUploader = ({ onParsedData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('resume', file);
      
      try {
        const response = await axios.post('http://localhost:3001/api/parse-resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        onParsedData(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError(error.response?.data?.error || 'Error processing resume');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please upload a PDF file');
    }
  }, [onParsedData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 4,
        backgroundColor: 'white',
        border: '2px dashed #ccc',
        borderRadius: 2,
        cursor: 'pointer'
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" component="div" align="center">
              {isDragActive
                ? "Drop your resume here"
                : "Drag and drop your resume file or click to browse"}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Supported format: PDF
            </Typography>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <Button variant="contained" color="primary">
              Browse Files
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default ResumeUploader; 