import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../redux/store';
import {updateCompanyTechnicians} from '../../../redux/reducers/Users/TechnicianReducer';

export interface GetData {
  isLoader?: boolean;
  page?: string;
  search?: string;
  roleId?: string;
  company_id?: string;
  endUrl?: string;
  isArchived?: any;
}
interface GetResponse {
  clients: never[];
  last_page: any;
  data?: any;
  results?: any;
  status?: any;
  message?: any;
  users?: any;
}

const useGetAllTechnicians = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const [get] = useGetApi();
  const dispatch = useDispatch();
  const {userCompany, dealerCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const getTechnicianList = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    let endUrl =
      END_POINTS.GET_USER_LIST +
      '?company_id=' +
      userCompany?.company_id +
      '&role_id[]=3&role_id[]=6&search=&is_mob=1&is_archived=0';
    endUrl = dealerCompany
      ? endUrl + '&dealer_id=' + dealerCompany?.company_id
      : endUrl;
    if (netInfo.isConnected && userCompany?.company_id) {
      const response = await get({
        endPoint: endUrl,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        console.log(endUrl, 'TECH RESPONSE=====', response);
        const {data} = response;
        dispatch(updateCompanyTechnicians(data));
        return data;
      }
    }
  };

  return [getTechnicianList];
};

export default useGetAllTechnicians;
