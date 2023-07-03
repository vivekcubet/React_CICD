import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useGetDailyChecklists from './useGetDailyChecklists';
export interface ChecklistInterface {
  name: string;
  description: string;
  isEdit?: boolean;
  equipment_Id?: any;
}

interface ChecklistResponse {
  data: any;
  // Define the expected response properties here
}

const usePostDailyChecklist = (): [
  (data: ChecklistInterface) => Promise<ChecklistResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const toast = useToast();
  const [getDailyChecklists] = useGetDailyChecklists();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postChecklist = async (data: ChecklistInterface) => {
    const {isEdit = false, ...dataWithoutIsEdit} = data;
    console.log(isEdit);
    const reqParams = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };
    console.log(JSON.stringify(reqParams), 'PARAMS========');
    const response = await postApi({
      endPoint: END_POINTS.CREATE_DAILY_CHECKLIST,
      params: reqParams,
      isForm: false,
    });

    if (response) {
      await getDailyChecklists({
        isLoader: true,
      });
      toast.show(response.message);
      return response.message;
    }
  };

  return [postChecklist, {errors}];
};

export default usePostDailyChecklist;
