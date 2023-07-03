import {useEffect, useState} from 'react';
import {END_POINTS} from '../../constants';
import usePostApi, {PostData} from '../usePostApi';
import {useToast} from 'react-native-toast-notifications';

export interface DealerInterface {
  client_id: any[];
  dealer_id: string;
  isDelete?: boolean;
}

interface DealerResponse {
  data: any;
  // Define the expected response properties here
}

const useUpdateDealerClients = (): [
  (data: DealerInterface) => Promise<DealerResponse | undefined>,
  {errors: any | null},
] => {
  const toast = useToast();
  const [errors, setErrors] = useState<any | null>(null);
  const [postApi] = usePostApi();

  useEffect(() => {
    setErrors(null);
  }, []);

  const updateDealerClients = async (
    data: DealerInterface,
  ): Promise<DealerResponse | undefined> => {
    const reqParams = {
      ...data,
      //   company_id: userCompany?.company_id?.toString() || null,
    };
    toast.hideAll();
    const postData: PostData = {
      endPoint: data?.isDelete
        ? END_POINTS.DELETE_DEALER_CLIENTS
        : END_POINTS.ADD_DEALER_CLIENTS,
      params: reqParams,
      //   isForm: true,
    };

    try {
      const response = await postApi(postData);
      toast.show(response?.message);
      return response?.data;
    } catch (error: any) {
      console.log(error, 'ERROR===');
      setErrors(error.message);
    }
  };

  return [updateDealerClients, {errors}];
};

export default useUpdateDealerClients;
