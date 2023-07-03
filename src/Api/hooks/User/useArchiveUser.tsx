import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import useArchiveApi from '../useArchiveApi';
export interface ArchiveUserInterface {
  id?: number;
}

interface ArchiveUserResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveUser = (): [
  (data: ArchiveUserInterface) => Promise<ArchiveUserResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveUser = async (data: ArchiveUserInterface) => {
    const response = await archiveData({
      endPoint: END_POINTS.DELETE_USER + '?id=' + data?.id?.toString(),
      params: {},
    });

    if (response) {
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveUser, {errors}];
};

export default useArchiveUser;
