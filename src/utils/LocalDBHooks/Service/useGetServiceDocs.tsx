import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  serviceId: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetServiceDocs = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {serviceDocList} = useSelector(
    (state: RootState) => state.ServiceReducer,
  );

  const getServiceDocs = async (options: GetData): Promise<GetResponse[]> => {
    const documents = serviceDocList.filter((docItem: any) => {
      return docItem?.service_id?.toString() === options?.serviceId?.toString();
    });

    return documents;
  };

  return [getServiceDocs];
};

export default useGetServiceDocs;
