import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import useUpdateApi from '../useUpdateApi';
import useGetServiceTemplates from './useGetServiceTemplates';

export interface ServiceTemplateInterface {
  model_id: string;
  isEdit?: boolean;
  tasks_id: any;
  id?: number;
}

interface ServiceTemplateResponse {
  data: any;
  // Define the expected response properties here
}

const usePostServiceTemplate = (): [
  (data: ServiceTemplateInterface) => Promise<ServiceTemplateResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const [getServicesTemplateList] = useGetServiceTemplates();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [updateApi, {error: updateErrors}] = useUpdateApi();

  useEffect(() => {
    setError(error || updateErrors);
  }, [error, updateErrors]);
  const postServiceTemplate = async (data: ServiceTemplateInterface) => {
    toast.hideAll();
    const reqParams = {
      ...data,
      company_id: userCompany?.company_id?.toString() || null,
    };
    console.log(reqParams, 'TASK PARAMS====');
    const response = data?.isEdit
      ? await updateApi({
          endPoint: END_POINTS.UPDATE_SERVICE_TEMPLATE,
          params: reqParams,
        })
      : await postApi({
          endPoint: END_POINTS.CREATE_SERVICE_TEMPLATE,
          params: reqParams,
        });
    if (response) {
      toast.show(response.message);
      await getServicesTemplateList({isLoader: true});
      return response.message;
    }
  };
  return [postServiceTemplate, {errors}];
};

export default usePostServiceTemplate;
