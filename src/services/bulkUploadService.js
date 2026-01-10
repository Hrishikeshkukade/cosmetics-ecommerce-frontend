import api from './api';

export const bulkUploadService = {
  // Upload products via Excel
  uploadProducts: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/admin/bulk-upload/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download Excel template
  downloadTemplate: async () => {
    const response = await api.get('/admin/bulk-upload/template', {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'product_upload_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};