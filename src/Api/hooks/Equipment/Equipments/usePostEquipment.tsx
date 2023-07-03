import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useGetEquipments from './useGetEquipments';
export interface EquipmentInterface {
  unit_no: string;
  make: string;
  category_id: string;
  model_id: string;
  current_hour: string;
  model: string;
  sl_no: string;
  id?: string;
  logo?: any;
  isEdit?: string;
  isForm?: boolean;
}

interface AttachmentResponse {
  data: any;
  // Define the expected response properties here
}

const usePostEquipment = (): [
  (data: EquipmentInterface) => Promise<AttachmentResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const toast = useToast();
  const [getEquipments] = useGetEquipments();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postEquipment = async (data: EquipmentInterface) => {
    const {isEdit, isForm, ...dataWithoutIsEdit} = data;
    const reqParams = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = await postApi({
      endPoint: isEdit
        ? END_POINTS.UPDATE_EQUIPMENTS
        : END_POINTS.POST_EQUIPMENTS,
      params: reqParams,
      isForm: isForm,
    });
    if (response) {
      await getEquipments({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [postEquipment, {errors}];
};

export default usePostEquipment;
