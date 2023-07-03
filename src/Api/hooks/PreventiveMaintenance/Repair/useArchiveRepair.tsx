import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {useGetRepairList} from '../..';
import useArchiveApi from '../../useArchiveApi';
import {END_POINTS} from '../../../constants';

export interface ArchiveServiceInterface {
  id?: number;
}

interface ArchiveResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveRepair = (): [
  (data: ArchiveServiceInterface) => Promise<ArchiveResponse>,
  {errors: any | null},
] => {
  const [getRepairList] = useGetRepairList();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveRepair = async (data: ArchiveServiceInterface) => {
    const response = await archiveData({
      endPoint: END_POINTS.ARCHIVE_REPAIR_LIST + '?id=' + data?.id?.toString(),
      params: {},
    });

    if (response) {
      getRepairList({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveRepair, {errors}];
};

export default useArchiveRepair;
