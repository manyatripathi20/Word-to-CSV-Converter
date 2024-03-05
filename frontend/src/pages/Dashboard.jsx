// App.js

import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const convertToCSV = async () => {
    setError(null);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://127.0.0.1:5000/', formData);

      const data = response.data;

      if (data.error) {
        setError(data.error);
      } else {
        setPreview(data.preview);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while converting the file.');
    }
  };

  const downloadCSV = () => {
    const blob = new Blob([preview], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'output.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <h1>Word to CSV Converter</h1>

      {error && <p className="error">{error}</p>}

      <input type="file" accept=".docx" onChange={handleFileChange} />

      <button onClick={convertToCSV}>Convert to CSV</button>

      {preview && (
        <>
          <h2>Preview:</h2>
          <pre>{preview}</pre>
          <button onClick={downloadCSV}>Download CSV</button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
