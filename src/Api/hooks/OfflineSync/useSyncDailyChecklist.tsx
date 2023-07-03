import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import useGetDailyChecklists from '../Equipment/DailyCheckList/useGetDailyChecklists';
import usePostApi from '../usePostApi';
import {END_POINTS} from '../../constants';
import {clearOfflineDailyLog} from '../../../redux/reducers/OfflineReducer';

export interface ChecklistInterface {
  data: any;
}
interface ChecklistResponse {
  data: any;
  // Define the expected response properties here
}

const usePostSyncDailyChecklist = (): [
  (data: ChecklistInterface) => Promise<ChecklistResponse>,
  {errors: any | null},
] => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [getDailyChecklists] = useGetDailyChecklists();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postSyncChecklist = async (data: ChecklistInterface) => {
    let reqParams = {day_check: data.data};
    console.log(reqParams, 'PARAMS========');
    const response = await postApi({
      endPoint: END_POINTS.SYNC_DAILY_CHECKLIST,
      params: reqParams,
      isForm: false,
    });

    if (response) {
      await getDailyChecklists({
        isLoader: true,
      });
      dispatch(clearOfflineDailyLog());
      toast.show(response.message);
      return response.message;
    }
    // return data;
  };

  return [postSyncChecklist, {errors}];
};

export default usePostSyncDailyChecklist;
