import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../../constants';
import useGetApi from '../../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../../redux/store';
import {updateEquipmentList} from '../../../../redux/reducers/Equipment/EquipmentReducer';
import useDownloadDoc from '../Documents/useDownloadDoc';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetEquipments = (): [(options: GetData) => Promise<GetResponse>] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const [downloadEquipmentDocs] = useDownloadDoc();
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getEquipments = async (options: GetData) => {
    const {isLoader = true} = options;
    console.log(userCompany?.company_id, 'COMPANY ID=========');
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected && userCompany?.company_id) {
      const response = await get({
        endPoint:
          END_POINTS.GET_EQUIPMENTS +
          '?is_mycatalog=1&search=&is_mob=1&company_id=' +
          userCompany?.company_id,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;
        console.log(Object.values(data), 'EQUIPMENT LIST');
        downloadEquipmentDocs({equipments: Object.values(data)});
        dispatch(updateEquipmentList(Object.values(data)));
        return data;
      }
    }
  };

  return [getEquipments];
};

export default useGetEquipments;
