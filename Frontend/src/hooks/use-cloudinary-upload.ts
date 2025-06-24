import { useState } from 'react';

interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  duration?: number;
  [key: string]: any;
}

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<CloudinaryUploadResponse | null> => {
    const cloudName = 'detfpihbr'; // También puedes usar import.meta.env
    const uploadPreset = 'pystart_cloudinary';

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      setUploading(true);
      setError(null);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        setError(data.error?.message || 'Upload failed');
        return null;
      }
    } catch (err) {
      setError('Error al subir el archivo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
}
