import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  equipmentId: boolean;
}
interface GetResponse {
  equipment?: any;
}

const useGetEquipmentDetails = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );

  const getEquipment = async (options: GetData) => {
    console.log(options.equipmentId, 'EQUIPMNT LIST');

    let result = equipmentList.find(equipment => {
      return equipment.parts.some(
        (part: any) =>
          part?.id?.toString() === options?.equipmentId?.toString(),
      );
    });

    if (result) {
      return result.parts.find(
        (part: any) =>
          part?.id?.toString() === options?.equipmentId?.toString(),
      );
    } else {
      return null;
    }
  };

  return [getEquipment];
};

export default useGetEquipmentDetails;
