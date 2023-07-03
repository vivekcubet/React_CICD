import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import useGetCompanyList from './useGetCompanyList';
import usePostApi, {PostData} from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';

export interface CompanyInterface {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  id?: string;
  logo?: any;
  isEdit?: string;
  isForm?: boolean;
}

interface EquipmentModelResponse {
  data: any;
  // Define the expected response properties here
}

const useCreateCompany = (): [
  (data: CompanyInterface) => Promise<EquipmentModelResponse | undefined>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [getCompanyList] = useGetCompanyList();
  const [errors, setErrors] = useState<any | null>(null);
  const [postApi] = usePostApi();

  useEffect(() => {
    setErrors(null);
  }, []);

  const createCompany = async (
    data: CompanyInterface,
  ): Promise<EquipmentModelResponse | undefined> => {
    const {isEdit, isForm, ...dataWithoutIsEdit} = data;
    const reqParams = {
      ...dataWithoutIsEdit,
      //   company_id: userCompany?.company_id?.toString() || null,
    };
    console.log(reqParams, 'PARAMS=====', isEdit);
    const postData: PostData = {
      endPoint: data.isEdit
        ? END_POINTS.UPDATE_COMPANY
        : END_POINTS.CREATE_COMPANY,
      params: reqParams,
      isForm: isForm,
    };

    try {
      const response = await postApi(postData);
      await getCompanyList({isLoader: true});
      toast.show(response?.message);
      return response?.data;
    } catch (error: any) {
      console.log(error, 'ERROR===11111', JSON.stringify(error));
      setErrors(error.message);
    }
  };

  return [createCompany, {errors}];
};

export default useCreateCompany;
