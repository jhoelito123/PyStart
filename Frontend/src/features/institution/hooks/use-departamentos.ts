import { API_URL } from '../../../config/api-config';
import { useFetchData } from '../../../hooks/use-fetch-data';

export const useDepartamentos = () => {
  const { data } = useFetchData<any[]>(`${API_URL}/education/departamentos`);
  return (
    data?.map((d) => ({
      id: d.id_departamento.toString(),
      nombre: d.nombre_departamento,
    })) ?? []
  );
};
