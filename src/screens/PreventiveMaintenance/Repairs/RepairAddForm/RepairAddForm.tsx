/* eslint-disable react-hooks/exhaustive-deps */
import {Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  BackButton,
  DatePicker,
  DeleteButton,
  DropDown,
  FormButton,
  InputText,
  KeyboardAwareScroll,
} from '../../../../components';
import CommonStyles from '../../../../theme/CommonStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import styles from '../../../../theme/FormStyles';
import {Formik} from 'formik';
import moment from 'moment';
import {repairValidation} from '../../../../utils/validations';
import {
  useGetEquipmentForDropDown,
  useGetRepairDocs,
} from '../../../../utils/LocalDBHooks';
import FluidStickers from '../../FluidSticker/FluidStickers';
import WorkData from './WorkData';
import {usePostRepair} from '../../../../Api/hooks';
import screens from '../../../../navigation/screens';
import getFilenameFromUrl from '../../../../utils/helpers/getFileNameFromUrl';
const RepairAddForm = ({route}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getRepairDocs] = useGetRepairDocs();
  const [getEquipments] = useGetEquipmentForDropDown();
  const [postRepair] = usePostRepair();
  const {
    isFromList = false,
    repair = null,
    isNew = null,
    isAdd = null,
    isView = null,
    status = null,
    isArchived = false,
  } = route.params ? route.params : {};
  const formikRef = useRef<any>();
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);

  const [isEdit, setEdit] = useState<any>(false);
  const [editFluidData, setEditFluid] = useState<any>([]);
  const [fluidResetData, setResetData] = useState<any>([]);
  const [fluidUndoData, setUndoData] = useState<any>([]);
  const [workError, setWrkError] = useState<any>('');
  const [workList, setWorkList] = useState<any>([]);
  const [equipmentList, setEQList] = useState<any>([]);
  const [workDeleteIds, setWrkDeleteIds] = useState<any>([]);
  const [repairDocs, setRepairDocs] = useState<any>([]);
  const [equipment, setEquipment] = useState<any>(route?.params?.equipment);
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
    }, []),
  );
  useEffect(() => {
    console.log(equipment, 'EQUIPMENT====REPAIr', repair);
    initialSetup();
    getRepairDocuments();
  }, [repair]);
  useEffect(() => {
    if (isNew || isAdd || isEdit) {
      formikRef.current?.setFieldValue(
        'equipment_hours',
        equipment?.current_hour ? equipment?.current_hour.toString() : '',
      );
    }
  }, [equipment, isEdit]);
  const initialSetup = async () => {
    let equipments = await getEquipments();
    setEQList(equipments);
    let restData: any = [];
    if (isFromList) {
      restData = repair?.fluid_stiker_log.map((sticker: any) => {
        return sticker?.fluid_sticker_id;
      });
    }
    console.log(repair?.work_attachments, 'WORK LIST========');
    if (repair) {
      let workDataList = await repair?.work_attachments.map((workItem: any) => {
        console.log(workItem, 'WORK DATA=====');
        return {
          id: workItem?.id,
          work_name: workItem?.work_name,
          work_comment: workItem?.work_comment,
          is_new: false,
          work_file: workItem?.work_file?.uri
            ? workItem?.work_file
            : {
                name: getFilenameFromUrl(workItem?.work_file),
                uri: workItem?.work_file,
              },
        };
      });
      console.log(workDataList, 'WORK LIST========');
      setWorkList(workDataList);
    }

    setEditFluid(restData);
  };
  const getRepairDocuments = async () => {
    if (repair) {
      let documents = await getRepairDocs({repairId: repair?.id});
      setRepairDocs(documents);
    }
  };
  const updateRepair = async (values: any, resetForm: any) => {
    console.log(values);
    let fluid_sticker_id = {};
    let work_delete = {};
    let undo_fluid_sticker_reset = {};
    const workData: any = {};
    workList.forEach((item: any, index: any) => {
      Object.entries(item).forEach(([key, value]) => {
        let valueData: any = value;
        console.log(key, 'ITEm======', value);
        if (key === 'id' && !value) {
          return;
        } else {
          const newKey = `${key === 'id' ? 'work_id' : key}[${index}]`;
          workData[newKey] = valueData;
        }
      });
    });
    console.log(workData, 'WRK DATA=========', workList);

    if (fluidResetData.length > 0) {
      fluid_sticker_id = fluidResetData.reduce(
        (result: any, item: any, index: any) => {
          result[`fluid_sticker_id[${index}]`] = item;
          return result;
        },
        {},
      );
    }
    if (isEdit) {
      if (fluidUndoData.length > 0) {
        undo_fluid_sticker_reset = fluidUndoData.reduce(
          (result: any, item: any, index: any) => {
            result[`undo_fluid_sticker_reset[${index}]`] = item;
            return result;
          },
          {},
        );
      }
      if (workDeleteIds.length > 0) {
        work_delete = workDeleteIds.reduce(
          (result: any, item: any, index: any) => {
            result[`work_delete[${index}]`] = item;
            return result;
          },
          {},
        );
      }
    }
    let params = {
      ...values,
      ...workData,
      work_attachments: workList,
      fluid_stiker_log: fluidResetData,
    };
    params = isEdit
      ? {
          ...params,
          ...fluid_sticker_id,
          ...undo_fluid_sticker_reset,
          ...work_delete,
          isEdit,
          id: repair?.id,
          temp_id: repair?.temp_id,
          ...fluid_sticker_id,
          ...undo_fluid_sticker_reset,
        }
      : {...params, ...fluid_sticker_id};
    console.log(params, 'PARAMS=======');
    let res = await postRepair(params);
    if (res) {
      resetForm();
      navigation.navigate(
        isEdit || isNew
          ? screens.preventiveMaintenance
          : screens.equipmentDetails,
        {
          screen: isEdit
            ? screens.preventiveMaintenance
            : screens.equipmentDetails,
          params: {
            equipmentItem: equipment,
            // intervalList: intervalList,
          },
        },
      );
    }
    resetForm();
  };
  const formComponent = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.titleText}>EQUIPMENT</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            equipment_id: equipment?.id ? equipment?.id.toString() : '',
            name: repair ? repair?.name : '',
            date: repair
              ? moment(repair.date).format('YYYY-MM-DD HH:mm:ss')
              : moment().format('YYYY-MM-DD HH:mm:ss'),
            repair_no: repair ? repair.repair_no : '',
            equipment_hours: repair
              ? repair?.equipment_hours?.toString()
              : equipment?.current_hour,
          }}
          validationSchema={repairValidation}
          onSubmit={(values, {resetForm}) => {
            if (workList.length > 0) {
              updateRepair(values, resetForm);
            }
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            values,
            errors,
            setFieldTouched,
            setFieldValue,
          }) => (
            <>
              <View style={styles.detailsItemContainer}>
                {/* {isNew ? ( */}
                <DropDown
                  disabled={!isNew}
                  value={values.equipment_id.toString()}
                  setTouched={() => setFieldTouched('equipment_id', true)}
                  onChange={selectedItem => {
                    handleChange('equipment_id')(selectedItem.toString());

                    const result = equipmentList.find(
                      (item: any) =>
                        item.value.toString() === selectedItem.toString(),
                    );
                    const selectedEquipment = result?.equipment;
                    setFieldValue(
                      'equipment_hour',
                      selectedEquipment?.current_hour,
                    );
                    setFieldValue('interval_id', '');
                    console.log(result?.equipment, 'Equipment======');
                    setEquipment(result?.equipment);
                  }}
                  items={equipmentList}
                  label="Equipment"
                  error={
                    touched.equipment_id &&
                    errors.equipment_id &&
                    !values.equipment_id
                      ? errors.equipment_id?.toString()
                      : ''
                  }
                />
                {/* ) : null} */}
                <InputText
                  editable={(!isView || isEdit) && status === 'active'}
                  value={values.name}
                  maxLength={25}
                  PlaceHolder="Enter repair name"
                  label="Repair name"
                  onBlur={handleBlur('name')}
                  onChange={handleChange('name')}
                  error={
                    touched.name && errors.name ? errors.name.toString() : ''
                  }
                />
                <InputText
                  editable={(!isView || isEdit) && status === 'active'}
                  value={values.repair_no}
                  maxLength={25}
                  PlaceHolder="Enter repair #"
                  label="Repair #"
                  onBlur={handleBlur('repair_no')}
                  onChange={handleChange('repair_no')}
                  error={
                    touched.repair_no && errors.repair_no
                      ? errors.repair_no.toString()
                      : ''
                  }
                />
                <DatePicker
                  maxDate={new Date()}
                  onChange={date => {
                    setFieldValue(
                      'date',
                      moment(date).format('YYYY-MM-DD HH:mm:ss'),
                    );
                  }}
                  disabled={(isView && !isEdit) || status !== 'active'}
                  value={moment(values.date).format('YYYY-MM-DD HH:mm:ss')}
                  label="Date"
                />

                <InputText
                  editable={!isView || isEdit}
                  value={values.equipment_hours}
                  maxLength={25}
                  PlaceHolder="Enter hours"
                  label="Equipment hours"
                  onBlur={handleBlur('equipment_hours')}
                  onChange={(value: string) => {
                    let sanitizedValue = value.replace(/[^\d.]+/g, '');
                    sanitizedValue =
                      sanitizedValue === '.' ? '0.0' : sanitizedValue;
                    setFieldValue('equipment_hours', sanitizedValue);
                  }}
                  error={
                    touched.equipment_hours && errors.equipment_hours
                      ? errors?.equipment_hours?.toString()
                      : ''
                  }
                />
                <WorkData
                  repairDocs={repairDocs}
                  onDeleteArrayUpdate={(data: any) => setWrkDeleteIds(data)}
                  workDeleteIds={workDeleteIds}
                  disabled={isView && !isEdit}
                  error={workError}
                  workList={workList}
                  onWorkDataUpdate={(data: any) => {
                    console.log(data, 'DATA=========CHANGE');
                    setWorkList(data);
                  }}
                />
                <FluidStickers
                  editData={editFluidData}
                  updateResetArray={(data: any) => {
                    console.log('setRESET====', data);
                    setResetData(data);
                  }}
                  updateUndoArray={(data: any) => setUndoData(data)}
                  disabled={isView && !isEdit}
                  equipment={equipment}
                />
              </View>
              {isEdit ? (
                <FormButton
                  isYellow={true}
                  onPress={() => {
                    if (workList.length < 1) {
                      setWrkError('Work Completed is required');
                    }
                    handleSubmit();
                  }}
                  label={'SAVE REPAIR'}
                />
              ) : (
                <>
                  {!isEdit && !isView ? (
                    <FormButton
                      isYellow={true}
                      onPress={() => {
                        if (workList.length < 1) {
                          setWrkError('Work Completed is required');
                        }
                        handleSubmit();
                      }}
                      label={'ADD REPAIR'}
                    />
                  ) : null}
                </>
              )}
            </>
          )}
        </Formik>
      </View>
    );
  };
  return (
    <>
      <View
        style={[
          CommonStyles.mainContainer,
          {padding: getWidth(28), paddingBottom: getHeight(8)},
        ]}>
        <KeyboardAwareScroll>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={styles.titleContainer}>
            {isView ? (
              <Text style={styles.title}>
                {isEdit ? 'Edit Repair' : 'Repair Details'}
              </Text>
            ) : (
              <Text style={styles.title}>{'Add Repair'}</Text>
            )}
            {(roleType === 'cOwner' || roleType === 'dOwner') &&
            !isEdit &&
            !isNew &&
            !isAdd &&
            !isArchived ? (
              <DeleteButton isEdit={true} onPress={() => setEdit(true)} />
            ) : null}
          </View>
          <View style={[CommonStyles.formContainer]}>{formComponent()}</View>
        </KeyboardAwareScroll>
      </View>
      {/* )} */}
    </>
  );
};

export default RepairAddForm;
