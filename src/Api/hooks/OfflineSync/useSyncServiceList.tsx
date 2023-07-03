import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import useGetDailyChecklists from '../Equipment/DailyCheckList/useGetDailyChecklists';
import usePostApi from '../usePostApi';
import {END_POINTS} from '../../constants';
import {clearOfflineServiceLog} from '../../../redux/reducers/OfflineReducer';

export interface RepairListInterface {
  data: any;
}
interface RepairListResponse {
  data: any;
  // Define the expected response properties here
}

const useSyncServiceList = (): [
  (data: RepairListInterface) => Promise<RepairListResponse>,
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
  const postSyncServiceList = async (data: RepairListInterface) => {
    let reqParams = data.data.reduce((result: any, item: any, index: any) => {
      const searchStrings = ['fluid_sticker_id', 'checklist'];
      const {
        equipment,
        fluid_resets,
        checklist_task,
        interval,
        fluid_stiker_log,
        is_archived,
        ...finalReqParams
      } = item;
      console.log(
        equipment,
        fluid_resets,
        interval,
        checklist_task,
        fluid_stiker_log,
        is_archived,
        'TEST========OBJ',
        finalReqParams,
      );
      Object.keys(finalReqParams).forEach(key => {
        let isFound = false;
        searchStrings.forEach(substring => {
          if (key.toString().includes(substring)) {
            isFound = true;
          }
        });
        if (isFound) {
          let finalKey = '';
          const parts = key.toString().split('[');
          console.log(parts, 'PARTS=====');
          const keyItem = parts[0]; // 'work'
          const keyIndex = '[' + parts[1];
          if (parts.length > 2) {
            const keyField = '[' + parts[2];
            finalKey =
              `service[${index}]` + `[${keyItem}]` + keyIndex + keyField;
          } else {
            finalKey = `service[${index}]` + `[${keyItem}]` + keyIndex;
          }
          console.log(finalKey, 'FINAL KEY');
          result[finalKey.toString()] = item[key];
        } else {
          result[`service[${index}][${key}]`] = item[key];
        }
      });
      return result;
    }, {});

    const response = await postApi({
      endPoint: END_POINTS.SYNC_SERVICE_LIST,
      params: reqParams,
      isForm: true,
    });

    if (response) {
      await getDailyChecklists({
        isLoader: true,
      });
      dispatch(clearOfflineServiceLog());
      toast.show(response.message);
      return response.message;
    }
    // return data;
  };

  return [postSyncServiceList, {errors}];
};

export default useSyncServiceList;
