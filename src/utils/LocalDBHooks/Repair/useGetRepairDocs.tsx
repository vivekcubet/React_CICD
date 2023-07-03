import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  repairId: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetRepairDocs = (): [(options: GetData) => Promise<GetResponse[]>] => {
  const {repairDocsList} = useSelector(
    (state: RootState) => state.RepairReducer,
  );

  const getRepairDocs = async (options: GetData): Promise<GetResponse[]> => {
    const documents = repairDocsList.filter((docItem: any) => {
      return docItem?.repair_id?.toString() === options?.repairId?.toString();
    });

    return documents;
  };

  return [getRepairDocs];
};

export default useGetRepairDocs;
