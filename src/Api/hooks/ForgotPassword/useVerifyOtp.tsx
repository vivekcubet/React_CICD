import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';
export interface VerifyOtpInterface {
  email: string;
  otp: string;
}

interface SendOTPResponse {
  token?: any;
  data?: any;
  response: any;
  // Define the expected response properties here
}

const useVerifyOtp = (): [
  (data: VerifyOtpInterface) => Promise<SendOTPResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const verifyOtp = async (data: VerifyOtpInterface) => {
    let response = await postApi({
      endPoint: END_POINTS.VERIFY_OTP,
      params: data,
    });
    if (response) {
      toast.show(response.message);
      return response.data;
    }
  };

  return [verifyOtp, {errors}];
};

export default useVerifyOtp;
