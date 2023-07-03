import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../../constants';
import useGetApi from '../../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../../redux/store';
import {updateFluidStickerList} from '../../../../redux/reducers/Equipment/EquipmentReducer';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetFluidStickers = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getFluidStickers = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected && userCompany?.company_id) {
      const response = await get({
        endPoint:
          END_POINTS.GET_FLUID_STICKER +
          '?is_mycatalog=1&search=&is_mob=1&company_id=' +
          userCompany?.company_id,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;
        dispatch(updateFluidStickerList(Object.values(data)));
        return data;
      }
    }
  };

  return [getFluidStickers];
};

export default useGetFluidStickers;
