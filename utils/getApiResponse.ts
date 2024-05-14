import axios from 'axios';
import { toast } from 'sonner';

export const getApiResponse = async (
  data: string,
  setIsLoading: (value: boolean) => void,
) => {
  setIsLoading(true);

  try {
    const response = await axios.post(`/api/ai`, { data: data });
    return response.data;
  } catch (error) {
    console.log(error);
    toast.warning('Błąd odpowiedzi');
  } finally {
    setIsLoading(false);
  }
};
