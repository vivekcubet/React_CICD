import {useEffect, useState} from 'react';
import {useToast} from 'react-native-toast-notifications';
import usePostApi from '../../usePostApi';
import {END_POINTS} from '../../../constants';
import {useGetServiceList} from '../..';
export interface UnArchiveServiceInterface {
  id: number;
}

interface UnArchiveResponse {
  data: any;
  // Define the expected response properties here
}

const useUnArchiveService = (): [
  (data: UnArchiveServiceInterface) => Promise<UnArchiveResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [getServiceList] = useGetServiceList();
  useEffect(() => {
    setError(error);
  }, [error]);
  const unArchiveService = async (data: UnArchiveServiceInterface) => {
    const response = await postApi({
      endPoint: END_POINTS.UNARCHIVE_SERVICE_LIST,
      params: {
        id: data?.id?.toString(),
      },
    });

    if (response) {
      toast.show(response.message);
      await getServiceList({isLoader: true});
      return response.message;
    }
  };

  return [unArchiveService, {errors}];
};

export default useUnArchiveService;
