/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {getHeight, getWidth} from '../../../../theme/Constants';
import Colors from '../../../../theme/Colors';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  ArchiveLabelItem,
  FormButton,
  InputText,
  LinkText,
} from '../../../../components';
import {
  useArchiveFluidSticker,
  useGetFluidStickers,
  usePostFluidSticker,
} from '../../../../Api/hooks';
import {Formik} from 'formik';
import {fluidStickerValidation} from '../../../../utils/validations';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {useGetFluidStickersEquipment} from '../../../../utils/LocalDBHooks';
import {useAlert} from '../../../../utils/hooks';
interface FluidStickerInterface {
  editable?: boolean;
  equipment: any;
}
const FluidStickerSetUp: FC<FluidStickerInterface> = ({
  editable = false,
  equipment = null,
}) => {
  const {Alert, showAlert} = useAlert();
  const {fluidStickers} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const {fluidResetLog} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [getFluidStickers] = useGetFluidStickers();
  const [postFluidSticker] = usePostFluidSticker();
  const [archiveFluidSticker] = useArchiveFluidSticker();
  const [getEquipmentStickers] = useGetFluidStickersEquipment();
  const [equipmentStickers, setEquipmentStickers] = useState<any>([]);
  useEffect(() => {
    initialLoad();
  }, []);
  useEffect(() => {
    console.log(fluidResetLog, 'FluidLogTEST======');
  }, []);
  const initialLoad = async () => {
    const res = await getFluidStickers({
      isLoader: true,
    });
    console.log(res);
  };
  useEffect(() => {
    getStickerList();
  }, [fluidStickers, equipment]);
  const getStickerList = async () => {
    let res = await getEquipmentStickers({equipmentId: equipment?.id});
    console.log(res, 'FLUID stickers====', equipment?.id);
    setEquipmentStickers(res);
  };
  const submitFluidSticker = async (values: any, resetForm: any) => {
    setAddVisible(false);
    let response = await postFluidSticker({
      equipmentId: equipment?.id,
      ...values,
    });
    if (response) {
      resetForm();
    } else {
      setAddVisible(true);
    }
  };
  const archiveUpdateSticker = async (sticker: any, isArchived: any) => {
    let archiveTxt = isArchived === 1 ? 'unarchive' : 'archive';
    showAlert(
      'Warning',
      'Are you want to ' + archiveTxt + ' the fluid sticker?',
      [
        {text: 'Cancel', onPress: () => null},
        {
          text: 'Confirm',
          onPress: async () => {
            const response = await archiveFluidSticker({
              id: sticker?.id,
              isArchive: isArchived === 1 ? false : true,
            });
            console.log(response);
          },
        },
      ],
    );
  };
  return (
    <View
      style={{
        backgroundColor: Colors.backgroundGray,
        padding: 15,
        marginTop: getHeight(75),
        borderRadius: 8,
      }}>
      <View
        style={[
          CommonStyles.flexRowContainer,
          {justifyContent: 'space-between'},
        ]}>
        <Text style={[CommonStyles.font45bold, {fontSize: getHeight(55)}]}>
          Fluid Sticker SetUp
        </Text>
        {editable ? (
          <LinkText
            color={Colors.btnOrange}
            onPress={() => setAddVisible(true)}
            label="Add new+"
          />
        ) : null}
      </View>
      <FlatList
        data={equipmentStickers}
        renderItem={({item}: any) => {
          return (
            <ArchiveLabelItem
              isEditable={editable}
              isArchive={item?.is_archived === 1 ? true : false}
              onPress={() => archiveUpdateSticker(item, item?.is_archived)}
              btnName={item?.is_archived === 1 ? 'Unarchive' : 'Archive'}
              label={item?.name}
            />
          );
        }}
      />
      <Modal style={{height: getHeight(1)}} transparent visible={addVisible}>
        <ScrollView>
          <View style={{height: getHeight(1)}}>
            <View
              style={[
                CommonStyles.containerFlex1,
                {
                  backgroundColor: Colors.transparentBlack,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <View
                style={{
                  width: getWidth(1.1),
                  backgroundColor: Colors.white,
                  padding: getWidth(18),
                  borderRadius: 10,
                  justifyContent: 'center',
                }}>
                <View style={styles.closeContainer}>
                  <Text style={styles.modalTitle}>Add Fluid Sticker Items</Text>
                </View>
                <Formik
                  initialValues={{
                    name: '',
                    interval: '',
                    equipment_id: equipment?.id,
                  }}
                  validationSchema={fluidStickerValidation}
                  onSubmit={(values, {resetForm}) => {
                    submitFluidSticker(values, resetForm);
                  }}>
                  {({
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    resetForm,
                    setFieldValue,
                    touched,
                    values,
                    errors,
                  }) => (
                    <>
                      <InputText
                        value={values.name}
                        PlaceHolder="Enter name"
                        label="Name"
                        maxLength={30}
                        onBlur={handleBlur('name')}
                        onChange={handleChange('name')}
                        error={
                          touched.name && errors.name
                            ? errors.name.toString()
                            : ''
                        }
                      />
                      <InputText
                        value={values.interval}
                        PlaceHolder="Enter interval"
                        label="Interval"
                        maxLength={30}
                        onBlur={handleBlur('interval')}
                        keyboardType={'number-pad'}
                        onChange={(value: string) => {
                          setFieldValue('interval', value.replace(/\D/g, ''));
                        }}
                        error={
                          touched.interval && errors.interval
                            ? errors.interval.toString()
                            : ''
                        }
                      />
                      <View
                        style={[
                          CommonStyles.flexRowContainer,
                          {marginTop: getHeight(45)},
                        ]}>
                        <View style={CommonStyles.containerFlex1}>
                          <FormButton
                            onPress={() => {
                              resetForm();
                              setAddVisible(false);
                            }}
                            label="Cancel"
                          />
                        </View>
                        <View
                          style={[
                            CommonStyles.containerFlex1,
                            {paddingLeft: getWidth(40)},
                          ]}>
                          <FormButton
                            isYellow={true}
                            onPress={() => handleSubmit()}
                            label="Confirm"
                          />
                        </View>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
      <Alert />
    </View>
  );
};
const styles = StyleSheet.create({
  closeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  closeBtn: {
    height: getHeight(22),
    width: getHeight(22),
    alignItems: 'flex-end',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: getHeight(45),
    fontWeight: '600',
    fontFamily: 'Inter',
    marginBottom: getHeight(35),
    color: Colors.black,
  },
});
export default FluidStickerSetUp;
