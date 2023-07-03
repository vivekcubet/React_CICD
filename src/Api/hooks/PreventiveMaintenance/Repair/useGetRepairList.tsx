import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../../constants';
import useGetApi from '../../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../../redux/store';
import {updateRepairList} from '../../../../redux/reducers/PreventiveMaintenance/RepairReducer';
import {useDownloadRepairDoc} from '../..';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetRepairList = (): [(options: GetData) => Promise<GetResponse>] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const {repairOfflineList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const dispatch = useDispatch();
  const [downloadRepairDocs] = useDownloadRepairDoc();
  const [get] = useGetApi();
  const getRepairList = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected && userCompany?.company_id) {
      let end_url =
        END_POINTS.GET_REPAIR_LIST +
        '?search=&is_mob=1&company_id=' +
        userCompany?.company_id;
      const response = await get({
        endPoint: end_url,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;
        console.log(data, 'REPAIR LIST DATA======');
        let repairList: any = Object.values(response?.data?.repair);
        let finalList = repairList.map((repairItem: any) => {
          let isOffline = repairOfflineList.find((item: any) => {
            return item.id.toString() === repairItem.id.toString();
          });
          return isOffline ? isOffline : repairItem;
        });
        dispatch(updateRepairList(finalList));
        downloadRepairDocs({repairList: repairList});
        return data;
      }
    }
  };

  return [getRepairList];
};

export default useGetRepairList;
