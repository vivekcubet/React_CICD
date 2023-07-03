import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {toggleLoader} from '../../../redux/reducers/GlobalReducer';
export interface GetData {
  params?: any;
  endPoint: string;
  isLoader?: boolean;
}

interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useStoreInitialData = (): [(data: GetData) => Promise<GetResponse>] => {
  const toast = useToast();
  const dispatch = useDispatch();

  const get = async (data: GetData): Promise<GetResponse> => {
    const {isLoader = true} = data;
    dispatch(toggleLoader(true));

    try {
    } catch (error: any) {
      if (isLoader) {
        dispatch(toggleLoader(false));
      }
      toast.show(error.message);
      console.log(error, 'ERROR');
      throw error;
    }
  };

  return [get];
};

export default useStoreInitialData;
