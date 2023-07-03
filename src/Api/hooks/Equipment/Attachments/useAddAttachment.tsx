import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useGetAttachments from './useGetAttachments';
export interface AttachmentInterface {
  unit_no: string;
  make: string;
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

const useAddAttachment = (): [
  (data: AttachmentInterface) => Promise<AttachmentResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const toast = useToast();
  const [getAttachments] = useGetAttachments();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postAttachment = async (data: AttachmentInterface) => {
    const {isEdit, isForm, ...dataWithoutIsEdit} = data;
    const reqParams = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = isEdit
      ? await postApi({
          endPoint: END_POINTS.UPDATE_ATTACHMENTS,
          params: reqParams,
          isForm: isForm,
        })
      : await postApi({
          endPoint: END_POINTS.ADD_ATTACHMENTS,
          params: reqParams,
          isForm: isForm,
        });
    if (response) {
      await getAttachments({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [postAttachment, {errors}];
};

export default useAddAttachment;
