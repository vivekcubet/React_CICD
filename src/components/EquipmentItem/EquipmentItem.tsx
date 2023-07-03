/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
import LinkText from '../LinkText/LinkText';
import screens from '../../navigation/screens';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Fonts from '../../theme/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import TableComponent from '../TableComponent/TableComponent';
import {useArchiveEquipment} from '../../Api/hooks';
import {useAlert} from '../../utils/hooks';
import {updateEquipment} from '../../redux/reducers/GlobalReducer';
import {useGetEquipmentIntervals} from '../../utils/LocalDBHooks';
interface EquipmentItemInterface {
  equipment: any;
}
const EquipmentItem: FC<EquipmentItemInterface> = ({equipment = null}) => {
  const {selectedEquipment} = useSelector(
    (state: RootState) => state.globalReducer,
  );
  const [getEqIntervals] = useGetEquipmentIntervals();
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const {currentHourHistory} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const dispatch = useDispatch();
  const {Alert, showAlert} = useAlert();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [archiveEquipment] = useArchiveEquipment();
  const [intervalList, setIntervalList] = useState<any>([]);
  useEffect(() => {
    getEquipmentIntervals();
  }, [equipment, currentHourHistory, equipmentList]);
  useEffect(() => {
    if (selectedEquipment) {
      navigation.navigate(screens.equipmentDetails, {
        screen: screens.equipmentDetails,
        params: {
          equipmentItem: equipment,
          intervalList: intervalList,
        },
      });
    }
  }, [selectedEquipment]);
  const getEquipmentIntervals = async () => {
    let eqIntervals = await getEqIntervals({equipment: equipment});
    console.log(eqIntervals, 'INTERVALS=======', equipment);
    setIntervalList(eqIntervals);
  };

  const archiveUpdateEquipment = async (
    equipmentId: any,
    isArchived: any,
  ): Promise<void> => {
    let archiveTxt = isArchived === 1 ? 'unarchive' : 'archive';
    showAlert('Warning', 'Are you want to ' + archiveTxt + ' the equipment?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await archiveEquipment({
            id: equipmentId,
            isArchive: isArchived === 1 ? false : true,
          });
          console.log(response);
        },
      },
    ]);
  };
  return (
    <>
      {equipment?.is_archived !== 1 || roleType === 'cOwner' ? (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={2} style={styles.modelName}>
              {equipment?.equipment_model?.name} -
              <Text style={Fonts.B700}> {'Unit ' + equipment?.unit_no}</Text>
            </Text>
            <LinkText
              isNormal={true}
              color={Colors.btnOrange}
              onPress={() => {
                dispatch(
                  updateEquipment({
                    equipmentItem: equipment,
                    intervalList: intervalList,
                  }),
                );
              }}
              label="View more"
            />
          </View>

          <Text numberOfLines={2} style={styles.modelSubName}>
            {equipment?.make} - {equipment?.model}
          </Text>
          <TableComponent
            titles={['Intervals', 'Hours until service']}
            tableContents={intervalList}
          />
          <View>
            {roleType === 'cOwner' ? (
              <TouchableOpacity
                onPress={() =>
                  archiveUpdateEquipment(equipment?.id, equipment?.is_archived)
                }
                style={[
                  styles.archiveButton,
                  {
                    backgroundColor:
                      equipment?.is_archived === 1
                        ? Colors.appYellow
                        : Colors.errorColor,
                  },
                ]}>
                <Text
                  style={[
                    styles.archiveText,
                    {
                      color:
                        equipment?.is_archived === 1
                          ? Colors.black
                          : Colors.white,
                    },
                  ]}>
                  {equipment?.is_archived === 1 ? 'Unarchive' : 'Archive'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Alert />
        </View>
      ) : null}
    </>
  );
};

export default EquipmentItem;
