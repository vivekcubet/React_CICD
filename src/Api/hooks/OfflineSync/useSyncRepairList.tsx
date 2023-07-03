import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import usePostApi from '../usePostApi';
import {END_POINTS} from '../../constants';
import {clearOfflineRepairLog} from '../../../redux/reducers/OfflineReducer';
import {useGetRepairList} from '..';

export interface RepairListInterface {
  data: any;
}
interface RepairListResponse {
  data: any;
  // Define the expected response properties here
}

const useSyncRepairList = (): [
  (data: RepairListInterface) => Promise<RepairListResponse>,
  {errors: any | null},
] => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [getRepairList] = useGetRepairList();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postSyncRepairList = async (data: RepairListInterface) => {
    try {
      let reqParams = data.data.reduce((result: any, item: any, index: any) => {
        //   result[`repair[${index}]`] = item;
        const {equipment, fluid_stiker_log, work_attachments, ...reqObject} =
          item;
        const searchStrings = [
          'fluid_sticker_id',
          'work_comment',
          'work_file',
          'work_files',
          'work_id',
          'work_name',
          'work_delete',
        ];
        console.log(
          reqObject,
          'REP ITEm======',
          equipment,
          fluid_stiker_log,
          work_attachments,
        );
        Object.keys(reqObject).forEach(key => {
          let isFound = false;
          searchStrings.forEach(substring => {
            if (key.toString().includes(substring)) {
              isFound = true;
            }
          });
          if (isFound) {
            const parts = key.toString().split('[');

            const keyItem = parts[0]; // 'work'
            const keyIndex = '[' + parts[1];
            console.log(parts, 'PARTS=====');
            let finalKey = `repair[${index}]` + `[${keyItem}]` + keyIndex;
            console.log(finalKey, 'FINAL KEY');
            result[finalKey.toString()] = item[key];
          } else {
            result[`repair[${index}][${key}]`] = item[key];
          }
        });
        return result;
      }, {});
      console.log(reqParams, 'REP OFFLINE PARAMS========');
      const response = await postApi({
        endPoint: END_POINTS.SYNC_REPAIR_LIST,
        params: reqParams,
        isForm: true,
      });

      if (response) {
        await getRepairList({
          isLoader: true,
        });
        dispatch(clearOfflineRepairLog());
        toast.show(response.message);
        return response.message;
      }
      return data;
    } catch (error) {
      console.log(error, 'Report post Error');
    }
  };

  return [postSyncRepairList, {errors}];
};

export default useSyncRepairList;
