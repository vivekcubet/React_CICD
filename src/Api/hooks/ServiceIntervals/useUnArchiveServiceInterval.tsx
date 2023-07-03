import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import usePostApi from '../usePostApi';
import useGetServiceIntervals from './useGetServiceIntervals';
export interface UnArchiveIntervalInterface {
  id: number;
}

interface UnArchiveIntervalResponse {
  data: any;
  // Define the expected response properties here
}

const useUnArchiveServiceInterval = (): [
  (data: UnArchiveIntervalInterface) => Promise<UnArchiveIntervalResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();
  const [getServiceIntervals] = useGetServiceIntervals();
  useEffect(() => {
    setError(error);
  }, [error]);
  const unArchiveInterval = async (data: UnArchiveIntervalInterface) => {
    console.log(END_POINTS.UNARCHIVE_SERVICE_INTERVAL, 'DATA====', {
      id: data?.id?.toString(),
    });
    const response = await postApi({
      endPoint: END_POINTS.UNARCHIVE_SERVICE_INTERVAL,
      params: {
        id: data?.id?.toString(),
      },
    });

    if (response) {
      toast.show(response.message);
      await getServiceIntervals({isLoader: true});
      return response.message;
    }
  };

  return [unArchiveInterval, {errors}];
};

export default useUnArchiveServiceInterval;
