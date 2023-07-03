import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../constants';
import useGetApi from '../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../redux/store';
import {
  updateArchivedServiceIntervals,
  updateMyServiceIntervals,
  updatePublicServiceIntervals,
} from '../../../redux/reducers/ServiceIntervalReducer';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetServiceIntervals = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const {roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getServiceIntervals = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (
      netInfo.isConnected &&
      (userCompany?.company_id || roleType === 'sAdmin')
    ) {
      console.log(
        END_POINTS.GET_SERVICE_INTERVALS +
          '?is_mycatalog=0&search=&is_mob=1&is_archived=0',
        'INTERVALS=====',
      );
      const response = await get({
        endPoint:
          END_POINTS.GET_SERVICE_INTERVALS +
          '?is_mycatalog=0&search=&is_mob=1&is_archived=0',
        params: {},
        isLoader: false,
      });
      if (response.data) {
        const {data} = response;
        console.log(data, 'RESPONSE DATA======');
        const updateAction =
          roleType === 'sAdmin'
            ? updateMyServiceIntervals(Object.values(data))
            : updatePublicServiceIntervals(Object.values(data));

        /*
           @get Archived parts List
        */
        let catalog =
          roleType === 'sAdmin'
            ? '&is_mycatalog=0'
            : '&is_mycatalog=1&company_id=' + userCompany?.company_id;
        const archivedResponse = await get({
          endPoint:
            END_POINTS.GET_SERVICE_INTERVALS +
            '?&search=&is_mob=1&is_archived=1' +
            catalog,
          params: {},
          isLoader: roleType === 'sAdmin' ? isLoader : false,
        });
        console.log(
          archivedResponse,
          'archivedResponseInterval',
          END_POINTS.GET_SERVICE_INTERVALS,
        );
        if (archivedResponse.data) {
          dispatch(
            updateArchivedServiceIntervals(
              Object.values(archivedResponse?.data),
            ),
          );
        }
        if (roleType !== 'sAdmin') {
          const myCatResponse = await get({
            endPoint:
              END_POINTS.GET_SERVICE_INTERVALS +
              '?is_mycatalog=1&search=&is_mob=1&is_archived=0&company_id=' +
              userCompany?.company_id,
            params: {},
            isLoader: isLoader,
          });
          if (myCatResponse.data) {
            const myCatalogData = myCatResponse?.data;
            dispatch(updateMyServiceIntervals(Object.values(myCatalogData)));
          }
        }
        dispatch(updateAction);
        return data;
      }
    }
  };

  return [getServiceIntervals];
};

export default useGetServiceIntervals;
