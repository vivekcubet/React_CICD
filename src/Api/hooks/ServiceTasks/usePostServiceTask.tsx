import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import useUpdateApi from '../useUpdateApi';
import useGetServiceTasks from './useGetServiceTasks';

export interface ServiceTaskInterface {
  model_id: string;
  isEdit?: boolean;
  interval_id: any;
  parts_id: any;
  quantity: any;
  id?: number;
}

interface ServiceTaskResponse {
  data: any;
  // Define the expected response properties here
}

const usePostServiceTask = (): [
  (data: ServiceTaskInterface) => Promise<ServiceTaskResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const [getTaskList] = useGetServiceTasks();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [updateApi, {error: updateErrors}] = useUpdateApi();

  useEffect(() => {
    setError(error || updateErrors);
  }, [error, updateErrors]);
  const postServiceTask = async (data: ServiceTaskInterface) => {
    const reqParams = {
      ...data,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = data?.isEdit
      ? await updateApi({
          endPoint: END_POINTS.UPDATE_SERVICE_TASK,
          params: reqParams,
        })
      : await postApi({
          endPoint: END_POINTS.CREATE_SERVICE_TASK,
          params: reqParams,
        });
    if (response) {
      toast.show(response.message);
      await getTaskList({isLoader: true});
      return response.message;
    }
  };
  return [postServiceTask, {errors}];
};

export default usePostServiceTask;
