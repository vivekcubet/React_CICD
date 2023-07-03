import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  equipmentId: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetEquipmentById = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );

  const getEquipment = async (options: GetData): Promise<GetResponse[]> => {
    const equipment = equipmentList
      .flatMap((item: any) => item.parts)
      .find(part => part.id.toString() === options.equipmentId.toString());
    return equipment ? equipment : null;
  };

  return [getEquipment];
};

export default useGetEquipmentById;
