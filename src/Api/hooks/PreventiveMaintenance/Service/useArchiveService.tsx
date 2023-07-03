import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {useGetServiceList} from '../..';
import useArchiveApi from '../../useArchiveApi';
import {END_POINTS} from '../../../constants';

export interface ArchiveServiceInterface {
  id?: number;
}

interface ArchiveResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveService = (): [
  (data: ArchiveServiceInterface) => Promise<ArchiveResponse>,
  {errors: any | null},
] => {
  const [getServiceList] = useGetServiceList();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveService = async (data: ArchiveServiceInterface) => {
    const response = await archiveData({
      endPoint: END_POINTS.ARCHIVE_SERVICE_LIST + '?id=' + data?.id?.toString(),
      params: {},
    });

    if (response) {
      getServiceList({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveService, {errors}];
};

export default useArchiveService;
