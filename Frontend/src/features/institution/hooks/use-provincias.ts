import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config/api-config';

export const useProvincias = (departamentoId: string) => {
  const [provincias, setProvincias] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    const fetchProvincias = async () => {
      if (!departamentoId) return setProvincias([]);
      try {
        const res = await axios.get(
          `${API_URL}/education/departamentos/${departamentoId}/provincias/`
        );
        setProvincias(
          res.data.map((p: any) => ({
            id: p.id_provincia.toString(),
            nombre: p.nombre_provincia,
          }))
        );
      } catch (err) {
        console.error('Error al cargar provincias', err);
        setProvincias([]);
      }
    };

    fetchProvincias();
  }, [departamentoId]);

  return provincias;
};
