import axios from 'axios';

export const api = axios.create({
  baseURL: '', 
});

export const uploadPlanilha = async (file: File, dataVoalle?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (dataVoalle) {
    formData.append('data_voalle', dataVoalle);
  }

  const response = await api.post('/ingestion/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
