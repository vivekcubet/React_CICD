import {useSelector} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../redux/store';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetCompanyTechnicians = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const [get] = useGetApi();
  const getCompanyTechnicians = async (options: GetData) => {
    console.log(userCompany, 'USER COMPANY+++++++');
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected && userCompany?.company_id) {
      let url =
        END_POINTS.GET_USERS +
        '?is_mob=1' +
        '&role_id=' +
        3 +
        '&search=' +
        '' +
        '&company_id=' +
        userCompany?.company_id +
        '&is_archived=' +
        0;
      const response = await get({
        endPoint: url,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;
        return data;
      }
    }
  };

  return [getCompanyTechnicians];
};

export default useGetCompanyTechnicians;
