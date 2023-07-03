import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useGetFluidStickers from './useGetFluidStickers';
export interface FluidStickerInterface {
  name: string;
  interval: string;
  isEdit?: boolean;
  equipment_Id?: any;
}

interface FluidStickerResponse {
  data: any;
  // Define the expected response properties here
}

const usePostFluidSticker = (): [
  (data: FluidStickerInterface) => Promise<FluidStickerResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);

  const toast = useToast();
  const [getFluidStickers] = useGetFluidStickers();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const postFluidSticker = async (data: FluidStickerInterface) => {
    const {isEdit = false, ...dataWithoutIsEdit} = data;
    console.log(isEdit);
    const reqParams = {
      ...dataWithoutIsEdit,
      company_id: userCompany?.company_id?.toString() || null,
    };
    console.log(JSON.stringify(reqParams), 'PARAMS========');
    const response = await postApi({
      endPoint: END_POINTS.ADD_FLUID_STICKER,
      params: reqParams,
      isForm: false,
    });

    if (response) {
      await getFluidStickers({
        isLoader: true,
      });
      toast.show(response.message);
      return response.message;
    }
  };

  return [postFluidSticker, {errors}];
};

export default usePostFluidSticker;
