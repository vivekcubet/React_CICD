import {useEffect, useState} from 'react';

import {useToast} from 'react-native-toast-notifications';
import {END_POINTS} from '../../../constants';
import useArchiveApi from '../../useArchiveApi';
import useGetFluidStickers from './useGetFluidStickers';
import usePostApi from '../../usePostApi';

export interface ArchiveStickerInterface {
  id: number;
  isArchive: boolean;
}

interface ArchiveResponse {
  data: any;
  // Define the expected response properties here
}

const useArchiveFluidSticker = (): [
  (data: ArchiveStickerInterface) => Promise<ArchiveResponse>,
  {errors: any | null},
] => {
  const [getFluidStickers] = useGetFluidStickers();
  const toast = useToast();
  const [errors, setError] = useState<any | null>(null);
  const [archiveData, {error}] = useArchiveApi();
  const [postApi] = usePostApi();
  useEffect(() => {
    setError(error);
  }, [error]);
  const archiveFluidSticker = async (data: ArchiveStickerInterface) => {
    console.log(data, 'ARCHIVE DATA=====');
    const response = data.isArchive
      ? await archiveData({
          endPoint:
            END_POINTS.ARCHIVE_FLUID_STICKER + '?id=' + data?.id?.toString(),
          params: {id: data?.id?.toString()},
        })
      : await postApi({
          endPoint: END_POINTS.UNARCHIVE_FLUID_STICKER,
          params: {id: data?.id?.toString()},
        });

    if (response) {
      console.log(response, 'TEXT=========');
      getFluidStickers({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [archiveFluidSticker, {errors}];
};

export default useArchiveFluidSticker;
