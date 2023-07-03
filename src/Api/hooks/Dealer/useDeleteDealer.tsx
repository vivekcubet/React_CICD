import {useToast} from 'react-native-toast-notifications';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
export interface DeleteDealerInterface {
  id: number;
}

export interface GetData {
  id: string;
}
interface GetResponse {
  data?: any;
}

const useDeleteDealer = (): [(options: GetData) => Promise<GetResponse>] => {
  const [get] = useGetApi();
  const toast = useToast();
  const deleteDealer = async (options: GetData) => {
    const {id} = options;
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
      const response = await get({
        endPoint: END_POINTS.DELETE_DEALER + '?id=' + id,
        params: {},
      });
      if (response.data) {
        toast.show(response.message);
        const {data} = response;
        return data;
      }
    }
  };

  return [deleteDealer];
};

export default useDeleteDealer;
