import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {updateServiceDocList} from '../../../redux/reducers/PreventiveMaintenance/ServiceReducer';

export interface GetData {
  docId: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useDeleteRepairDocs = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const dispatch = useDispatch();
  const {repairDocsList} = useSelector(
    (state: RootState) => state.RepairReducer,
  );

  const deleteRepairDoc = async (options: GetData): Promise<GetResponse[]> => {
    const documents = repairDocsList.filter((docItem: any) => {
      return docItem?.id?.toString() !== options?.docId?.toString();
    });
    dispatch(updateServiceDocList(documents));
    return documents;
  };

  return [deleteRepairDoc];
};

export default useDeleteRepairDocs;
