import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {useGetEquipments, useGetRepairList} from '../..';
import NetInfo from '@react-native-community/netinfo';
import {useGetEquipmentById} from '../../../../utils/LocalDBHooks';
import generateUniqueId from '../../../../utils/helpers/getUniqueId';
import {
  updateCurrentHourLog,
  updateFluidResetHourLog,
  updateOfflineRepairList,
} from '../../../../redux/reducers/OfflineReducer';
import {updateRepairList} from '../../../../redux/reducers/PreventiveMaintenance/RepairReducer';
import {updateEquipmentList} from '../../../../redux/reducers/Equipment/EquipmentReducer';
// import useGetAttachments from './useGetAttachments';
export interface RepairInterface {
  date: string;
  name: string;
  repair_no: any;
  equipment_hour: boolean;
  equipment_id: any;
  id?: any;
  isEdit?: boolean;
}

interface PostResponse {
  data: any;
  // Define the expected response properties here
}

const usePostRepair = (): [
  (data: RepairInterface) => Promise<PostResponse>,
  {errors: any | null},
] => {
  const dispatch = useDispatch();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const {repairList} = useSelector((state: RootState) => state.RepairReducer);
  const {repairOfflineList, currentHourHistory, fluidResetLog} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );

  const [getEquipment] = useGetEquipmentById();
  const toast = useToast();
  const [getEquipments] = useGetEquipments();
  const [getRepairList] = useGetRepairList();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postRepair = async (data: RepairInterface) => {
    const {isEdit = false, ...dataWithoutIsEdit} = data;
    const netInfo = await NetInfo.fetch();
    const reqParams: any = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };
    if (netInfo.isConnected && userCompany?.company_id) {
      const response = await postApi({
        endPoint: isEdit ? END_POINTS.UPDATE_REPAIR : END_POINTS.ADD_NEW_REPAIR,
        params: reqParams,
        isForm: true,
      });

      if (response) {
        getRepairList({isLoader: false});
        getEquipments({isLoader: true});
        toast.show(response.message);
        return response.message;
      }
    }
    if (!netInfo.isConnected && userCompany?.company_id) {
      let equipment = await getEquipment({
        equipmentId: reqParams?.equipment_id,
      });
      let updatedList = [...repairList];
      let updatedOfflineList = [...repairOfflineList];
      let resetLog = [];
      reqParams['equipment'] = equipment;
      reqParams['is_archived'] = 0;
      let updatedResetLog = {...fluidResetLog};
      if (reqParams.fluid_stiker_log && reqParams.fluid_stiker_log.length > 0) {
        resetLog = reqParams.fluid_stiker_log.map(function (element: any) {
          if (!element.id) {
            updatedResetLog[element.toString()] = {
              date: new Date().toISOString(),
              hours: reqParams.equipment_hours,
            };
          }
          return {fluid_sticker_id: element};
        });
      }
      reqParams['fluid_stiker_log'] = resetLog;
      if (!isEdit) {
        let id = generateUniqueId();
        reqParams['temp_id'] = id;
        updatedOfflineList.push(reqParams);
        updatedList.push(reqParams);
      } else {
        let listIndex = -1;
        if (reqParams?.temp_id || reqParams.id) {
          listIndex = repairList.findIndex(
            item =>
              (item?.temp_id &&
                reqParams?.temp_id &&
                reqParams?.temp_id.toString() === item?.temp_id.toString()) ||
              (item?.id &&
                reqParams.id &&
                reqParams.id.toString() === item?.id.toString()),
          );
        }
        console.log(listIndex, 'INDEX FOUND=======', reqParams);
        if (listIndex !== -1) {
          // Update existing object in the array
          updatedList[listIndex] = reqParams;
        }
        let offlineIndex = repairOfflineList.findIndex((item: any) => {
          return (
            (item?.temp_id &&
              reqParams?.temp_id &&
              reqParams?.temp_id.toString() === item?.temp_id.toString()) ||
            (item?.id &&
              reqParams.id &&
              reqParams?.id.toString() === item?.id.toString())
          );
        });
        console.log(offlineIndex, 'TEST=========');
        if (offlineIndex !== -1) {
          // Update existing object in the array
          updatedOfflineList[offlineIndex] = reqParams;
        } else {
          updatedOfflineList = [reqParams, ...updatedOfflineList];
        }
      }
      let updatedEqList: any = [...equipmentList];

      updatedEqList = await updatedEqList.map((item: any) => {
        let parts = item.parts.map((part: any) => {
          if (part.id.toString() === reqParams.equipment_id.toString()) {
            return {
              ...part,
              current_hour: reqParams.equipment_hours,
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
        hours: reqParams.equipment_hours,
      };
      dispatch(updateCurrentHourLog(hourUpdateHistory));
      dispatch(updateFluidResetHourLog(updatedResetLog));
      dispatch(updateEquipmentList(updatedEqList));
      dispatch(updateOfflineRepairList(updatedOfflineList));
      dispatch(updateRepairList(updatedList));
      toast.show('Repair saved offline');
      console.log(reqParams, 'REq paramssss', updatedOfflineList);
      return updatedList;
    } else if (!netInfo.isConnected) {
      toast.show('To edit, please ensure internet connectivity.');
    }
  };

  return [postRepair, {errors}];
};

export default usePostRepair;
