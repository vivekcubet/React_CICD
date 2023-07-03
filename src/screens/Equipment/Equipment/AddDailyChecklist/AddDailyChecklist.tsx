/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../../../../theme/Colors';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  CheckLabelItem,
  FormButton,
  Icon,
  InputText,
  KeyboardAwareScroll,
} from '../../../../components';
import {getHeight, getWidth} from '../../../../theme/Constants';
import formStyles from '../../../../theme/FormStyles';
import styles from './styles';
import {Formik} from 'formik';
import {addDailyCheckValidation} from '../../../../utils/validations';
import {useAddDailyChecklist, useGetChecklistLog} from '../../../../Api/hooks';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {useChecklistLogByDate} from '../../../../utils/LocalDBHooks';
const AddDailyChecklist = ({route, navigation}: any) => {
  const [getChecklistData] = useGetChecklistLog();
  const [getChecklistLog] = useChecklistLogByDate();

  const {equipmentList, checklistLog} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const formikRef = useRef<any>();
  const {equipment = null} = route.params ? route.params : {};
  const {check_llist_log_today = null} = equipment ? equipment : null;
  const [addChecklist] = useAddDailyChecklist();
  const [eqChecklist, setEquipmentChecklist] = useState<any>([]);
  const [checkedData, setCheckUpdates] = useState<any>([]);
  const [date, setDate] = useState<any>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [checkListLog, setChecklistLog] = useState<any>(null);
  const [isToday, setIsToday] = useState<any>(true);
  const [taskError, setTaskError] = useState<any>('');
  useEffect(() => {
    getCheckListItems();
    getChecklistDateData();
  }, []);
  const getChecklistDateData = async () => {
    await getChecklistData({isLoader: true});
  };
  useEffect(() => {
    console.log(equipment, 'EQUIPMENT====');
    getDateData();
  }, [checklistLog, equipment, date, equipmentList]);
  const getDateData = async () => {
    let res = await getChecklistLog({
      date: new Date(date),
      equipmentId: equipment?.id,
    });
    if (res.length > 0) {
      setChecklistLog(res[0]);
    } else {
      setChecklistLog(null);
    }
  };
  useEffect(() => {
    if (checkListLog) {
      configureEditData();
    } else {
      setCheckUpdates([]);
    }
    formikRef.current?.setFieldValue(
      'hours',
      checkListLog
        ? checkListLog?.hours.toString()
        : equipment.current_hour.toString(),
    );
    formikRef.current?.setFieldValue(
      'comment',
      checkListLog ? checkListLog?.comment.toString() : '',
    );
  }, [checkListLog]);
  const getCheckListItems = async () => {
    setEquipmentChecklist(equipment?.check_list);
  };
  const configureEditData = async () => {
    let checkData = checkListLog?.checklist_log
      ?.filter((item: any) => item.is_checked === 1)
      .map((item: any) => item.checklist_id);
    console.log(checkListLog, 'DATA========LOG', checkData);
    setCheckUpdates(checkData);
  };
  const toggleItem = (itemId: any) => {
    setTaskError('');
    const updatedData = checkedData.includes(itemId)
      ? checkedData.filter((id: any) => id !== itemId)
      : [...checkedData, itemId];
    setCheckUpdates(updatedData);
    console.log(updatedData);
  };
  const addDailyChecklist = async (values: any, resetForm: any) => {
    if (checkedData.length < 1) {
      setTaskError('Tasks is required');
      return;
    }
    let is_checked: any = [];
    let checklist_id: any = [];
    await eqChecklist.map((item: any) => {
      checklist_id.push(item.id);
      is_checked.push(checkedData.includes(item.id) ? 1 : 0);
    });
    let params = {
      ...values,
      is_checked,
      checklist_id,
    };
    params = {...params, id: check_llist_log_today?.id, isEdit: true};
    let response = await addChecklist(params);
    if (response) {
      resetForm();
      navigation.goBack();
    }
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: any) => {
    setDate(new Date(selectedDate));
    hideDatePicker();
  };
  useEffect(() => {
    if (
      moment(date).format('YYYY-MM-DD').toString() ===
      moment().format('YYYY-MM-DD').toString()
    ) {
      setIsToday(true);
    } else {
      setIsToday(false);
    }
  });
  return (
    <View style={[CommonStyles.mainContainer, {padding: getWidth(28)}]}>
      <KeyboardAwareScroll>
        <BackButton />
        <View style={formStyles.titleContainer}>
          <Text style={formStyles.title}>{'Daily Checklist'}</Text>
          <TouchableOpacity
            onPress={() => {
              setDatePickerVisibility(!isDatePickerVisible);
            }}
            style={styles.datePickerView}>
            <View style={{flex: 4, alignItems: 'center'}}>
              <Text style={{color: Colors.black, fontSize: getHeight(55)}}>
                {moment(new Date(date)).format('DD MMM YYYY')}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Icon
                color={Colors.black}
                family="Feather"
                iconName="chevron-down"
              />
            </View>
          </TouchableOpacity>
        </View>
        {moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ||
        checkListLog ? (
          <Formik
            innerRef={formikRef}
            initialValues={{
              date: new Date().toISOString(),
              equipment_id: equipment?.id,
              comment: '',
              hours: equipment.current_hour,
            }}
            validationSchema={addDailyCheckValidation}
            onSubmit={(values, {resetForm}) => {
              addDailyChecklist(values, resetForm);
            }}>
            {({
              handleSubmit,
              handleBlur,
              touched,
              values,
              errors,
              setFieldValue,
              handleChange,
            }) => (
              <>
                <View style={[CommonStyles.formContainer]}>
                  <View style={styles.checkTitle}>
                    <Text
                      style={[
                        CommonStyles.font45bold,
                        {
                          fontSize: getHeight(55),
                          color: Colors.black,
                        },
                      ]}>
                      Tasks
                    </Text>
                  </View>
                  <View style={{marginBottom: getHeight(45)}}>
                    {eqChecklist.map((item: any) => {
                      return (
                        <>
                          {checkedData.includes(item?.id) ||
                          item?.is_archived === 0 ? (
                            <CheckLabelItem
                              editable={isToday}
                              key={item.id}
                              label={item?.name}
                              checked={checkedData.includes(item?.id)}
                              onPress={() => {
                                toggleItem(item?.id);
                              }}
                            />
                          ) : null}
                        </>
                      );
                    })}
                    {taskError ? (
                      <Text
                        style={{
                          marginTop: getHeight(120),
                          marginLeft: getHeight(60),
                          fontSize: getHeight(65),
                          color: Colors.errorColor,
                        }}>
                        {taskError}
                      </Text>
                    ) : null}
                  </View>

                  <InputText
                    isClear={true}
                    editable={isToday}
                    value={values.hours}
                    maxLength={15}
                    keyboardType={'numeric'}
                    PlaceHolder="Enter hours"
                    label="Equipment hours"
                    onBlur={handleBlur('hours')}
                    onChange={(value: string) => {
                      let sanitizedValue = value.replace(/[^\d.]+/g, '');
                      sanitizedValue =
                        sanitizedValue === '.' ? '0.0' : sanitizedValue;
                      setFieldValue('hours', sanitizedValue);
                    }}
                    error={
                      touched.hours && errors.hours
                        ? errors.hours.toString()
                        : ''
                    }
                  />
                  <InputText
                    editable={isToday}
                    value={values.comment}
                    isTextArea={true}
                    PlaceHolder="Enter comments"
                    label="Comments"
                    onBlur={handleBlur('comment')}
                    onChange={handleChange('comment')}
                    error={
                      touched.comment && errors.comment
                        ? errors.comment.toString()
                        : ''
                    }
                  />
                  {moment(date).format('YYYY-MM-DD') ===
                  moment(new Date()).format('YYYY-MM-DD') ? (
                    <View style={styles.btnContainer}>
                      <FormButton
                        isYellow={true}
                        onPress={() => {
                          if (checkedData.length < 1) {
                            setTaskError('Tasks is required');
                          }
                          handleSubmit();
                        }}
                        label={'COMPLETE CHECKLIST'}
                      />
                    </View>
                  ) : null}
                </View>
              </>
            )}
          </Formik>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: getHeight(2),
            }}>
            <Text
              style={{
                height: getHeight(45),
                fontWeight: '500',
                color: Colors.black,
              }}>
              Records not found
            </Text>
          </View>
        )}
      </KeyboardAwareScroll>
      <DateTimePickerModal
        maximumDate={new Date()}
        date={date}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default AddDailyChecklist;
