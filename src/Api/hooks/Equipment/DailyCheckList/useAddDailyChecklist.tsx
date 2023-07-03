import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useGetDailyChecklists from './useGetDailyChecklists';
import NetInfo from '@react-native-community/netinfo';
import useGetEquipments from '../Equipments/useGetEquipments';
import moment from 'moment';
import {
  updateCurrentHourLog,
  updateOfflineDailyList,
} from '../../../../redux/reducers/OfflineReducer';
import {updateEquipmentList} from '../../../../redux/reducers/Equipment/EquipmentReducer';
import {useGetEquipmentById} from '../../../../utils/LocalDBHooks';
export interface ChecklistInterface {
  name: string;
  description: string;
  isEdit?: boolean;
  equipment_Id?: any;
}

interface ChecklistResponse {
  data: any;
  // Define the expected response properties here
}

const useAddDailyChecklist = (): [
  (data: ChecklistInterface) => Promise<ChecklistResponse>,
  {errors: any | null},
] => {
  const [getEquipment] = useGetEquipmentById();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const {dailyCheckList, currentHourHistory} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const dispatch = useDispatch();
  const toast = useToast();
  const [getEquipments] = useGetEquipments();
  const [getDailyChecklists] = useGetDailyChecklists();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const addChecklist = async (data: ChecklistInterface) => {
    const netInfo = await NetInfo.fetch();

    const {isEdit = false, ...dataWithoutIsEdit} = data;
    console.log(isEdit);
    const reqParams: any = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };

    if (netInfo.isConnected && userCompany?.company_id) {
      const response = await postApi({
        endPoint: END_POINTS.ADD_DAILY_CHECKLIST,
        params: reqParams,
        isForm: false,
      });

      if (response) {
        await getDailyChecklists({
          isLoader: false,
        });
        await getEquipments({
          isLoader: true,
        });
        toast.show(response.message);
        return response.message;
      }
    } else if (!netInfo.isConnected && userCompany?.company_id) {
      console.log(reqParams, 'Response=====');
      let equipment = await getEquipment({
        equipmentId: reqParams?.equipment_id,
      });
      const convertedObject = {
        ...reqParams,
        equipment: equipment,
        checklist_log: reqParams.checklist_id.map((id: any, index: any) => ({
          checklist_id: id,
          is_checked: reqParams.is_checked[index],
        })),
      };
      let updatedData = [...dailyCheckList];
      let index = dailyCheckList.findIndex(
        (item: any) =>
          moment(item.date).format('YYYY-MM-DD') ===
            moment(convertedObject.date).format('YYYY-MM-DD') &&
          item.equipment_id.toString() ===
            convertedObject.equipment_id.toString(),
      );

      if (index !== -1) {
        // Update existing object in the array
        updatedData[index] = convertedObject;
      } else {
        // Add new object to the array
        updatedData.push(convertedObject);
      }
      let updatedEqList: any = [...equipmentList];
      updatedEqList = await updatedEqList.map((item: any) => {
        let parts = item.parts.map((part: any) => {
          if (part.id.toString() === convertedObject.equipment_id.toString()) {
            return {
              ...part,
              current_hour: convertedObject.hours,
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
      hourUpdateHistory[convertedObject.equipment_id.toString()] = {
        date: new Date().toISOString(),
        hours: convertedObject.hours,
      };
      dispatch(updateCurrentHourLog(hourUpdateHistory));
      dispatch(updateEquipmentList(updatedEqList));
      console.log(equipmentList, 'DATA FINALLLLLLLL', updatedEqList);
      dispatch(updateOfflineDailyList(updatedData));
      toast.show('Check list saved offline');
      return updatedData;
      // let logData = {

      // }
    }
  };

  return [addChecklist, {errors}];
};

export default useAddDailyChecklist;
