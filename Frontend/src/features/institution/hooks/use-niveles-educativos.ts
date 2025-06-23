import { API_URL } from '../../../config/api-config';
import { useFetchData } from '../../../hooks/use-fetch-data';

export const useNivelesEducativos = () => {
  const { data } = useFetchData<any[]>(`${API_URL}/education/nivel-educativo/`);
  return (
    data?.map((n) => ({
      id: n.id_nivel_educativo.toString(),
      nombre: n.nivel_educativo,
    })) ?? []
  );
};
