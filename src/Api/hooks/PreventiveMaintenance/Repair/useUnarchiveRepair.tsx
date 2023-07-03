import {useEffect, useState} from 'react';
import {useToast} from 'react-native-toast-notifications';
import usePostApi from '../../usePostApi';
import {END_POINTS} from '../../../constants';
import {useGetRepairList} from '../..';
export interface UnArchiveServiceInterface {
  id: number;
}

interface UnArchiveResponse {
  data: any;
  // Define the expected response properties here
}

const useUnArchiveRepair = (): [
  (data: UnArchiveServiceInterface) => Promise<UnArchiveResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [getRepairList] = useGetRepairList();
  useEffect(() => {
    setError(error);
  }, [error]);
  const unArchiveRepair = async (data: UnArchiveServiceInterface) => {
    const response = await postApi({
      endPoint: END_POINTS.UNARCHIVE_REPAIR_LIST,
      params: {
        id: data?.id?.toString(),
      },
    });

    if (response) {
      toast.show(response.message);
      await getRepairList({isLoader: true});
      return response.message;
    }
  };

  return [unArchiveRepair, {errors}];
};

export default useUnArchiveRepair;
