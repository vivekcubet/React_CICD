/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DatePicker,
  DeleteButton,
  DropDown,
  FormButton,
  InputText,
  KeyboardAwareScroll,
} from '../../../../components';
import styles from '../../../../theme/FormStyles';
import {Formik} from 'formik';
import {serviceValidation} from '../../../../utils/validations';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  useGetEquipmentForDropDown,
  useGetEquipmentIntervals,
  useGetServiceDocs,
  useGetTasksByIntervalId,
} from '../../../../utils/LocalDBHooks';
import TaskCheckList from './TaskChecklist/TaskCheckList';
import {
  useGetAllTechnicians,
  useGetCompanyTechnicians,
  usePostService,
} from '../../../../Api/hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import screens from '../../../../navigation/screens';
import ServiceParts from './ServiceParts/ServiceParts';
import {useAlert} from '../../../../utils/hooks';
import moment from 'moment';
import FluidStickers from '../../FluidSticker/FluidStickers';

const ServiceAddForm = ({route}: any) => {
  const {
    isFromList = false,
    service = null,
    isNew = null,
    isAdd = null,
    isView = null,
    status = null,
    isArchived = false,
  } = route.params ? route.params : {};
  const {companyTechnicians} = useSelector(
    (state: RootState) => state.TechnicianReducer,
  );
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {Alert, showAlert} = useAlert();
  const [getTemplateIntervalTasks] = useGetTasksByIntervalId();
  const [getEqIntervals] = useGetEquipmentIntervals();
  const [getEquipments] = useGetEquipmentForDropDown();
  const [getCompanyTechnicians] = useGetCompanyTechnicians();
  const [getTechnicianList] = useGetAllTechnicians();
  const [getServiceDocs] = useGetServiceDocs();
  const [postService] = usePostService();
  const formikRef = useRef<any>();
  const [serviceInterval, setServiceInterval] = useState(
    service ? service.interval_id : '',
  );
  const [intervalTaskList, setIntervalTasks] = useState<any>([]);
  const [equipment, setEquipment] = useState<any>(route?.params?.equipment);
  const [technicians, setTechnicians] = useState<any>([]);
  const [taskData, setTaskData] = useState<any>([]);
  const [updateStatus, setUpdateStatus] = useState<any>('active');
  const [fluidResetData, setResetData] = useState<any>([]);
  const [fluidUndoData, setUndoData] = useState<any>([]);
  const [editFluidData, setEditFluid] = useState<any>([]);
  const [isEdit, setEdit] = useState<any>(false);
  const [equipmentList, setEQList] = useState<any>([]);
  const [intervalList, setIntervalList] = useState<any>([]);
  const [serviceDocs, setServiceDocs] = useState<any>([]);

  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
      setEquipment(route?.params?.equipment);
      setServiceInterval(service?.interval_id);
      getServiceDocuments();
    }, [route?.params?.equipment, service]),
  );
  useEffect(() => {
    setTimeout(() => {
      getServiceTasks();
      getCompanyTechnicians({isLoader: false});
      getTechnicianList({isLoader: true});
    }, 500);
  }, [serviceInterval, equipment]);
  useEffect(() => {
    console.log(equipment?.current_hour, 'HOUR CHANGE======');
    formikRef.current?.setFieldValue(
      'equipment_hour',
      equipment?.current_hour.toString(),
    );
    formikRef.current?.setFieldValue('equipment_id', equipment?.id.toString());
    updateIntervalList();
  }, [equipment]);
  const updateIntervalList = async () => {
    let intervals = await getEqIntervals({equipment: equipment});
    setIntervalList(intervals);
  };
  /* Local data filter to get offline DOC urls */
  const getServiceDocuments = async () => {
    if (service) {
      let documents = await getServiceDocs({serviceId: service?.id});
      setServiceDocs(documents);
    }
  };
  const getServiceTasks = async () => {
    let output_data: any = [];
    let restData: any = [];
    if (isFromList) {
      if (service?.checklist_task.length > 0) {
        output_data = service?.checklist_task.map((taskItem: any) => {
          console.log(taskItem, 'TASK LIST GOTTT11', service?.checklist_task);
          return {
            id: taskItem?.id,
            task_name: taskItem?.task
              ? taskItem?.task?.name
              : taskItem.task_name,
            task_id: taskItem?.task ? taskItem?.task?.id : taskItem?.task_id,
            comment: taskItem?.comment,
            upload: taskItem?.path ? {uri: taskItem?.path} : taskItem?.upload,
            is_checked: taskItem?.is_checked,
          };
        });
      } else {
        let res = await getTemplateIntervalTasks({
          intervalId: serviceInterval,
          templateId: equipment.template_id,
        });

        output_data = res.map((entry: any) => {
          return {
            task_id: entry.task_id,
            task_name: entry.task.name,
            comment: null,
            upload: null,
            is_checked: null,
          };
        });
      }
      restData = service?.fluid_resets.map((sticker: any) => {
        return sticker?.id;
      });
    } else if (serviceInterval) {
      let res = await getTemplateIntervalTasks({
        intervalId: serviceInterval,
        templateId: equipment.template_id,
      });

      output_data = res.map((entry: any) => {
        return {
          task_id: entry.task_id,
          task_name: entry.task.name,
          comment: null,
          upload: null,
          is_checked: null,
        };
      });
    }
    let equipments = await getEquipments();
    setEQList(equipments);
    setEditFluid(restData);
    setTaskData(output_data);
    setIntervalTasks(output_data);
  };
  useEffect(() => {
    let TechList = companyTechnicians.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    setTechnicians(TechList);
  }, [companyTechnicians]);
  const updateService = async (values: any, resetForm: any) => {
    console.log(fluidResetData, 'RESET adata');
    const taskList = taskData.reduce((result: any, item: any, index: any) => {
      result[`checklist[${index}][task_id]`] = item.task_id;
      if (item.is_checked !== null) {
        result[`checklist[${index}][is_checked]`] = item.is_checked;
      }
      if (item.comment) {
        result[`checklist[${index}][comment]`] = item.comment;
      }
      if (item.upload?.type) {
        result[`checklist[${index}][upload]`] = item.upload;
      }
      return result;
    }, {});
    let fluid_sticker_id = {};
    let undo_fluid_sticker_reset = {};
    if (isEdit) {
      if (fluidResetData.length > 0) {
        fluid_sticker_id = fluidResetData.reduce(
          (result: any, item: any, index: any) => {
            result[`fluid_sticker_id[${index}]`] = item;
            return result;
          },
          {},
        );
      }
      if (fluidUndoData.length > 0) {
        undo_fluid_sticker_reset = fluidUndoData.reduce(
          (result: any, item: any, index: any) => {
            result[`undo_fluid_sticker_reset[${index}]`] = item;
            return result;
          },
          {},
        );
      }
    }
    let params = {
      ...values,
      ...taskList,
      fluid_stiker_log: fluidResetData,
      checklist_task: taskData,
    };
    params = isEdit
      ? {
          ...params,
          ...fluid_sticker_id,
          ...undo_fluid_sticker_reset,
          status: updateStatus,
          isEdit,
          id: service?.id,
          ...fluid_sticker_id,
          ...undo_fluid_sticker_reset,
        }
      : params;
    console.log(params, 'SUBmit__TEST====');
    let res = await postService(params);
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
            intervalList: intervalList,
          },
        },
      );
    }
  };
  const formComponent = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.titleText}>EQUIPMENT</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            equipment_id: equipment?.id ? equipment?.id.toString() : '',
            date: service
              ? moment(service.date).format('YYYY-MM-DD HH:mm:ss')
              : moment().format('YYYY-MM-DD HH:mm:ss'),
            service_no: service ? service.service_no : '',
            interval_id: service ? service.interval_id : '',
            technician_id: service ? service.technician_id : '',
            equipment_hour: service
              ? service?.equipment_hour?.toString()
              : equipment?.current_hour?.toString(),
          }}
          validationSchema={serviceValidation}
          onSubmit={(values, {resetForm}) => {
            updateService(values, resetForm);
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
                  value={values?.equipment_id?.toString()}
                  setTouched={() => setFieldTouched('equipment_id', true)}
                  onChange={selectedItem => {
                    handleChange('equipment_id')(selectedItem.toString());
                    console.log(selectedItem, 'Test======SELECT');
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
                <DropDown
                  disabled={isEdit || isView}
                  value={values.interval_id.toString()}
                  setTouched={() => setFieldTouched('interval_id', true)}
                  onChange={selectedItem => {
                    handleChange('interval_id')(selectedItem.toString());
                    setServiceInterval(selectedItem.toString());
                  }}
                  items={
                    intervalList.length > 0
                      ? intervalList.map(({label, id}: any) => ({
                          label,
                          value: id.toString(),
                        }))
                      : []
                  }
                  label="Service Interval"
                  error={
                    touched.interval_id && errors.interval_id
                      ? errors.interval_id?.toString()
                      : ''
                  }
                />
                <DatePicker
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
                  editable={(!isView || isEdit) && status === 'active'}
                  value={values.service_no}
                  maxLength={25}
                  PlaceHolder="Enter service #"
                  label="Service #"
                  onBlur={handleBlur('service_no')}
                  onChange={handleChange('service_no')}
                  error={
                    touched.service_no && errors.service_no
                      ? errors.service_no.toString()
                      : ''
                  }
                />
                <InputText
                  editable={!isView || isEdit}
                  value={values.equipment_hour}
                  maxLength={15}
                  PlaceHolder="Enter hours"
                  label="Equipment hours"
                  onBlur={handleBlur('equipment_hour')}
                  onChange={(value: string) => {
                    let sanitizedValue = value.replace(/[^\d.]+/g, '');
                    sanitizedValue =
                      sanitizedValue === '.' ? '0.0' : sanitizedValue;
                    setFieldValue('equipment_hour', sanitizedValue);
                  }}
                  error={
                    touched.equipment_hour && errors.equipment_hour
                      ? errors?.equipment_hour?.toString()
                      : ''
                  }
                />
                <DropDown
                  disabled={isView && !isEdit}
                  value={values.technician_id}
                  setTouched={() => setFieldTouched('technician_id', true)}
                  onChange={selectedItem => {
                    handleChange('technician_id')(selectedItem.toString());
                  }}
                  items={technicians}
                  label="Technician"
                  error={
                    touched.technician_id && errors.technician_id
                      ? errors?.technician_id?.toString()
                      : ''
                  }
                />
                {intervalTaskList && intervalTaskList.length > 0 ? (
                  <TaskCheckList
                    serviceDocs={serviceDocs}
                    disabled={isView && !isEdit}
                    onTaskDataChange={(data: any) => setTaskData(data)}
                    taskList={taskData}
                  />
                ) : null}
                {isView && !isEdit ? null : (
                  <FluidStickers
                    editData={editFluidData}
                    updateResetArray={(data: any) => setResetData(data)}
                    updateUndoArray={(data: any) => setUndoData(data)}
                    disabled={isAdd || isNew || (isView && !isEdit)}
                    equipment={equipment}
                  />
                )}
                <ServiceParts
                  intervalId={values.interval_id}
                  equipment={equipment}
                />
              </View>
              {(isEdit && status === 'active') ||
              (isEdit && status === 'finished' && roleType === 'cOwner') ? (
                <View style={styles.flexRowView}>
                  <View style={CommonStyles.containerFlex1}>
                    <FormButton
                      onPress={() => {
                        setUpdateStatus(
                          status === 'finished' ? 'active' : 'active',
                        );
                        if (status === 'finished') {
                          showAlert(
                            'Warning',
                            'Are you sure, you want to reject the service?',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                              },
                              {
                                text: 'Confirm',
                                onPress: async () => {
                                  handleSubmit();
                                },
                              },
                            ],
                          );
                        } else {
                          handleSubmit();
                        }
                      }}
                      label={status === 'finished' ? 'REJECT' : 'QUICK SAVE'}
                    />
                  </View>
                  <View
                    style={[
                      CommonStyles.containerFlex1,
                      {paddingLeft: getWidth(40)},
                    ]}>
                    <FormButton
                      isYellow={true}
                      onPress={() => {
                        setUpdateStatus(
                          status === 'finished' ? 'approved' : 'finished',
                        );
                        const msg =
                          status === 'active'
                            ? ' submit the service for review?'
                            : 'complete the service?';

                        showAlert(
                          'Warning',
                          'Are you sure, you want to ' + msg,
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                            },
                            {
                              text: 'Confirm',
                              onPress: async () => {
                                handleSubmit();
                              },
                            },
                          ],
                        );
                      }}
                      label={
                        status === 'finished' ? 'COMPLETE' : 'SEND FOR REVIEW'
                      }
                    />
                  </View>
                </View>
              ) : (
                <>
                  {!isEdit && !isView ? (
                    <FormButton
                      isYellow={true}
                      onPress={() => {
                        setUpdateStatus('active');
                        handleSubmit();
                      }}
                      label={'CREATE NEW ACTIVE SERVICE'}
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
  console.log(status, 'SERVICE======', isArchived);
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
                {isEdit ? 'Edit Service' : 'Service Details'}
              </Text>
            ) : (
              <Text style={styles.title}>{'Add Service'}</Text>
            )}
            {((status === 'active' &&
              (roleType === 'cTecnician' || roleType === 'dTecnician')) ||
              (status === 'finished' && roleType === 'cOwner')) &&
            !isEdit &&
            !isNew &&
            !isArchived ? (
              <DeleteButton isEdit={true} onPress={() => setEdit(true)} />
            ) : null}
          </View>
          <View style={[CommonStyles.formContainer]}>{formComponent()}</View>
        </KeyboardAwareScroll>
        <Alert />
      </View>
      {/* )} */}
    </>
  );
};

export default ServiceAddForm;
