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

const useDeleteServiceDoc = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const dispatch = useDispatch();
  const {serviceDocList} = useSelector(
    (state: RootState) => state.ServiceReducer,
  );

  const deleteServiceDoc = async (options: GetData): Promise<GetResponse[]> => {
    const documents = serviceDocList.filter((docItem: any) => {
      return docItem?.id?.toString() !== options?.docId?.toString();
    });
    dispatch(updateServiceDocList(documents));
    return documents;
  };

  return [deleteServiceDoc];
};

export default useDeleteServiceDoc;
