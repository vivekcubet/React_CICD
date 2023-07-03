import {useEffect, useState} from 'react';
import {END_POINTS} from '../../../constants';
import usePostApi from '../../usePostApi';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useGetFluidStickers from './useGetFluidStickers';
import useGetEquipments from '../Equipments/useGetEquipments';
export interface FluidStickerInterface {
  current_hour: string;
  type: string;
  date?: any;
  reference_id?: any;
}

interface FluidStickerResponse {
  data: any;
  // Define the expected response properties here
}

const useResetFluidSticker = (): [
  (data: FluidStickerInterface) => Promise<FluidStickerResponse>,
  {errors: any | null},
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const [getEquipments] = useGetEquipments();
  const toast = useToast();
  const [getFluidStickers] = useGetFluidStickers();
  const [errors, setError] = useState<any | null>(null);
  const [postApi, {error}] = usePostApi();

  useEffect(() => {
    setError(error);
  }, [error]);
  const resetFluidSticker = async (data: FluidStickerInterface) => {
    const reqParams = {
      ...data,
      company_id: userCompany?.company_id?.toString() || null,
    };
    const response = await postApi({
      endPoint: END_POINTS.RESET_FLUID_STICKER,
      params: reqParams,
      isForm: false,
    });
    if (response) {
      await getFluidStickers({
        isLoader: false,
      });
      await getEquipments({isLoader: true});
      toast.show(response.message);
      return response.message;
    }
  };

  return [resetFluidSticker, {errors}];
};

export default useResetFluidSticker;
