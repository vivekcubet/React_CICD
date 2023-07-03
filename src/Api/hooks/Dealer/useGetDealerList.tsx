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
  isArchived?: any;
}
interface GetResponse {
  last_page: any;
  data?: any;
  results?: any;
  status?: any;
  message?: any;
  dealers?: any;
}

const useGetDealerList = (): [(options: GetData) => Promise<GetResponse>] => {
  const [get] = useGetApi();
  const getDealerList = async (options: GetData) => {
    const {isLoader = true, page = '', search = '', isArchived = 0} = options;
    const netInfo = await NetInfo.fetch();

    const endPoint =
      END_POINTS.GET_DEALER +
      '?is_mob=0&per_page=5' +
      '&search=' +
      search +
      '&is_archived=' +
      isArchived +
      '&page=' +
      page;
    if (netInfo.isConnected) {
      const response = await get({
        endPoint: endPoint,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        console.log(endPoint, '==============', response?.data);
        const {data} = response;
        return data;
      }
    }
  };

  return [getDealerList];
};

export default useGetDealerList;
