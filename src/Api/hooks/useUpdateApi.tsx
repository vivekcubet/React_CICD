/* eslint-disable no-catch-shadow */
import {useState} from 'react';
import api from '../Interceptor';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {toggleLoader} from '../../redux/reducers/GlobalReducer';
import {clearUserSession} from '../../utils/helpers/securedStorage';
import useLogoutHook from './useLogoutHook';
import screens from '../../navigation/screens';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
export interface PutData {
  params: any;
  endPoint: string;
  isLoader?: boolean;
  isForm?: boolean;
}

interface PutResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
  response?: any;
}

const useUpdateApi = (): [
  (data: PutData) => Promise<PutResponse>,
  {loading: boolean; error: any | null},
] => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const logOut = useLogoutHook();

  const update = async (data: PutData, retry = false): Promise<PutResponse> => {
    console.log('REACHEDDD====Update', data);
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
        console.log(JSON.stringify(form), 'FORM DATA===');
        response = await api.put<PutResponse>(data.endPoint, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.put<PutResponse>(data.endPoint, data.params);
      }
      dispatch(toggleLoader(false));
      console.log('POST RESPONSE===', response);
      setLoading(false);
      return response.data;
    } catch (error: any) {
      toast.hideAll();
      if (!retry && error.message.includes('Network Error')) {
        return update(data, true);
      } else {
        dispatch(toggleLoader(false));

        setLoading(false);
        if (error.response && error.response.status === 400) {
          toast.show(error.response?.data?.message);
          setError(error.response?.data?.message);
        } else if (error.response && error.response.status === 401) {
          toast.show(error.response?.data?.message);
          await clearUserSession();
          logOut();
          navigation.replace(screens.onBoarding);
        } else if (error.response && error.response.status === 422) {
          toast.show(error.response?.data?.message);
        } else if (error.response && error.response.status === 500) {
          console.log(error.response);
          toast.show('Server error');
        } else {
          toast.show(error.message);
          console.log(error.code, 'ERROR========123PUT');
          setError(error.message);
        }
        throw error;
      }
    }
  };

  return [update, {loading, error}];
};

export default useUpdateApi;
