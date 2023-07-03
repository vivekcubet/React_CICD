import {useDispatch} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {updatePartsMeasurements} from '../../../redux/reducers/PartsAndMaterialReducer';
export interface EquipmentCategoryInterface {
  id: number;
  name: string;
  description: string;
}
export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}
const useGetMeasurementTypes = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getPartsMeasurements = async (options: GetData) => {
    const {isLoader = true} = options ? options : {};
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      const response = await get({
        endPoint: END_POINTS.GET_PARTS_MEASUREMENTS,
        params: {},
        isLoader: isLoader,
      });
      console.log(response, 'PARTS Measurements=====', isLoader);
      if (response?.data) {
        const finalMeasurements = response.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        dispatch(updatePartsMeasurements(finalMeasurements));
        return response?.data;
      }
    }
  };

  return [getPartsMeasurements];
};

export default useGetMeasurementTypes;
