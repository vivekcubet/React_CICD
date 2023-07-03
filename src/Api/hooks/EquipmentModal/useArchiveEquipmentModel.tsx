import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import useArchiveApi from '../useArchiveApi';
import useGetEquipmentModels from './useGetEquipmentModels';
export interface EquipmentModelInterface {
  category_id: string;
  id?: number;
}

interface EquipmentModelResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveEquipmentModel = (): [
  (data: EquipmentModelInterface) => Promise<EquipmentModelResponse>,
  {errors: any | null},
] => {
  const [getEquipmentModels] = useGetEquipmentModels();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveEquipmentModel = async (data: EquipmentModelInterface) => {
    const response = await archiveData({
      endPoint:
        END_POINTS.ARCHIVE_EQUIPMENT_MODEL + '?id=' + data?.id?.toString(),
      params: {},
    });

    if (response) {
      console.log('RESPONSE==== Archive', response);
      // let archivedItem = {};
      // const updatedArray = myEquipmentModels.map((category: any) => {
      //   if (category.id.toString() === data.category_id.toString()) {
      //     archivedItem = category.models.find(
      //       (model: any) => model?.id.toString() === data?.id?.toString(),
      //     );
      //     let newData = category.models
      //       .map((model: any) =>
      //         model.id.toString() !== data?.id?.toString() ? model : undefined,
      //       )
      //       .filter((model: any) => model !== undefined);

      //     return {...category, models: newData};
      //   }
      //   return category;
      // });
      // let isFound = false;
      // let updatedArchivedList = archivedEquipmentModels?.map(
      //   (category: any) => {
      //     if (category.id.toString() === data.category_id.toString()) {
      //       isFound = true;
      //       let newData = [];
      //       newData.unshift(archivedItem, ...category.models);
      //       return {...category, models: newData};
      //     }
      //     return category;
      //   },
      // );
      // if (!isFound) {
      //   let category = equipmentCategories.find(
      //     obj => obj.value.toString() === data.category_id.toString(),
      //   );
      //   let newData = {
      //     id: category.value,
      //     name: category.label,
      //     models: [archivedItem],
      //   };
      //   updatedArchivedList = [...updatedArchivedList, newData];
      //   updatedArchivedList.sort((a, b) => a.name.localeCompare(b.name));
      // }
      // dispatch(updateArchivedEquipmentModel(updatedArchivedList));
      // dispatch(updateMyEquipmentModel(updatedArray));
      getEquipmentModels({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveEquipmentModel, {errors}];
};

export default useArchiveEquipmentModel;
