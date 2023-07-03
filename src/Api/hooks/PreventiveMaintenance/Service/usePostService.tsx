import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {useGetEquipments, useGetServiceList} from '../..';
import NetInfo from '@react-native-community/netinfo';
import {
  useGetEquipmentById,
  useGetIntervalById,
} from '../../../../utils/LocalDBHooks';
import {
  updateCurrentHourLog,
  updateFluidResetHourLog,
  updateOfflineServiceList,
} from '../../../../redux/reducers/OfflineReducer';
import {updateEquipmentList} from '../../../../redux/reducers/Equipment/EquipmentReducer';
import {updateActiveServices} from '../../../../redux/reducers/PreventiveMaintenance/ServiceReducer';
// import useGetAttachments from './useGetAttachments';
export interface ServiceInterface {
  date: string;
  service_no: any;
  interval_id: string;
  technician_id: any;
  equipment_hour: boolean;
  status?: string;
  id?: any;
  isEdit?: boolean;
}

interface PostResponse {
  data: any;
  // Define the expected response properties here
}

const usePostService = (): [
  (data: ServiceInterface) => Promise<PostResponse>,
  {errors: any | null},
] => {
  const [getEquipment] = useGetEquipmentById();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const {activeServices} = useSelector(
    (state: RootState) => state.ServiceReducer,
  );
  const dispatch = useDispatch();
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const {serviceOfflineList, currentHourHistory, fluidResetLog} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const toast = useToast();
  const [getServiceList] = useGetServiceList();
  const [getInterval] = useGetIntervalById();
  const [getEquipments] = useGetEquipments();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postService = async (data: ServiceInterface) => {
    const netInfo = await NetInfo.fetch();
    const {isEdit = false, ...dataWithoutIsEdit} = data;
    const reqParams: any = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };
    console.log(
      reqParams,
      'POST++++SERVICE1',
      netInfo.isConnected &&
        userCompany?.company_id &&
        isEdit &&
        reqParams?.status === 'active',
    );
    if (netInfo.isConnected && userCompany?.company_id) {
      const response = await postApi({
        endPoint: isEdit
          ? END_POINTS.UPDATE_SERVICE
          : END_POINTS.ADD_NEW_SERVICE,
        params: reqParams,
        isForm: true,
      });

      if (response) {
        await getServiceList({isLoader: false});
        await getEquipments({isLoader: true});
        toast.show(response.message);
        return response.message;
      }
    } else if (
      !netInfo.isConnected &&
      userCompany?.company_id &&
      isEdit &&
      reqParams?.status === 'active'
    ) {
      const interval = await getInterval({intervalId: reqParams?.interval_id});
      let equipment = await getEquipment({
        equipmentId: reqParams?.equipment_id,
      });
      let updatedList = [...activeServices];
      console.log(equipment, 'TEST======Interval', interval);
      let updatedOfflineList = [...serviceOfflineList];
      let resetLog = [];
      reqParams['equipment'] = equipment;
      reqParams['is_archived'] = 0;
      reqParams['interval'] = interval;
      console.log(
        reqParams,
        'FINAL REQ PARAMS=====',
        reqParams.fluid_stiker_log,
      );
      let updatedResetLog = {...fluidResetLog};
      if (reqParams.fluid_stiker_log && reqParams.fluid_stiker_log.length > 0) {
        resetLog = reqParams.fluid_stiker_log.map(function (element: any) {
          console.log(element, 'FLUID=====');
          if (!element?.id) {
            updatedResetLog[element?.toString()] = {
              date: new Date().toISOString(),
              hours: reqParams?.equipment_hour,
            };
          }
          return element && {fluid_sticker_id: element, id: element};
        });
      }
      reqParams['fluid_resets'] = resetLog;
      let listIndex = -1;
      if (reqParams.id) {
        listIndex = activeServices.findIndex(
          item =>
            item?.id &&
            reqParams.id &&
            reqParams.id.toString() === item?.id.toString(),
        );
      }
      if (listIndex !== -1) {
        // Update existing object in the array
        updatedList[listIndex] = reqParams;
      }
      let offlineIndex = serviceOfflineList.findIndex((item: any) => {
        return (
          item?.id &&
          reqParams.id &&
          reqParams?.id.toString() === item?.id.toString()
        );
      });
      if (offlineIndex !== -1) {
        // Update existing object in the array
        updatedOfflineList[offlineIndex] = reqParams;
      } else {
        updatedOfflineList = [reqParams, ...updatedOfflineList];
      }
      let updatedEqList: any = [...equipmentList];
      updatedEqList = await updatedEqList.map((item: any) => {
        let parts = item.parts.map((part: any) => {
          if (part.id.toString() === reqParams.equipment_id.toString()) {
            return {
              ...part,
              current_hour: reqParams.equipment_hour,
            };
          }
          return part;
        });
        return {
          ...item,
          parts: parts,
        };
      });
      let hourUpdateHistory: any = {...currentHourHistory};
      hourUpdateHistory[reqParams.equipment_id.toString()] = {
        date: new Date().toISOString(),
        hours: reqParams.equipment_hour,
      };
      dispatch(updateCurrentHourLog(hourUpdateHistory));
      dispatch(updateFluidResetHourLog(updatedResetLog));
      dispatch(updateEquipmentList(updatedEqList));
      dispatch(updateOfflineServiceList(updatedOfflineList));
      dispatch(updateActiveServices(updatedList));
      toast.show('Service saved offline');
      console.log(reqParams, 'REq paramssss', updatedOfflineList);
      return updatedList;
    } else if (!netInfo.isConnected) {
      toast.show('To edit, please ensure internet connectivity.');
    }
  };

  return [postService, {errors}];
};

export default usePostService;
