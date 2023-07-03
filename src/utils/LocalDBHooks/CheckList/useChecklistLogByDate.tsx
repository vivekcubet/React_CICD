import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import moment from 'moment';

export interface GetData {
  equipmentId: any;
  date: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useChecklistLogByDate = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {checklistLog} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const {dailyCheckList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const checkListData = [...dailyCheckList, ...checklistLog];

  const getChecklistLog = async (options: GetData): Promise<GetResponse[]> => {
    const {date = new Date(), equipmentId} = options;
    console.log(checkListData, 'DATA======Check', equipmentId);
    const checklist = checkListData.filter((item: any) => {
      return (
        moment(item.date).format('YYYY-MM-DD') ===
          moment(date).format('YYYY-MM-DD') &&
        item.equipment_id.toString() === equipmentId.toString()
      );
    });
    console.log(checklistLog, 'DATA========', checklist, equipmentId);
    return checklist ? checklist : [];
  };

  return [getChecklistLog];
};

export default useChecklistLogByDate;
