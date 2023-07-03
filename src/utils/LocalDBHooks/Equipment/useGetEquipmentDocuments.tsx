import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  equipmentId: any;
  searchText?: string;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetEquipmentDocuments = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {documentsList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );

  const getEquipmentDocs = async (options: GetData): Promise<GetResponse[]> => {
    const {searchText = ''} = options;
    const documents = documentsList.filter((docItem: any) => {
      return (
        docItem?.equipment_id?.toString() === options?.equipmentId?.toString()
      );
    });
    const finalResults = documents.filter((entry: any) =>
      entry.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    return finalResults;
  };

  return [getEquipmentDocs];
};

export default useGetEquipmentDocuments;
