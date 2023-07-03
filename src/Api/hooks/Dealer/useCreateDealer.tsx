import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi, {PostData} from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';

export interface DealerInterface {
  name: string;
  company_name?: string;
  dealer_owner_name: string;
  email: string;
  address: string;
  phone_number: string;
  id?: string;
  logo?: any;
  isEdit?: string;
  isForm?: boolean;
}

interface DealerResponse {
  data: any;
  // Define the expected response properties here
}

const useCreateDealer = (): [
  (data: DealerInterface) => Promise<DealerResponse | undefined>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setErrors] = useState<any | null>(null);
  const [postApi] = usePostApi();

  useEffect(() => {
    setErrors(null);
  }, []);

  const createDealer = async (
    data: DealerInterface,
  ): Promise<DealerResponse | undefined> => {
    const {isEdit, isForm, ...dataWithoutIsEdit} = data;
    const reqParams = {
      ...dataWithoutIsEdit,
      //   company_id: userCompany?.company_id?.toString() || null,
    };
    console.log(data?.isForm, 'ISFRORMMMMMMMM');
    const postData: PostData = {
      endPoint: isEdit ? END_POINTS.UPDATE_DEALER : END_POINTS.CREATE_DEALER,
      params: reqParams,
      isForm: isForm,
    };

    try {
      const response = await postApi(postData);
      toast.show(response?.message);
      return response?.data;
    } catch (error: any) {
      console.log(error, 'ERROR===');
      setErrors(error.message);
    }
  };

  return [createDealer, {errors}];
};

export default useCreateDealer;
