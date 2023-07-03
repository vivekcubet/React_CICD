import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import useArchiveApi from '../useArchiveApi';
import useGetServiceIntervals from './useGetServiceIntervals';
export interface intervalInterface {
  id?: number;
}

interface intervalResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveServiceInterval = (): [
  (data: intervalInterface) => Promise<intervalResponse>,
  {errors: any | null},
] => {
  const [getServiceIntervals] = useGetServiceIntervals();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveServiceIntervals = async (data: intervalInterface) => {
    const response = await archiveData({
      endPoint:
        END_POINTS.ARCHIVE_SERVICE_INTERVAL + '?id=' + data?.id?.toString(),
      params: {},
    });

    if (response) {
      getServiceIntervals({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveServiceIntervals, {errors}];
};

export default useArchiveServiceInterval;
