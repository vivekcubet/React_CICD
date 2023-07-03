import {useEffect, useState} from 'react';
import {END_POINTS} from '../constants';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import usePostApi from './usePostApi';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../navigation/screens';
import {useToast} from 'react-native-toast-notifications';
export interface SignUpInterface {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
  company: string;
  role_id: string;
}

interface SignupResponse {
  data: any;
  // Define the expected response properties here
}

const useSignUp = (): [
  (data: SignUpInterface) => Promise<SignupResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const signUp = async (data: SignUpInterface) => {
    console.log(JSON.stringify(data), 'PARAMS==== SIGN_UP');
    const response = await postApi({
      endPoint: END_POINTS.REGISTER,
      params: data,
    });
    if (response) {
      console.log(response, 'SIGN UP RESPONSE', 'RESPONSE===');
      toast.show(response?.message);
      navigation.navigate(screens.login);
      return response.results;
    }
  };

  return [signUp, {errors}];
};

export default useSignUp;
