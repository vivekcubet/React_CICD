/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DeleteButton,
  DropDown,
  FormButton,
  Icon,
  InputText,
  KeyboardAwareScroll,
  LockButton,
} from '../../../../components';
import {Formik} from 'formik';
import {
  attachPartValidation,
  serviceTskValidation,
} from '../../../../utils/validations';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {
  useGetEquipmentModels,
  useGetPartsAndMaterials,
  useGetServiceIntervals,
  useGetServiceTasks,
  usePostServiceTask,
} from '../../../../Api/hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../../navigation/screens';
import templateFormStyle from '../../../../theme/templateFormStyle';
import Colors from '../../../../theme/Colors';
import styles from './styles';
import Fonts from '../../../../theme/Fonts';
import {useAlert} from '../../../../utils/hooks';
import useArchiveApi from '../../../../Api/hooks/useArchiveApi';
import {useToast} from 'react-native-toast-notifications';
import {END_POINTS} from '../../../../Api/constants';
import usePostApi from '../../../../Api/hooks/usePostApi';
interface ServiceTaskInterface {
  taskData?: any;
  isEdit?: boolean;
  onCancelPress?: any;
  onSuccess?: any;
  isArchive?: boolean;
  isPublic?: boolean;
  route?: any;
}
const ServiceTaskForm: FC<ServiceTaskInterface> = ({
  taskData = null,
  isEdit = false,
  onCancelPress,
  onSuccess,
  isPublic = false,
  route,
}) => {
  const {model = null} = route?.params ? route?.params : {};
  const [getPartsAndMaterials] = useGetPartsAndMaterials();
  const {isLock = false} = taskData ? taskData : {};
  const formikRef = useRef<any>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {Alert, showAlert} = useAlert();
  const toast = useToast();
  const [getEquipmentModels] = useGetEquipmentModels();
  const [postServiceTask] = usePostServiceTask();
  const [postApi] = usePostApi();
  const [archiveData] = useArchiveApi();
  const {myServiceIntervals, publicServiceIntervals} = useSelector(
    (state: RootState) => state.ServiceIntervalReducer,
  );
  const {myEquipmentModels, publicEquipmentModels} = useSelector(
    (state: RootState) => state.EquipmentModelReducer,
  );
  const {myPartsAndMeterial, publicPartsAndMeterial} = useSelector(
    (state: RootState) => state.PartsAndMaterialReducer,
  );
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const [eqModels, setEqModels] = useState<any>([]);
  const [parts, setParts] = useState<any>([]);
  const [modelIntervals, setModelIntervals] = useState<any>([]);
  const [attachVisible, setAttachVisible] = useState<any>(false);
  const [taskEditData, setTaskData] = useState(taskData);
  const [selectedModel, setSelectedModel] = useState<any>(model ? model : null);
  const [selectedParts, setSelectedParts] = useState<any>([]);
  const [partsError, setPartsError] = useState('');
  const [getServiceIntervals] = useGetServiceIntervals();
  const [getTaskList] = useGetServiceTasks();

  useFocusEffect(
    React.useCallback(() => {
      initialSetUp();
      formikRef.current?.resetForm();
      setSelectedParts([]);
    }, []),
  );
  useEffect(() => {
    setTaskData(taskData);
    getInitialSetup();
    setSelectedParts([]);
    setSelectedModel(taskData ? taskData?.model_id.toString() : '');
    getServiceIntervals({isLoader: true});
  }, [taskData]);
  const initialSetUp = async () => {
    await getPartsAndMaterials({isLoader: false});
    getModelIntervals();
  };
  const getModelIntervals = () => {
    if (!selectedModel) {
      return;
    }
    let intervalList = isPublic
      ? [...publicServiceIntervals]
      : [...myServiceIntervals];
    let intervals = intervalList.reduce((interval: any, category: any) => {
      const model = category.models.find(
        (modelItem: any) =>
          modelItem.id.toString() === selectedModel.toString(),
      );
      return model ? model.intervals : interval;
    }, []);

    // Return an array of intervals for the model
    setModelIntervals(intervals);
  };
  useEffect(() => {
    getModelIntervals();
  }, [myServiceIntervals, selectedModel, model]);
  useEffect(() => {
    let array = isPublic ? [...publicEquipmentModels] : [...myEquipmentModels];
    const result = array.reduce((acc, curr) => {
      const dataItem = curr.models.map((model: any) => ({
        value: model.id.toString(),
        label: model.name + ' - ' + curr?.name,
      }));
      return acc.concat(dataItem);
    }, []);
    result.sort((a: any, b: any) => a.label.localeCompare(b.label));
    let partsList = isPublic
      ? [...publicPartsAndMeterial]
      : [...myPartsAndMeterial];
    const partsData = partsList.reduce((acc, curr) => {
      const dataItem = curr?.parts.map((part: any) => ({
        value: part.id.toString(),
        label: part.description + '-' + curr?.name,
        partData: part,
      }));
      return acc.concat(dataItem);
    }, []);
    console.log(model, 'Templatee parts====', result);
    setParts(partsData);
    if (model) {
      formikRef.current?.setFieldValue('model_id', model.toString());
    }
    let models = model
      ? result.filter((item: any) => item.value.toString() === model.toString())
      : result;
    setEqModels(models);
  }, [
    publicEquipmentModels,
    myEquipmentModels,
    myServiceIntervals,
    selectedModel,
    myPartsAndMeterial,
    publicPartsAndMeterial,
    model,
  ]);

  const getInitialSetup = async () => {
    await getEquipmentModels({isLoader: true});
    if (taskData) {
      setUpPartsForEdit();
    }
  };
  const setUpPartsForEdit = () => {
    let selectedPartsForEdit = taskData?.task?.parts.map((part: any) => {
      return {
        part: {
          partData: part?.part,
          value: part.part.id.toString(),
          label: part?.part?.description,
        },
        quantity: part?.quantity.toString(),
      };
    });
    setSelectedParts(selectedPartsForEdit);
  };
  const updateServiceTask = async (values: any, resetForm: any) => {
    if (!selectedParts || selectedParts.length < 1) {
      return;
    }
    const parts_id = selectedParts.map((item: any) => item.part.value);
    const quantity = selectedParts.map((item: any) => item.quantity);
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: taskEditData?.task?.id,
          parts_id,
          quantity,
        }
      : {
          ...values,
          parts_id,
          quantity,
        };
    let res = await postServiceTask(postData);
    if (res) {
      if (!isEdit) {
        resetForm();
        navigation.navigate(screens.templatesAndSetup);
      } else {
        onSuccess();
      }
    }
  };
  const attachPartItem = (values: any, resetForm: any) => {
    setPartsError('');
    let selectedPart = parts.find((item: any) => {
      return item.value.toString() === values.part_id.toString();
    });
    setSelectedParts((prevSelectedParts: any) => {
      const updatedParts = [...prevSelectedParts];
      const index = updatedParts.findIndex(
        (item: any) => item?.part?.value === values.part_id,
      );
      if (index >= 0) {
        // The part already exists, so update its quantity
        updatedParts[index].quantity = values.quantity;
      } else {
        // The part doesn't exist, so add it to the array
        updatedParts.push({part: selectedPart, quantity: values.quantity});
      }
      return updatedParts;
    });
    resetForm();
    setAttachVisible(false);
  };
  const removePartItem = (index: number) => {
    showAlert('Warning', 'Are you want to remove the part and material?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: () => {
          setSelectedParts([
            ...selectedParts.slice(0, index),
            ...selectedParts.slice(index + 1),
          ]);
        },
      },
    ]);
  };
  const archiveTaskItem = async () => {
    showAlert('Warning', 'Are you want to archive the Service task?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await archiveData({
            endPoint:
              END_POINTS.ARCHIVE_SERVICE_TASK + '?id=' + taskEditData?.task?.id,
            params: {},
          });

          if (response) {
            await getTaskList({isLoader: true});
            toast.show(response.message);
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const unArchiveTaskItem = async () => {
    showAlert('Warning', 'Are you want to unarchive the Service task?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await postApi({
            endPoint: END_POINTS.UNARCHIVE_SERVICE_TASK,
            params: {id: taskEditData?.task?.id},
          });

          if (response) {
            await getTaskList({isLoader: true});
            toast.show(response.message);
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const duplicateTask = async () => {
    showAlert('Warning', 'Are you want to duplicate the the service task?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await postApi({
            endPoint: END_POINTS.DUPLICATE_SERVICE_TASK,
            params: {
              company_id: userCompany?.company_id,
              task_id: taskEditData?.task?.id,
            },
          });

          if (response) {
            await getTaskList({isLoader: true});
            toast.show(response.message);
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  useEffect(() => {
    console.log(selectedParts, 'PARTS SELECTED=====', isLock);
  }, [selectedParts]);
  const formComponent = () => {
    return (
      <>
        {isEdit ? (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {!isLock && !isPublic && !taskData?.isArchive
                ? 'Edit Service Task'
                : 'Service Task'}
            </Text>
            {isEdit && !taskData?.isArchive ? (
              <>
                {isPublic || isLock ? (
                  <LockButton label="Service task" isPublic={isPublic} />
                ) : (
                  <DeleteButton onPress={() => archiveTaskItem()} />
                )}
              </>
            ) : null}
          </View>
        ) : null}

        <View style={templateFormStyle.detailsContainer}>
          {/* <Text style={templateFormStyle.titleText}>SERVICE TASK</Text> */}
          <Formik
            innerRef={formikRef}
            initialValues={{
              name: taskEditData ? taskEditData?.task?.name.toString() : '',
              model_id: taskEditData ? taskEditData?.model_id.toString() : '',
              interval_id: taskEditData
                ? taskEditData?.task?.interval_id?.toString()
                : '',
              isEdit: false,
            }}
            validationSchema={serviceTskValidation}
            onSubmit={(values, {resetForm}) => {
              updateServiceTask(values, resetForm);
            }}>
            {({
              handleChange,
              handleSubmit,
              setFieldTouched,
              handleBlur,
              values,
              errors,
              touched,
            }) => (
              <>
                <View style={templateFormStyle.detailsItemContainer}>
                  <InputText
                    editable={!taskData?.isArchive && !isPublic && !isLock}
                    value={values.name}
                    PlaceHolder="Enter task"
                    maxLength={100}
                    label="Service Task Name"
                    onBlur={handleBlur('name')}
                    onChange={handleChange('name')}
                    error={
                      touched.name && errors.name ? errors.name.toString() : ''
                    }
                  />
                  <DropDown
                    disabled={
                      taskData?.isArchive || isPublic || isLock || model
                    }
                    value={model ? model.toString() : values.model_id}
                    onChange={selectedItem => {
                      console.log(selectedItem, 'ITEM====');
                      setSelectedModel(selectedItem.toString());
                      handleChange('model_id')(selectedItem.toString());
                    }}
                    setTouched={() => setFieldTouched('model_id', true)}
                    items={eqModels}
                    label="Equipment Model"
                    error={
                      touched.model_id && errors.model_id
                        ? errors.model_id?.toString()
                        : ''
                    }
                  />

                  <DropDown
                    disabled={taskData?.isArchive || isPublic || isLock}
                    value={values.interval_id}
                    setTouched={() => setFieldTouched('interval_id', true)}
                    onChange={selectedItem => {
                      console.log(selectedItem, 'ITEM====');
                      handleChange('interval_id')(selectedItem.toString());
                    }}
                    items={[
                      ...modelIntervals?.map((obj: any) => {
                        return {
                          label: obj.interval_hours,
                          value: obj.id.toString(),
                        };
                      }),
                    ]}
                    label="Service Interval"
                    error={
                      touched.interval_id && errors.interval_id
                        ? errors.interval_id?.toString()
                        : ''
                    }
                  />
                  <View
                    style={{
                      backgroundColor: Colors.backgroundGray,
                      paddingBottom: getHeight(55),
                      padding: 10,
                    }}>
                    <View
                      style={[
                        styles.container,
                        CommonStyles.flexRowContainer,
                        {
                          backgroundColor: Colors.backgroundGray,
                          justifyContent: 'space-between',
                        },
                      ]}>
                      <Text style={[styles.label, {color: Colors.black}]}>
                        Parts & Materials
                      </Text>
                      {!taskData?.isArchive && !isPublic && !isLock ? (
                        <TouchableOpacity
                          onPress={() => setAttachVisible(true)}
                          style={styles.attachBtn}>
                          <Text
                            style={{
                              color: Colors.white,
                              fontSize: getHeight(55),
                            }}>
                            Attach New
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    {!selectedParts || selectedParts.length < 1 ? (
                      <Text
                        style={{
                          fontSize: getHeight(55),
                          color: Colors.placeholderColor,
                        }}>
                        No parts and materials attached yet!
                      </Text>
                    ) : null}
                    {partsError ? (
                      <Text style={CommonStyles.errorText}>{partsError}</Text>
                    ) : null}

                    {selectedParts.map((item: any, index: number) => {
                      let itemPart = parts.find(
                        (obj: any) =>
                          obj.value.toString() ===
                          item?.part?.partData?.id.toString(),
                      );

                      return (
                        <View
                          key={item?.part?.partData?.id.toString()}
                          style={[
                            CommonStyles.flexRowContainer,
                            {
                              backgroundColor: Colors.white,
                              padding: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.borderGray,
                            },
                          ]}>
                          <View
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              minHeight: getHeight(20),
                            }}>
                            <View style={CommonStyles.flexRowContainer}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.partText,
                                  {maxWidth: getWidth(3)},
                                ]}>
                                {item?.part?.partData?.description}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.partText,
                                  Fonts.B700,
                                  {maxWidth: getWidth(4)},
                                ]}>
                                {' - ' + item?.part?.partData?.part_no}
                              </Text>
                            </View>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.partText,
                                {
                                  fontSize: getHeight(65),
                                  marginTop: getHeight(75),
                                },
                              ]}>
                              [{item?.quantity}{' '}
                              {itemPart?.partData?.measurementType_name}]
                            </Text>
                          </View>
                          {!taskData?.isArchive && !isPublic && !isLock ? (
                            <TouchableOpacity
                              onPress={() => {
                                removePartItem(index);
                              }}
                              style={styles.deleteContainer}>
                              <Icon
                                color={Colors.errorColor}
                                iconName="trash-o"
                                size={getHeight(45)}
                                family="FontAwesome"
                              />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                </View>
                {isEdit && !taskData?.isArchive && !isPublic && !isLock ? (
                  <View style={templateFormStyle.flexRowView}>
                    <View style={CommonStyles.containerFlex1}>
                      <FormButton
                        onPress={() => onCancelPress()}
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
                        onPress={() => {
                          if (selectedParts.length < 1) {
                            setPartsError('Parts and material is required');
                          }
                          handleSubmit();
                        }}
                        label="Save"
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    {isPublic || isLock ? (
                      <>
                        {isLock && !isPublic ? null : (
                          <FormButton
                            isYellow={true}
                            onPress={() => {
                              duplicateTask();
                            }}
                            label={'DUPLICATE TO MY TEMPLATES'}
                          />
                        )}
                      </>
                    ) : (
                      <FormButton
                        isYellow={true}
                        onPress={() => {
                          if (taskData?.isArchive) {
                            unArchiveTaskItem();
                          } else {
                            if (selectedParts.length < 1) {
                              setPartsError('Parts and material is required');
                            }
                            handleSubmit();
                          }
                        }}
                        label={taskData?.isArchive ? 'Unarchive' : 'Create'}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </Formik>
        </View>
      </>
    );
  };
  return (
    <>
      {isEdit ? (
        <>{formComponent()}</>
      ) : (
        <View style={CommonStyles.mainContainer}>
          <KeyboardAwareScroll>
            <BackButton
              onPress={() => {
                model
                  ? navigation.goBack()
                  : navigation.navigate(screens.templatesAndSetup);
              }}
            />
            <Text style={templateFormStyle.title}>Create Service Task</Text>
            <View
              style={[
                CommonStyles.containerFlex1,
                {paddingBottom: getHeight(4)},
              ]}>
              {formComponent()}
            </View>
          </KeyboardAwareScroll>
        </View>
      )}
      <Modal transparent visible={attachVisible}>
        <View style={{backgroundColor: Colors.transparentBlack}}>
          <KeyboardAwareScroll>
            <View
              style={[
                CommonStyles.containerFlex1,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: getHeight(1),
                },
              ]}>
              <View
                style={{
                  width: getWidth(1.1),
                  backgroundColor: Colors.white,
                  padding: getWidth(18),
                  borderRadius: 10,
                }}>
                <View style={styles.closeContainer}>
                  <Text style={styles.modalTitle}>
                    Attach New Parts / Materials
                  </Text>
                </View>
                <Formik
                  initialValues={{
                    part_id: '',
                    quantity: '',
                    isEdit: false,
                  }}
                  validationSchema={attachPartValidation}
                  onSubmit={(values, {resetForm}) => {
                    attachPartItem(values, resetForm);
                  }}>
                  {({
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    setFieldTouched,
                    setFieldValue,
                    touched,
                    values,
                    errors,
                  }) => (
                    <>
                      <DropDown
                        value={values.part_id}
                        onChange={selectedItem => {
                          let isPartFound: any = selectedParts.find(
                            (item: any) => {
                              console.log(
                                item,
                                'PARAT==FOUND1111',
                                selectedItem.toString(),
                              );
                              return (
                                item.part.value.toString() ===
                                selectedItem.toString()
                              );
                            },
                          );
                          console.log(isPartFound?.quantity, 'PARAT==FOUND');
                          setFieldValue(
                            'quantity',
                            isPartFound ? isPartFound?.quantity : '',
                          );
                          handleChange('part_id')(selectedItem.toString());
                        }}
                        items={parts}
                        label="Part"
                        setTouched={() => setFieldTouched('part_id', true)}
                        error={
                          touched.part_id && errors.part_id
                            ? errors.part_id?.toString()
                            : ''
                        }
                      />
                      <InputText
                        value={values.quantity}
                        PlaceHolder="Enter quantity"
                        label="Quantity"
                        keyboardType={'number-pad'}
                        onBlur={handleBlur('quantity')}
                        onChange={(value: string) => {
                          setFieldValue('quantity', value.replace(/\D/g, ''));
                        }}
                        maxLength={8}
                        error={
                          touched.quantity && errors.quantity
                            ? errors.quantity.toString()
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
                            onPress={() => setAttachVisible(false)}
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
          </KeyboardAwareScroll>
        </View>
      </Modal>
      <Alert />
    </>
  );
};

export default ServiceTaskForm;
