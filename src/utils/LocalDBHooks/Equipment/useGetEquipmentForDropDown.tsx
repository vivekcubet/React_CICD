import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetEquipmentForDropDown = (): [() => Promise<GetResponse[]>] => {
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  console.log(equipmentList, 'EQ LIST=====');
  const getEquipments = async (): Promise<GetResponse[]> => {
    const convertedArray = equipmentList.flatMap(item =>
      item.parts.map((part: any) => ({
        label: part.unit_no,
        value: part.id,
        equipment: part,
      })),
    );
    return convertedArray;
  };

  return [getEquipments];
};

export default useGetEquipmentForDropDown;
