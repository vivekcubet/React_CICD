import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../redux/store';
import {
  updateArchivedPartsAndMaterials,
  updateMyPartsAndMaterials,
  updatePublicPartsAndMaterials,
} from '../../../redux/reducers/PartsAndMaterialReducer';
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
const useGetPartsAndMaterials = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const {roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getPartsAndMaterials = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (
      netInfo.isConnected &&
      (userCompany?.company_id || roleType === 'sAdmin')
    ) {
      const response = await get({
        endPoint:
          END_POINTS.GET_PARTS_METERIAL +
          '?is_mycatalog=0&search=&is_mob=1&is_archived=0',
        params: {},
        isLoader: false,
      });
      if (response.data) {
        const {data} = response;
        const updateAction =
          roleType === 'sAdmin'
            ? updateMyPartsAndMaterials(Object.values(data))
            : updatePublicPartsAndMaterials(Object.values(data));

        /*
           @get Archived parts List
        */
        let catalog =
          roleType === 'sAdmin'
            ? '&is_mycatalog=0'
            : '&is_mycatalog=1&company_id=' + userCompany?.company_id;
        const archivedResponse = await get({
          endPoint:
            END_POINTS.GET_PARTS_METERIAL +
            '?search=&is_mob=1&is_archived=1' +
            catalog,
          params: {},
          isLoader: roleType === 'sAdmin' ? true : false,
        });
        console.log(archivedResponse, 'AAchieved PARTS Response===');
        if (archivedResponse.data) {
          dispatch(
            updateArchivedPartsAndMaterials(
              Object.values(archivedResponse?.data),
            ),
          );
        }

        if (roleType !== 'sAdmin') {
          const myCatResponse = await get({
            endPoint:
              END_POINTS.GET_PARTS_METERIAL +
              '?is_mycatalog=1&search=&is_mob=1&is_archived=0&company_id=' +
              userCompany?.company_id,
            params: {},
            isLoader: isLoader,
          });

          if (myCatResponse.data) {
            console.log(myCatResponse.data, 'MY PARTS== Response==');
            dispatch(
              updateMyPartsAndMaterials(Object.values(myCatResponse?.data)),
            );
          }
        }
        dispatch(updateAction);
        return data;
      }
    }
  };

  return [getPartsAndMaterials];
};

export default useGetPartsAndMaterials;
