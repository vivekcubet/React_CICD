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
  useArchiveDailyChecklist,
  useGetDailyChecklists,
  useGetEquipments,
  usePostDailyChecklist,
} from '../../../../Api/hooks';
import {Formik} from 'formik';
import {checkListValidation} from '../../../../utils/validations';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {useGetEquipmentChecklist} from '../../../../utils/LocalDBHooks';
import {useAlert} from '../../../../utils/hooks';
interface DailyChecklistInterface {
  editable?: boolean;
  equipment: any;
}
const DailyChecklist: FC<DailyChecklistInterface> = ({
  editable = false,
  equipment = null,
}) => {
  const {Alert, showAlert} = useAlert();
  const {dailyChecklists} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [getDailyChecklists] = useGetDailyChecklists();
  const [postChecklist] = usePostDailyChecklist();
  const [getEquipments] = useGetEquipments();
  const [archiveDailyChecklist] = useArchiveDailyChecklist();
  const [getEquipmentChecklist] = useGetEquipmentChecklist();
  const [equipmentChecklist, setEquipmentChecklist] = useState<any>([]);
  useEffect(() => {
    initialLoad();
  }, []);
  const initialLoad = async () => {
    const res = await getDailyChecklists({
      isLoader: true,
    });
    console.log(res);
  };
  useEffect(() => {
    getCheckListItems();
  }, [dailyChecklists, equipment]);
  const getCheckListItems = async () => {
    let res = await getEquipmentChecklist({equipmentId: equipment?.id});

    setEquipmentChecklist(res);
  };
  const submitCheckList = async (values: any, resetForm: any) => {
    setAddVisible(false);
    let response = await postChecklist({
      equipmentId: equipment?.id,
      ...values,
    });
    if (response) {
      resetForm();
      getEquipments({isLoader: true});
    } else {
      setAddVisible(true);
    }
  };
  const archiveUpdateChecklist = async (checkItem: any, isArchived: any) => {
    let archiveTxt = isArchived === 1 ? 'unarchive' : 'archive';
    showAlert(
      'Warning',
      'Are you want to ' + archiveTxt + ' the checklist data?',
      [
        {text: 'Cancel', onPress: () => null},
        {
          text: 'Confirm',
          onPress: async () => {
            const response = await archiveDailyChecklist({
              id: checkItem?.id,
              isArchive: isArchived === 1 ? false : true,
            });
            console.log(response);
            getEquipments({isLoader: true});
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
          Daily Checklist Items
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
        data={equipmentChecklist}
        renderItem={({item}: any) => {
          return (
            <ArchiveLabelItem
              isEditable={editable}
              isArchive={item?.is_archived === 1 ? true : false}
              onPress={() => archiveUpdateChecklist(item, item?.is_archived)}
              btnName={item?.is_archived === 1 ? 'Unarchive' : 'Archive'}
              label={item?.name}
            />
          );
        }}
      />
      <Modal transparent visible={addVisible}>
        <ScrollView>
          <View style={{minHeight: getHeight(1)}}>
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
                  <Text style={styles.modalTitle}>Daily Checklist Items</Text>
                </View>
                <Formik
                  initialValues={{
                    name: '',
                    description: '',
                    equipment_id: equipment?.id,
                  }}
                  validationSchema={checkListValidation}
                  onSubmit={(values, {resetForm}) => {
                    submitCheckList(values, resetForm);
                  }}>
                  {({
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    resetForm,
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
                      {/* <InputText
                      value={values.description}
                      isTextArea={true}
                      PlaceHolder="Enter description"
                      label="Description"
                      onBlur={handleBlur('description')}
                      onChange={handleChange('description')}
                      error={
                        touched.description && errors.description
                          ? errors.description.toString()
                          : ''
                      }
                    /> */}
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
export default DailyChecklist;
