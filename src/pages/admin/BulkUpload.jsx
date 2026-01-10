import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { bulkUploadService } from '../../services/bulkUploadService';

const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx')) {
        alert('Please select a .xlsx file');
        return;
      }
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await bulkUploadService.downloadTemplate();
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const response = await bulkUploadService.uploadProducts(selectedFile);
      setResult(response);
      setSelectedFile(null);
      // Reset file input
      document.getElementById('file-upload').value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Bulk Product Upload</h2>
        <p className="text-gray-600">Upload multiple products at once using an Excel file</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          How to Use Bulk Upload
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-900">
          <li>Download the Excel template using the button below</li>
          <li>Fill in your product data following the template format</li>
          <li>Make sure categories and brands already exist in the system</li>
          <li>Upload the completed Excel file</li>
          <li>Review the upload results</li>
        </ol>
      </div>

      {/* Template Download */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="font-bold mb-4">Step 1: Download Template</h3>
        <button
          onClick={handleDownloadTemplate}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          Download Excel Template
        </button>
        <p className="text-sm text-gray-500 mt-2">
          The template includes sample data and required column headers
        </p>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="font-bold mb-4">Step 2: Upload Filled Template</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileSpreadsheet className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          
          <input
            id="file-upload"
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-pink-600 hover:text-pink-700 font-medium"
          >
            Choose Excel File (.xlsx)
          </label>
          
          {selectedFile && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">
                Selected: {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="mt-4 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-5 w-5" />
          {uploading ? 'Uploading...' : 'Upload Products'}
        </button>
      </div>

      {/* Upload Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold mb-4">Upload Results</h3>
          
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Rows</p>
              <p className="text-2xl font-bold text-blue-900">{result.totalRows}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Successful</p>
              <p className="text-2xl font-bold text-green-900">{result.successCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Failed</p>
              <p className="text-2xl font-bold text-red-900">{result.errorCount}</p>
            </div>
          </div>

          {/* Success Messages */}
          {result.success && result.success.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Successful Uploads ({result.successCount})
              </h4>
              <div className="bg-green-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                {result.success.map((msg, index) => (
                  <p key={index} className="text-sm text-green-800 py-1">
                    ✓ {msg}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Error Messages */}
          {result.errors && result.errors.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Errors ({result.errorCount})
              </h4>
              <div className="bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-800 py-1">
                    ✗ {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;