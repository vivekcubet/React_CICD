import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import useArchiveApi from '../useArchiveApi';
import useGetPartsAndMaterials from './useGetPartsAndMaterials';
export interface EquipmentModelInterface {
  parts_category_id: string;
  id?: number;
}

interface EquipmentModelResponse {
  data: any;
  // Define the expected response properties here
}

const useArchivePartsAndMaterials = (): [
  (data: EquipmentModelInterface) => Promise<EquipmentModelResponse>,
  {errors: any | null},
] => {
  const [getPartsAndMaterials] = useGetPartsAndMaterials();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const archivePartsAndMaterials = async (data: EquipmentModelInterface) => {
    const response = await archiveData({
      endPoint:
        END_POINTS.ARCHIVE_PARTS_METERIAL + '?id=' + data?.id?.toString(),
      params: {},
    });

    if (response) {
      getPartsAndMaterials({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archivePartsAndMaterials, {errors}];
};

export default useArchivePartsAndMaterials;
