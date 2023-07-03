/* eslint-disable react-hooks/exhaustive-deps */
import {Text, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import CommonStyles from '../../../theme/CommonStyles';
import styles from './styles';
import {StickerResetItem} from '../../../components';
import {useGetFluidStickersEquipment} from '../../../utils/LocalDBHooks';
import {useAlert} from '../../../utils/hooks';
import {getHeight} from '../../../theme/Constants';
interface FluidInterface {
  equipment: any;
  disabled: boolean;
  updateResetArray?: any;
  updateUndoArray?: any;
  editData?: any;
}
const FluidStickers: FC<FluidInterface> = ({
  equipment,
  disabled = false,
  updateResetArray,
  updateUndoArray,
  editData = [],
}) => {
  const [getEquipmentStickers] = useGetFluidStickersEquipment();
  const {Alert, showAlert} = useAlert();
  const [equipmentStickers, setEquipmentStickers] = useState<any>([]);
  const [restedArray, setReset] = useState<any>(editData);
  const [undoArray, setUndo] = useState<any>([]);
  useEffect(() => {
    console.log(equipment, 'EQUIPMENT=========12345678');
    getStickerList();
  }, [equipment]);
  useEffect(() => {
    updateResetArray(restedArray);
    updateUndoArray(undoArray);
  }, [restedArray, undoArray]);
  useEffect(() => {
    console.log(editData, 'TEST======');
    setReset(editData);
  }, [editData]);
  const getStickerList = async () => {
    let res = await getEquipmentStickers({equipmentId: equipment?.id});
    console.log(res, 'FLUID stickers====', equipment?.id);
    setEquipmentStickers(res);
  };
  const updateFluidSticker = (type: string, id: any) => {
    showAlert('Fluid Sticker', 'Are you sure you want to ' + type + '?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Confirm',
        onPress: async () => {
          const resetData =
            type === 'reset'
              ? [...restedArray, id]
              : restedArray.filter(
                  (item: any) => item.toString() !== id.toString(),
                );

          const undoData =
            type === 'undo'
              ? [...undoArray, id]
              : undoArray.filter(
                  (item: any) => item.toString() !== id.toString(),
                );
          setUndo(undoData);
          setReset(resetData);
        },
      },
    ]);
  };
  return (
    <>
      {equipmentStickers && equipmentStickers.length > 0 ? (
        <View style={{marginBottom: getHeight(45)}}>
          <Text style={[CommonStyles.font45bold, styles.titleTxt]}>
            Fluid Sticker
          </Text>
          {equipmentStickers.map((item: any) => {
            let isRested = restedArray.find(
              (id: any) => id?.toString() === item?.id.toString(),
            );
            return (
              <StickerResetItem
                key={item?.id}
                onPress={() => {
                  updateFluidSticker(isRested ? 'undo' : 'reset', item?.id);
                  console.log('first');
                }}
                disabled={disabled}
                isReset={!isRested}
                label={item?.name}
              />
            );
          })}
        </View>
      ) : null}
      <Alert />
    </>
  );
};

export default FluidStickers;
