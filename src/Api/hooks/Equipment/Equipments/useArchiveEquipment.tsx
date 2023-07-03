import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {END_POINTS} from '../../../constants';
import useArchiveApi from '../../useArchiveApi';
import useGetEquipments from './useGetEquipments';
import usePostApi from '../../usePostApi';

export interface ArchiveEquipmentInterface {
  id: number;
  isArchive: boolean;
}

interface ArchiveResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveEquipment = (): [
  (data: ArchiveEquipmentInterface) => Promise<ArchiveResponse>,
  {errors: any | null},
] => {
  const [getEquipments] = useGetEquipments();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();
  const [postApi] = usePostApi();
  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveEquipment = async (data: ArchiveEquipmentInterface) => {
    console.log(data, 'ARCHIVE DATA=====');
    const response = data.isArchive
      ? await archiveData({
          endPoint:
            END_POINTS.ARCHIVE_EQUIPMENT + '?id=' + data?.id?.toString(),
          params: {id: data?.id?.toString()},
        })
      : await postApi({
          endPoint: END_POINTS.UNARCHIVE_EQUIPMENT,
          params: {id: data?.id?.toString()},
        });

    if (response) {
      console.log(response, 'TEXT=========');
      getEquipments({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveEquipment, {errors}];
};

export default useArchiveEquipment;
