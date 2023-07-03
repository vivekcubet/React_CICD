import {useState} from 'react';
import api from '../Interceptor';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {toggleLoader} from '../../redux/reducers/GlobalReducer';
export interface ArchiveData {
  params: any;
  endPoint: string;
  isLoader?: boolean;
}

interface ArchiveResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
  response?: any;
}

const useArchiveApi = (): [
  (data: ArchiveData) => Promise<ArchiveResponse>,
  {loading: boolean; error: any | null},
] => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const archiveData = async (data: ArchiveData): Promise<ArchiveResponse> => {
    toast.hideAll();
    dispatch(toggleLoader(true));
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete<ArchiveResponse>(
        data.endPoint,
        data.params,
      );
      dispatch(toggleLoader(false));
      console.log(data.params, 'Delete RESPONSE===', response);
      setLoading(false);
      return response.data;
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error: any) {
      console.log(error, 'TEST+++++++++++++++', data.params);
      dispatch(toggleLoader(false));

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

  return [archiveData, {loading, error}];
};

export default useArchiveApi;
