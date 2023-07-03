import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import usePostApi from '../usePostApi';
import useGetPartsAndMaterials from './useGetPartsAndMaterials';
export interface UnArchivePartsInterface {
  parts_category_id: string;
  id: number;
  part: any;
}

interface UnArchivePartsResponse {
  data: any;
  // Define the expected response properties here
}

const useUnArchiveParts = (): [
  (data: UnArchivePartsInterface) => Promise<UnArchivePartsResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [getPartsAndMaterials] = useGetPartsAndMaterials();
  useEffect(() => {
    setError(error);
  }, [error]);
  const unArchiveParts = async (data: UnArchivePartsInterface) => {
    const response = await postApi({
      endPoint: END_POINTS.UNARCHIVE_PARTS_METERIAL,
      params: {
        id: data?.id?.toString(),
      },
    });

    if (response) {
      toast.show(response.message);
      await getPartsAndMaterials({isLoader: true});
      return response.message;
    }
  };

  return [unArchiveParts, {errors}];
};

export default useUnArchiveParts;
