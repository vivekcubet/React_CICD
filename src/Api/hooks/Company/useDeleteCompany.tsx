import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import useArchiveApi from '../useArchiveApi';
export interface CompanyDeleteInterface {
  id?: number;
}

interface CompanyDeleteResponse {
  data: any;
  // Define the expected response properties here
}

const useDeleteCompany = (): [
  (data: CompanyDeleteInterface) => Promise<CompanyDeleteResponse>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const deleteCompany = async (data: CompanyDeleteInterface) => {
    const response = await archiveData({
      endPoint: END_POINTS.DELETE_COMPANY + '?id=' + data?.id?.toString(),
      params: {},
    });

    if (response) {
      toast.show(response.message);
      return response.message;
    }
  };

  return [deleteCompany, {errors}];
};

export default useDeleteCompany;
