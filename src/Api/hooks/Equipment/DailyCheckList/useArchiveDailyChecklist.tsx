import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {END_POINTS} from '../../../constants';
import useArchiveApi from '../../useArchiveApi';
import useGetDailyChecklists from './useGetDailyChecklists';
import usePostApi from '../../usePostApi';

export interface ArchiveChecklistInterface {
  id: number;
  isArchive: boolean;
}

interface CheckListResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveDailyChecklist = (): [
  (data: ArchiveChecklistInterface) => Promise<CheckListResponse>,
  {errors: any | null},
] => {
  const [getDailyChecklists] = useGetDailyChecklists();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();
  const [postApi] = usePostApi();
  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveDailyChecklist = async (data: ArchiveChecklistInterface) => {
    console.log(data, 'ARCHIVE DATA=====');
    const response = data.isArchive
      ? await archiveData({
          endPoint:
            END_POINTS.ARCHIVE_DAILY_CHECKLIST + '?id=' + data?.id?.toString(),
          params: {id: data?.id?.toString()},
        })
      : await postApi({
          endPoint: END_POINTS.UNARCHIVE_DAILY_CHECKLIST,
          params: {id: data?.id?.toString()},
        });

    if (response) {
      console.log(response, 'TEXT=========');
      getDailyChecklists({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveDailyChecklist, {errors}];
};

export default useArchiveDailyChecklist;
