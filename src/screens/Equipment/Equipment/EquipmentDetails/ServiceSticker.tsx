/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {getHeight} from '../../../../theme/Constants';
import Colors from '../../../../theme/Colors';
import {LabelValue, TableComponent} from '../../../../components';
import {
  useGetEquipmentIntervals,
  useGetFluidStickersEquipment,
} from '../../../../utils/LocalDBHooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';

interface ServiceStickerInterface {
  equipment: any;
}
const ServiceSticker: FC<ServiceStickerInterface> = ({equipment = null}) => {
  const {fluidStickers} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const {currentHourHistory} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const [getEqIntervals] = useGetEquipmentIntervals();
  const [getEquipmentStickers] = useGetFluidStickersEquipment();
  const [equipmentStickers, setEquipmentStickers] = useState<any>([]);
  const [currentHour, setHour] = useState(equipment?.current_hour);
  const [intervalList, setIntervalList] = useState<any>([]);
  useEffect(() => {
    console.log(equipment, 'EQUIPMENT========', currentHourHistory);
    getStickerList();
    getEquipmentIntervals();
    let hour =
      currentHourHistory[equipment.id.toString()] &&
      new Date(equipment?.last_hour_updated) <
        new Date(currentHourHistory[equipment.id.toString()]?.date)
        ? currentHourHistory[equipment.id.toString()]?.hours
        : equipment?.current_hour;
    setHour(hour);
  }, [fluidStickers, equipment]);
  const getStickerList = async () => {
    let res = await getEquipmentStickers({equipmentId: equipment?.id});
    let fluidStickerData = res.map((item: any) => {
      console.log(
        item,
        'ITEMFLUID====',
        item?.last_reset_hour,
        'pppppp',
        Number(equipment?.current_hour) - Number(item?.last_reset_hour),
      );
      if (item.is_archived === 0) {
        return {
          values: [
            item.name,
            Number(item.interval) -
              (Number(equipment?.current_hour) - Number(item?.last_reset_hour)),
            // Number(item.remaining_hour) < 0 ? 0 : item.remaining_hour,
            // item.remaining_hour,
            item.interval,
          ],
        };
      }
    });
    setEquipmentStickers(fluidStickerData);
  };
  const getEquipmentIntervals = async () => {
    let eqIntervals = await getEqIntervals({equipment: equipment});
    console.log(eqIntervals, 'INTERVALS=======', equipment);
    setIntervalList(eqIntervals);
  };
  return (
    <View style={{marginBottom: getHeight(45)}}>
      <Text style={[CommonStyles.font45bold, {fontSize: getHeight(55)}]}>
        Service Sticker
      </Text>
      <View
        style={{
          backgroundColor: Colors.backgroundGray,
          padding: 15,
          marginTop: getHeight(75),
          borderRadius: 8,
        }}>
        <LabelValue label="Current hour" value={currentHour + ' hr'} />
        <LabelValue
          label="Last Service Completed"
          value={equipment?.last_service_completed + ' hr'}
        />
        <LabelValue
          label="Last Service Interval Completed"
          value={equipment?.last_interval_completed + ' hr'}
        />
        {intervalList.length > 0 ? (
          <TableComponent
            titles={['Intervals', 'Hours until service']}
            tableContents={intervalList}
          />
        ) : null}
        {equipmentStickers.length > 0 ? (
          <TableComponent
            titles={['Fluid Sticker', 'Remain', 'Interval']}
            tableContents={equipmentStickers}
          />
        ) : null}
      </View>
    </View>
  );
};

export default ServiceSticker;
