import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {
  updateArchivedEquipmentModel,
  updateMyEquipmentModel,
  updatePublicEquipmentModel,
} from '../../../redux/reducers/EquipmentModelReducer';
import {RootState} from '../../../redux/store';
export interface EquipmentCategoryInterface {
  id: number;
  name: string;
  description: string;
}

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetEquipmentModels = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const {roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getEquipmentModels = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (
      netInfo.isConnected &&
      (userCompany?.company_id || roleType === 'sAdmin')
    ) {
      const response = await get({
        endPoint:
          END_POINTS.GET_EQUIPMENT_MODELS +
          '?is_mycatalog=0&search=&is_mob=1&is_archived=0',
        params: {},
        isLoader: false,
      });
      if (response.data) {
        const {data} = response;
        const updateAction =
          roleType === 'sAdmin'
            ? updateMyEquipmentModel(Object.values(data))
            : updatePublicEquipmentModel(Object.values(data));

        /*
           @get Archived parts List
        */
        let catalog =
          roleType === 'sAdmin'
            ? '&is_mycatalog=0'
            : '&is_mycatalog=1&company_id=' + userCompany?.company_id;
        const archivedResponse = await get({
          endPoint:
            END_POINTS.GET_EQUIPMENT_MODELS +
            '?&search=&is_mob=1&is_archived=1' +
            catalog,
          params: {},
          isLoader: roleType === 'sAdmin' ? isLoader : false,
        });
        console.log(archivedResponse, 'archivedResponse');
        if (archivedResponse.data) {
          dispatch(
            updateArchivedEquipmentModel(Object.values(archivedResponse?.data)),
          );
        }
        if (roleType !== 'sAdmin') {
          const myCatResponse = await get({
            endPoint:
              END_POINTS.GET_EQUIPMENT_MODELS +
              '?is_mycatalog=1&search=&is_mob=1&is_archived=0&company_id=' +
              userCompany?.company_id,
            params: {},
            isLoader: isLoader,
          });
          console.log(myCatResponse, 'Response====');
          if (myCatResponse.data) {
            const myCatalogData = myCatResponse?.data;
            dispatch(updateMyEquipmentModel(Object.values(myCatalogData)));
          }
        }
        dispatch(updateAction);
        return data;
      }
    }
  };

  return [getEquipmentModels];
};

export default useGetEquipmentModels;
