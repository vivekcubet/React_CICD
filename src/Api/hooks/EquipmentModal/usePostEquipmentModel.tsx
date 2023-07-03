import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import useUpdateApi from '../useUpdateApi';
import useGetEquipmentModels from './useGetEquipmentModels';
export interface EquipmentModelInterface {
  name: string;
  category_id: string;
  brand: string;
  model: string;
  company_id?: string;
  isEdit?: boolean;
  id?: number;
  is_duplicate?: boolean;
}

interface EquipmentModelResponse {
  data: any;
  // Define the expected response properties here
}

const usePostEquipmentModel = (): [
  (data: EquipmentModelInterface) => Promise<EquipmentModelResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const toast = useToast();
  const [getEquipmentModels] = useGetEquipmentModels();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [updateApi, {error: updateErrors}] = useUpdateApi();

  useEffect(() => {
    setError(error || updateErrors);
  }, [error, updateErrors]);
  const postEquipmentModel = async (data: EquipmentModelInterface) => {
    const reqParams = {
      ...data,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = data?.isEdit
      ? await updateApi({
          endPoint: END_POINTS.UPDATE_EQUIPMENT_MODEL,
          params: reqParams,
        })
      : await postApi({
          endPoint: END_POINTS.CREATE_EQUIPMENT_MODAL,
          params: reqParams,
        });
    if (response) {
      await getEquipmentModels({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [postEquipmentModel, {errors}];
};

export default usePostEquipmentModel;
