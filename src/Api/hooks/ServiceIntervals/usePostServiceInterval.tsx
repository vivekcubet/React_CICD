import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import useUpdateApi from '../useUpdateApi';
import useGetServiceIntervals from './useGetServiceIntervals';

export interface EquipmentModelInterface {
  model_id: string;
  isEdit?: boolean;
  interval_hours: any;
  id?: number;
}

interface EquipmentModelResponse {
  data: any;
  // Define the expected response properties here
}

const usePostServiceInterval = (): [
  (data: EquipmentModelInterface) => Promise<EquipmentModelResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const [getServiceIntervals] = useGetServiceIntervals();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [updateApi, {error: updateErrors}] = useUpdateApi();

  useEffect(() => {
    setError(error || updateErrors);
  }, [error, updateErrors]);
  const postServiceInterval = async (data: EquipmentModelInterface) => {
    const reqParams = {
      ...data,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = data?.isEdit
      ? await updateApi({
          endPoint: END_POINTS.UPDATE_SERVICE_INTERVAL,
          params: reqParams,
        })
      : await postApi({
          endPoint: END_POINTS.CREATE_SERVICE_INTERVAL,
          params: reqParams,
        });
    if (response) {
      toast.show(response.message);
      await getServiceIntervals({isLoader: true});
      return response.message;
    }
  };

  return [postServiceInterval, {errors}];
};

export default usePostServiceInterval;
