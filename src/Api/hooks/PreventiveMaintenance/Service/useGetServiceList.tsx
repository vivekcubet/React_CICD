import {useDispatch, useSelector} from 'react-redux';
import {END_POINTS} from '../../../constants';
import useGetApi from '../../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../../redux/store';
import {
  updateActiveServices,
  updateCompletedServices,
  updateFinishedServices,
} from '../../../../redux/reducers/PreventiveMaintenance/ServiceReducer';
import {useDownloadServiceDoc} from '../..';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useGetServiceList = (): [(options: GetData) => Promise<GetResponse>] => {
  const {roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const [downloadServiceDocs] = useDownloadServiceDoc();
  // const [downloadServiceDocuments] = useDownloadServiceDocs();
  const {serviceOfflineList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const getServiceList = async (options: GetData) => {
    const {isLoader = true} = options;
    const netInfo = await NetInfo.fetch();
    if (
      netInfo.isConnected &&
      (userCompany?.company_id || roleType === 'sAdmin')
    ) {
      let end_url =
        END_POINTS.GET_SERVICE_LIST +
        '?search=&is_mob=1&company_id=' +
        userCompany?.company_id;
      const response = await get({
        endPoint: end_url + '&status=active',
        params: {},
        isLoader: false,
      });
      if (response.data) {
        let allService: any = [];
        const {data} = response;
        let serviceList = Object.values(response?.data?.services);
        let finalList = serviceList.map((serviceItem: any) => {
          let isOffline = serviceOfflineList.find((item: any) => {
            return item.id.toString() === serviceItem.id.toString();
          });
          return isOffline ? isOffline : serviceItem;
        });
        allService = [...serviceList, ...allService];
        console.log(serviceList, 'ACTIVE RESPONCE===========', finalList);
        dispatch(updateActiveServices(finalList));
        /*
           @get Finished Service List
        */

        const finishedResponse = await get({
          endPoint: end_url + '&status=finished',
          params: {},
          isLoader: false,
        });
        if (finishedResponse.data) {
          dispatch(
            updateFinishedServices(
              Object.values(finishedResponse?.data?.services),
            ),
          );
          allService = [
            ...Object.values(finishedResponse?.data?.services),
            ...allService,
          ];
        }
        const completedResponse = await get({
          endPoint: end_url + '&status=approved',
          params: {},
          isLoader: isLoader,
        });
        if (completedResponse.data) {
          const completedData = Object.values(
            completedResponse?.data?.services,
          ).map((item: any) => item.data);
          dispatch(updateCompletedServices(completedData));
          allService = [...completedData, ...allService];
        }
        downloadServiceDocs({serviceList: allService});
        console.log(allService, 'SERVICELIST-------');
        return data;
      }
    }
  };

  return [getServiceList];
};

export default useGetServiceList;
