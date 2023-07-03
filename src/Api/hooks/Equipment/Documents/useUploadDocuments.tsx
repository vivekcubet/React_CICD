import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
// import useGetAttachments from './useGetAttachments';
export interface DocumentInterface {
  equipment_id: string;
  description: any;
  name: string;
  path: any;
  isForm?: boolean;
}

interface PostResponse {
  data: any;
  // Define the expected response properties here
}

const useUploadDocuments = (): [
  (data: DocumentInterface) => Promise<PostResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const toast = useToast();
  //   const [getAttachments] = useGetAttachments();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const uploadDocument = async (data: DocumentInterface) => {
    const reqParams = {
      ...data,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = await postApi({
      endPoint: END_POINTS.UPLOAD_EQUIPMENT_DOCUMENTS,
      params: reqParams,
      isForm: true,
    });

    if (response) {
      //   await getAttachments({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [uploadDocument, {errors}];
};

export default useUploadDocuments;
