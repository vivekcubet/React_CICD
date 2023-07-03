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
  isAll?: boolean;
  isArchived?: any;
}
interface GetResponse {
  map(arg0: (obj: any) => {label: any; value: any}): unknown;
  last_page: any;
  data?: any;
  results?: any;
  status?: any;
  message?: any;
  companies?: any;
}

const useGetCompanyList = (): [(options: GetData) => Promise<GetResponse>] => {
  const [get] = useGetApi();
  const getCompanyList = async (options: GetData) => {
    const {
      isLoader = true,
      page = '',
      search = '',
      isAll = false,
      isArchived = 0,
    } = options;
    const netInfo = await NetInfo.fetch();
    const perPage = isAll ? '' : '5';
    const url =
      END_POINTS.GET_COMPANIES +
      '?is_mob=0&per_page=' +
      perPage +
      '&search=' +
      search +
      '&is_archived=' +
      isArchived;
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

  return [getCompanyList];
};

export default useGetCompanyList;
