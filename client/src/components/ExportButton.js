import React, { useState } from 'react';
import axios from 'axios';
import './ExportButton.css';

const ExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get('/api/export-users', {
        responseType: 'blob', // Important for handling file download
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BDC.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting donors:', error);
      alert('Failed to export donors');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exporting...' : 'Export Donors to Excel'}
    </button>
  );
};

export default ExportButton;