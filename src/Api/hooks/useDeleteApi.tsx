import {useState} from 'react';
import api from '../Interceptor';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {toggleLoader} from '../../redux/reducers/GlobalReducer';
export interface DeleteData {
  params: any;
  endPoint: string;
  isLoader?: boolean;
}

interface DeleteResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
  response?: any;
}

const useDeleteApi = (): [
  (data: DeleteData) => Promise<DeleteResponse>,
  {loading: boolean; error: any | null},
] => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const deleteData = async (data: DeleteData): Promise<DeleteResponse> => {
    await toast.hideAll();
    dispatch(toggleLoader(true));
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete<DeleteResponse>(
        data.endPoint,
        data.params,
      );
      dispatch(toggleLoader(false));
      console.log('Delete RESPONSE===', response);
      setLoading(false);
      return response.data;
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error: any) {
      dispatch(toggleLoader(false));
      console.log(error, 'Delete Error');
      setLoading(false);
      if (error.response && error.response.status === 400) {
        toast.show(error.response?.data?.message);
        setError(error.response?.data?.message);
      } else if (error.response && error.response.status === 401) {
        toast.show(error.response?.data?.message);
      } else {
        toast.show(error.message);
        setError(error.message);
      }
      throw error;
    }
  };

  return [deleteData, {loading, error}];
};

export default useDeleteApi;
