/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import Colors from '../../../../theme/Colors';
import SvgIcon from '../../../../assets/Icons/SvgIcon';
import {getHeight} from '../../../../theme/Constants';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import images from '../../../../assets/images';
import ServiceSticker from './ServiceSticker';
import {
  BackButton,
  KeyboardAwareScroll,
  LabelValue,
} from '../../../../components';
import EquipmentForm from '../EquipmentForm/EquipmentForm';
import screens from '../../../../navigation/screens';
import {useFocusEffect} from '@react-navigation/native';
import Attachments from './Attachments';
import FluidStickerSetUp from './FluidStickerSetUp';
import {useGetEquipmentDetails} from '../../../../utils/LocalDBHooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import DailyChecklist from './DailyChecklist';
import EquipmentTabMenu from './EquipmentTabMenu';
import {useGetEquipments, useGetFluidStickers} from '../../../../Api/hooks';

const EquipmentDetails = ({navigation}: any) => {
  const [getEquipments] = useGetEquipments();
  const [getFluidStickers] = useGetFluidStickers();
  const {selectedEquipment} = useSelector(
    (state: RootState) => state.globalReducer,
  );
  const {
    equipmentItem = null,
    intervalList = [],
    isLocked = false,
  } = selectedEquipment ? selectedEquipment : {};
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const [getEquipment] = useGetEquipmentDetails();
  const [isEdit, setEdit] = useState(false);
  const [equipment, setEquipment] = useState<any>(null);
  const updateSuccess = () => {
    setEdit(false);
    navigation.navigate(screens.equipmentList);
  };

  useFocusEffect(
    React.useCallback(() => {
      setEdit(false);
      getEquipmentDetails();
    }, [equipmentList, equipmentItem]),
  );
  useEffect(() => {
    refreshData();
  }, []);
  const getEquipmentDetails = async (): Promise<void> => {
    let equipmentRes = await getEquipment({equipmentId: equipmentItem?.id});
    setEquipment(equipmentRes);
    console.log(equipmentRes, 'EQUIPMENT======RES');
  };
  const refreshData = async () => {
    await getEquipments({isLoader: false});
    await getFluidStickers({isLoader: true});
  };
  return (
    <View
      style={[{backgroundColor: Colors.white}, CommonStyles.containerFlex1]}>
      <View style={CommonStyles.mainContainer}>
        <KeyboardAwareScroll
          onRefreshing={() => {
            refreshData();
          }}>
          <BackButton
            onPress={() => {
              if (isEdit) {
                setEdit(false);
              } else {
                navigation.goBack();
              }
            }}
          />
          {equipment ? (
            <>
              {isEdit ? (
                <View style={{paddingBottom: getHeight(5)}}>
                  <EquipmentForm
                    onCancelPress={() => {
                      setEdit(false);
                    }}
                    onSuccess={() => updateSuccess()}
                    equipment={equipment}
                    isEdit={true}
                  />
                </View>
              ) : (
                <>
                  <View style={styles.titleContainer}>
                    <Text style={CommonStyles.font45bold}>
                      Equipment Details
                    </Text>
                    {(equipment?.is_archived !== 1 || isLocked) &&
                    roleType === 'cOwner' ? (
                      <TouchableOpacity
                        onPress={() => setEdit(true)}
                        style={[styles.iconContainer, CommonStyles.shadow]}>
                        <SvgIcon.EditIcon
                          width={getHeight(42)}
                          height={getHeight(42)}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <View style={[styles.imageContainer]}>
                    <FastImage
                      resizeMode={FastImage.resizeMode.cover}
                      style={styles.eqImage}
                      source={
                        equipment?.logo
                          ? {uri: equipment?.logo}
                          : images.equipment
                      }
                    />
                  </View>
                  <EquipmentTabMenu
                    intervalList={intervalList}
                    equipment={equipment}
                  />
                  <ServiceSticker equipment={equipment} />
                  <LabelValue
                    isBox={true}
                    label="Unit#"
                    value={equipment?.unit_no}
                  />
                  <LabelValue
                    isBox={true}
                    label="Type"
                    value={equipment?.category?.name}
                  />
                  <Attachments
                    editable={
                      (roleType === 'cOwner' || roleType === 'cTecnician') &&
                      equipment?.is_archived !== 1
                        ? true
                        : false
                    }
                    equipment={equipment}
                    attachmentList={equipment?.attachments}
                  />
                  <LabelValue
                    isBox={true}
                    label="Make"
                    value={equipment?.make}
                  />
                  <LabelValue
                    isBox={true}
                    label="Model"
                    value={equipment?.model}
                  />
                  <LabelValue
                    isBox={true}
                    label="Serial#"
                    value={equipment?.sl_no}
                  />
                  {roleType === 'cOwner' ? (
                    <>
                      <View style={styles.fluidTitleContainer}>
                        <Text style={styles.fluidTitle}>
                          Checklist & Fluid Setup
                        </Text>
                      </View>

                      <FluidStickerSetUp
                        equipment={equipment}
                        editable={
                          roleType === 'cOwner' && equipment?.is_archived !== 1
                            ? true
                            : false
                        }
                      />
                      <DailyChecklist
                        equipment={equipment}
                        editable={
                          roleType === 'cOwner' && equipment?.is_archived !== 1
                            ? true
                            : false
                        }
                      />
                    </>
                  ) : null}
                </>
              )}
            </>
          ) : null}
          <View style={{height: getHeight(5)}} />
        </KeyboardAwareScroll>
      </View>
    </View>
  );
};

export default EquipmentDetails;
