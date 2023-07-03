import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi, {PostData} from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';

export interface CompanyInterface {
  name: string;
  email: string;
  address: string;
  phone: string;
  id?: string;
  logo?: any;
  isEdit?: string;
  role_id: string;
  endUrl?: string;
  isForm?: boolean;
}

interface UpdateUserResponse {
  data: any;
  response: any;
  // Define the expected response properties here
}

const useCreateUser = (): [
  (data: CompanyInterface) => Promise<UpdateUserResponse | undefined>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setErrors] = useState<any | null>(null);
  const [postApi] = usePostApi();

  useEffect(() => {
    setErrors(errors);
  }, [errors]);

  const createUser = async (
    data: CompanyInterface,
  ): Promise<UpdateUserResponse | undefined> => {
    const {isEdit, isForm = false, endUrl, ...dataWithoutIsEdit} = data;
    const reqParams = {
      ...dataWithoutIsEdit,
      //   company_id: userCompany?.company_id?.toString() || null,
    };
    console.log(reqParams, 'PARAMS=====', isEdit, endUrl);
    let url = data.isEdit ? END_POINTS.UPDATE_USER : END_POINTS.CREATE_USER;
    const postData: PostData = {
      endPoint: data.endUrl ? data.endUrl : url,
      params: reqParams,
      isForm: isForm,
    };

    try {
      console.log(JSON.stringify(postData), 'USER DATA===');
      const response = await postApi(postData);
      if (response) {
        toast.show(response?.message);
        return response.message;
      }
    } catch (error: any) {
      console.log(error, 'ERROR===');
      setErrors(error.message);
    }
  };

  return [createUser, {errors}];
};

export default useCreateUser;
