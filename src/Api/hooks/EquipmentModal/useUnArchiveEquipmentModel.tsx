import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {
  updateArchivedEquipmentModel,
  updateMyEquipmentModel,
} from '../../../redux/reducers/EquipmentModelReducer';
import usePostApi from '../usePostApi';
import useGetEquipmentModels from './useGetEquipmentModels';
export interface EquipmentUnArchiveInterface {
  category_id: string;
  id?: number;
  model: any;
}

interface EquipmentModelResponse {
  data: any;
  // Define the expected response properties here
}

const useUnArchiveEquipmentModel = (): [
  (data: EquipmentUnArchiveInterface) => Promise<EquipmentModelResponse>,
  {errors: any | null},
] => {
  const {myEquipmentModels, archivedEquipmentModels, equipmentCategories} =
    useSelector((state: RootState) => state.EquipmentModelReducer);
  const [getEquipmentModels] = useGetEquipmentModels();
  const toast = useToast();
  const dispatch = useDispatch();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const unArchiveEquipmentModel = async (data: EquipmentUnArchiveInterface) => {
    const response = await postApi({
      endPoint: END_POINTS.UNARCHIVE_EQUIPMENT_MODEL,
      params: {
        id: data?.id?.toString(),
      },
    });

    if (response) {
      // console.log('RESPONSE==== Archive', response);
      // let archivedItem = {};
      // const archivedArray = archivedEquipmentModels.map((category: any) => {
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
      // let updatedMyModels = myEquipmentModels?.map((category: any) => {
      //   if (category.id.toString() === data.category_id.toString()) {
      //     isFound = true;
      //     let newData = [];
      //     newData.unshift(archivedItem, ...category.models);
      //     return {...category, models: newData};
      //   }
      //   return category;
      // });
      // if (!isFound) {
      //   let category = equipmentCategories.find(
      //     obj => obj.value.toString() === data.category_id.toString(),
      //   );
      //   let newData = {
      //     id: category.value,
      //     name: category.label,
      //     models: [archivedItem],
      //   };
      //   updatedMyModels = [...updatedMyModels, newData];
      //   updatedMyModels.sort((a, b) => a.name.localeCompare(b.name));
      // }
      // dispatch(updateArchivedEquipmentModel(updatedMyModels));
      // dispatch(updateMyEquipmentModel(archivedArray));
      getEquipmentModels({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [unArchiveEquipmentModel, {errors}];
};

export default useUnArchiveEquipmentModel;
