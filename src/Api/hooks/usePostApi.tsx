import {useState} from 'react';
import api from '../Interceptor';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {toggleLoader} from '../../redux/reducers/GlobalReducer';
import useLogoutHook from './useLogoutHook';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {clearUserSession} from '../../utils/helpers/securedStorage';
import screens from '../../navigation/screens';

export interface PostData {
  params: any;
  endPoint: string;
  isLoader?: boolean;
  isForm?: boolean;
}

interface PostResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
  response?: any;
  code?: any;
}

const usePostApi = (): [
  (data: PostData) => Promise<PostResponse>,
  {loading: boolean; error: any | null},
] => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const logOut = useLogoutHook();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const post = async (data: PostData, retry = false): Promise<PostResponse> => {
    console.log('REACHEDDD====11111', data);
    // toast.hideAll();
    dispatch(toggleLoader(true));
    setLoading(true);
    setError(null);

    try {
      let response = null;
      if (data?.isForm) {
        const form = new FormData();
        for (const key in data.params) {
          form.append(key, data.params[key]);
        }
        console.log(JSON.stringify(form), 'FORM DATA=====');
        response = await api.post<PostResponse>(data.endPoint, form, {
          headers: {
            'content-type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post<PostResponse>(data.endPoint, data.params);
      }

      dispatch(toggleLoader(false));
      console.log('POST RESPONSE===', response);
      setLoading(false);
      return response.data;
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error: any) {
      toast.hideAll();
      console.log(error, 'ERROR TEST', error.message.includes('Network Error'));
      if (!retry && error.message.includes('Network Error')) {
        return post(data, true);
      } else {
        dispatch(toggleLoader(false));

        setLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(error.response);
          toast.show(error.response?.data?.message);
          setError(error.response?.data?.message);
        } else if (error.response && error.response.status === 401) {
          console.log(error.response);
          toast.show(error.response?.data?.message);
          setError(error.response?.data?.message);
          await clearUserSession();
          logOut();
          navigation.replace(screens.onBoarding);
        } else if (error.response && error.response.status === 422) {
          console.log(error.response);
          toast.show(error.response?.data?.message);
          setError(error.response?.data?.message);
        } else if (error.response && error.response.status === 429) {
          console.log(error.response);
        } else if (error.response && error.response.status === 500) {
          console.log(error.response);
          toast.show('Server error');
        } else {
          toast.show(error?.message);
          setError(error?.message);
        }
        throw error;
      }
    }
  };

  return [post, {loading, error}];
};

export default usePostApi;
