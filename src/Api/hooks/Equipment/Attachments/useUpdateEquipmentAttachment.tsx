import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useGetEquipments from '../Equipments/useGetEquipments';
export interface AttachmentInterface {
  equipment_id?: any;
  type?: any;
  isForm?: boolean;
}

interface AttachmentResponse {
  data: any;
  // Define the expected response properties here
}

const useUpdateEquipmentAttachment = (): [
  (data: AttachmentInterface) => Promise<AttachmentResponse>,
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
  const updateAttachment = async (data: AttachmentInterface) => {
    const {isForm, ...dataWithoutIsEdit} = data;
    const reqParams = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = await postApi({
      endPoint: END_POINTS.UPDATE_EQUIPMENT_ATTACHMENTS,
      params: reqParams,
      isForm: isForm,
    });
    if (response) {
      await getEquipments({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [updateAttachment, {errors}];
};

export default useUpdateEquipmentAttachment;
