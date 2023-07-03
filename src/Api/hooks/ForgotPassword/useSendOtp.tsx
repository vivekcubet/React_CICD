import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';
export interface SendOtpInterface {
  email: string;
}

interface SendOTPResponse {
  data: any;
  // Define the expected response properties here
}

const useSendOtp = (): [
  (data: SendOtpInterface) => Promise<SendOTPResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const sendOtp = async (data: SendOtpInterface) => {
    let response = await postApi({
      endPoint: END_POINTS.SEND_OTP,
      params: data,
    });
    if (response) {
      toast.show(response.message);
      return response.message;
    }
  };

  return [sendOtp, {errors}];
};

export default useSendOtp;
