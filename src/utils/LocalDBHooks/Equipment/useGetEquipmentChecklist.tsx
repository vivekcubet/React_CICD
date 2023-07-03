import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  equipmentId: boolean;
  isArchived?: boolean;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetEquipmentChecklist = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {dailyChecklists} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );

  const getEquipmentChecklist = async (
    options: GetData,
  ): Promise<GetResponse[]> => {
    const {equipmentId, isArchived = true} = options;
    const result: GetResponse[] = dailyChecklists.filter((checkItem: any) => {
      if (isArchived) {
        return checkItem?.equipment_id?.toString() === equipmentId?.toString();
      } else {
        return (
          checkItem.equipment_id?.toString() === equipmentId?.toString() &&
          checkItem.is_archived !== 1
        );
      }
    });

    return result;
  };

  return [getEquipmentChecklist];
};

export default useGetEquipmentChecklist;
