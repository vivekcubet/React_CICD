import getFilenameFromUrl from '../../../../utils/helpers/getFileNameFromUrl';
import {END_POINTS} from '../../../constants';
import useGetApi from '../../useGetApi';
import NetInfo from '@react-native-community/netinfo';

export interface GetData {
  isLoader?: boolean;
  equipmentId: any;
  url?: string;
  searchTxt?: string;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetEquipmentDoc = (): [(options: GetData) => Promise<GetResponse>] => {
  const [get] = useGetApi();
  const getDocuments = async (options: GetData) => {
    const {isLoader = true, url, searchTxt = ''} = options;
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      const response = await get({
        endPoint: url
          ? url
          : END_POINTS.GET_EQUIPMENT_DOCUMENTS +
            '?is_mycatalog=1&is_mob=1&is_archived=0&equipment_id=' +
            options?.equipmentId +
            '&search=' +
            searchTxt,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;

        // getFilenameFromUrl(data[0]?.path);
        console.log('TEST======DOC', getFilenameFromUrl(data[0]?.path));
        return data;
      }
    }
  };

  return [getDocuments];
};

export default useGetEquipmentDoc;
