import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../../../config/api-config';

export const useCreateInstitucion = () => {
  const [loading, setLoading] = useState(false);

  const create = async (payload: any, onSuccess: () => void) => {
    setLoading(true);
    Swal.fire({
      title: 'Registrando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      await axios.post(`${API_URL}/education/instituciones/create`, payload);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Institución registrada con éxito.',
        confirmButtonColor: '#3085d6',
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al registrar la institución.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
};
