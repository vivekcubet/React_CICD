import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  equipmentId: boolean;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetFluidStickersEquipment = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {fluidStickers} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );

  const getEquipmentStickers = async (
    options: GetData,
  ): Promise<GetResponse[]> => {
    console.log(options.equipmentId, 'EQUIPMENT LIST');

    const result: GetResponse[] = fluidStickers.filter((sticker: any) => {
      return (
        sticker.equipment_id?.toString() === options.equipmentId?.toString()
      );
    });

    return result;
  };

  return [getEquipmentStickers];
};

export default useGetFluidStickersEquipment;
