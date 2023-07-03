import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {updateDocumentsList} from '../../../redux/reducers/Equipment/EquipmentReducer';

export interface GetData {
  docId: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useDeleteEquipmentDoc = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const dispatch = useDispatch();
  const {documentsList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );

  const deleteEquipmentDoc = async (
    options: GetData,
  ): Promise<GetResponse[]> => {
    const documents = documentsList.filter((docItem: any) => {
      console.log(documentsList, 'TROPPPPPPP', options);
      return docItem?.id?.toString() !== options?.docId?.toString();
    });
    dispatch(updateDocumentsList(documents));
    return documents;
  };

  return [deleteEquipmentDoc];
};

export default useDeleteEquipmentDoc;
