import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
export interface EquipmentCategoryInterface {
  id: number;
  name: string;
  description: string;
}

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

const useGetUserList = (): [(options: GetData) => Promise<GetResponse>] => {
  const [get] = useGetApi();
  const getUserList = async (options: GetData) => {
    const {
      isLoader = true,
      page = '',
      search = '',
      roleId,
      company_id = '',
      endUrl = '',
      isArchived = 0,
    } = options;
    const netInfo = await NetInfo.fetch();
    let url =
      END_POINTS.GET_USERS +
      '?is_mob=0&per_page=5' +
      '&role_id=' +
      roleId +
      '&search=' +
      search +
      '&company_id=' +
      company_id +
      '&is_archived=' +
      isArchived;
    url = endUrl ? endUrl : url;
    const endPoint = page ? url + '&page=' + page : url;
    console.log(endPoint, '==============');
    if (netInfo.isConnected) {
      const response = await get({
        endPoint: endPoint,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;
        return data;
      }
    }
  };

  return [getUserList];
};

export default useGetUserList;
