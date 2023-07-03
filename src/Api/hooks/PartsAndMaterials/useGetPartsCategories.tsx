import {useDispatch} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {updatePartsCategories} from '../../../redux/reducers/PartsAndMaterialReducer';
export interface EquipmentCategoryInterface {
  id: number;
  name: string;
  description: string;
}

const useGetPartsCategories = () => {
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getPartsCategories = async () => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      const response = await get({
        endPoint: END_POINTS.GET_PARTS_CATEGORIES,
        params: {},
      });
      console.log(response, 'PARTS CATEGORIES=====');
      if (response?.data) {
        const finalCategories = response.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        dispatch(updatePartsCategories(finalCategories));
        return response?.data;
      }
    }
  };

  return [getPartsCategories];
};

export default useGetPartsCategories;
