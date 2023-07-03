import {useDispatch} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {updateCategories} from '../../../redux/reducers/EquipmentModelReducer';
export interface EquipmentCategoryInterface {
  id: number;
  name: string;
  description: string;
}

const useEquipmentCategories = () => {
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getCategories = async () => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      const response = await get({
        endPoint: END_POINTS.EQUIPMENT_CATEGORIES,
        params: {},
      });
      if (response?.data) {
        const finalCategories = response.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        dispatch(updateCategories(finalCategories));
        return response?.data;
      }
    }
  };

  return [getCategories];
};

export default useEquipmentCategories;
