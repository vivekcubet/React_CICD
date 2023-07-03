import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../../constants';
import useGetApi from '../../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../../redux/store';
import {updateCheckListLog} from '../../../../redux/reducers/Equipment/EquipmentReducer';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetChecklistLog = (): [(options: GetData) => Promise<GetResponse>] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getChecklistData = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected && userCompany?.company_id) {
      const response = await get({
        endPoint:
          END_POINTS.GET_DAILY_CHECKLIST_BY_DATE +
          '?is_mycatalog=0&search=&is_mob=1&company_id=' +
          userCompany?.company_id,
        // +
        // '&equipment_id=' +
        // equipment_id +
        // '&date=' +
        // moment(date).format('YYYY-MM-DD'),
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;
        dispatch(updateCheckListLog(data));
        console.log(data, 'Response=====');
        return data;
      }
    }
  };

  return [getChecklistData];
};

export default useGetChecklistLog;
