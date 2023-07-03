import api from '../Interceptor';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {toggleLoader} from '../../redux/reducers/GlobalReducer';
import useLogoutHook from './useLogoutHook';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {clearUserSession} from '../../utils/helpers/securedStorage';
import screens from '../../navigation/screens';
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
  companies?: any;
}

const useGetApi = (): [(data: GetData) => Promise<GetResponse>] => {
  const toast = useToast();
  const dispatch = useDispatch();
  const logOut = useLogoutHook();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const get = async (data: GetData): Promise<GetResponse> => {
    const {isLoader = true} = data;
    dispatch(toggleLoader(true));

    try {
      const response = await api.get<GetResponse>(data.endPoint, {
        params: data.params,
      });
      if (isLoader) {
        dispatch(toggleLoader(false));
      }
      console.log('GET RESPONSE====', response);
      return response.data;
    } catch (error: any) {
      toast.hideAll();
      // if (isLoader) {
      dispatch(toggleLoader(false));
      // }
      if (error.response && error.response.status === 400) {
        console.log(error.response);
        toast.show(error.response?.data?.message);
      } else if (error.response && error.response.status === 401) {
        console.log(error.response);
        toast.show(error.response?.data?.message);
        await clearUserSession();
        logOut();
        navigation.replace(screens.onBoarding);
      } else if (error.response && error.response.status === 422) {
        console.log(error.response);
        toast.show(error.response?.data?.message);
      } else if (error.response && error.response.status === 429) {
        console.log(error.response);
      } else if (error.response && error.response.status === 500) {
        console.log(error.response);
        toast.show('Server error');
      } else {
        toast.show(error.message);
        console.log(error, 'ERROR========123==GET');
      }
      throw error;
    }
  };

  return [get];
};

export default useGetApi;
