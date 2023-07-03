import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import useUpdateApi from '../useUpdateApi';
import useGetPartsAndMaterials from './useGetPartsAndMaterials';
export interface EquipmentModelInterface {
  part_no: string;
  measurement_type_id: string;
  parts_category_id: string;
  description: string;
  company_id?: string;
  isEdit?: boolean;
  id?: number;
}

interface EquipmentModelResponse {
  data: any;
  // Define the expected response properties here
}

const usePostPartsAndMaterials = (): [
  (data: EquipmentModelInterface) => Promise<EquipmentModelResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const [getPartsAndMaterials] = useGetPartsAndMaterials();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [updateApi, {error: updateErrors}] = useUpdateApi();

  useEffect(() => {
    setError(error || updateErrors);
  }, [error, updateErrors]);
  const postPartsAndMaterial = async (data: EquipmentModelInterface) => {
    const reqParams = {
      ...data,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = data?.isEdit
      ? await updateApi({
          endPoint: END_POINTS.UPDATE_PARTS_METERIAL,
          params: reqParams,
        })
      : await postApi({
          endPoint: END_POINTS.CREATE_PARTS_METERIAL,
          params: reqParams,
        });
    if (response) {
      toast.show(response.message);
      await getPartsAndMaterials({isLoader: true});
      return response.message;
    }
  };

  return [postPartsAndMaterial, {errors}];
};

export default usePostPartsAndMaterials;
