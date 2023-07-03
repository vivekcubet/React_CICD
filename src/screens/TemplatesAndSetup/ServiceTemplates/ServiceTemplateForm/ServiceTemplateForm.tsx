/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DropDown,
  FormButton,
  InputText,
  KeyboardAwareScroll,
  TemplateTaskItem,
} from '../../../../components';
import {Formik} from 'formik';
import {serviceTemplateValidation} from '../../../../utils/validations';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {
  useGetEquipmentModels,
  useGetServiceIntervals,
  usePostServiceTemplate,
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
import {useAlert} from '../../../../utils/hooks';
interface ServiceTemplateInterface {
  templateData?: any;
  isEdit?: boolean;
  onCancelPress?: any;
  onSuccess?: any;
  isArchived?: boolean;
  isPublic?: boolean;
  templatesTasks?: any;
}
const ServiceTemplateForm: FC<ServiceTemplateInterface> = ({
  templateData = null,
  isEdit = false,
  onCancelPress,
  onSuccess,
  isPublic = false,
  templatesTasks = [],
}) => {
  const formikRef = useRef<any>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {Alert, showAlert} = useAlert();
  const [getEquipmentModels] = useGetEquipmentModels();
  const [postServiceTemplate] = usePostServiceTemplate();
  const {myServiceIntervals, publicServiceIntervals} = useSelector(
    (state: RootState) => state.ServiceIntervalReducer,
  );
  const {myServiceTasks, publicServiceTasks} = useSelector(
    (state: RootState) => state.ServiceTaskReducer,
  );
  const {myEquipmentModels, publicEquipmentModels} = useSelector(
    (state: RootState) => state.EquipmentModelReducer,
  );
  const [eqModels, setEqModels] = useState<any>([]);
  const [editTasks, setEditTasks] = useState<any>(templatesTasks);
  const [modelIntervalTasks, setModelIntervalTasks] = useState<any>([]);
  const [modelIntervals, setModelIntervals] = useState<any>(
    isEdit ? templatesTasks : [],
  );
  const [tempIntervals, setTempIntervals] = useState<any>([]);
  const [attachVisible, setAttachVisible] = useState<any>(false);
  const [taskEditData, setTaskData] = useState(templateData);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [tasksError, setTasksError] = useState('');
  const [getServiceIntervals] = useGetServiceIntervals();
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
      setModelIntervals([]);
      setModelIntervalTasks([]);
      setTempIntervals({});
    }, []),
  );
  useEffect(() => {
    setTaskData(templateData);
    getInitialSetup();
    setSelectedModel(templateData ? templateData?.model_id.toString() : '');
    getServiceIntervals({isLoader: true});
  }, [templateData]);

  const getModelIntervals = async (modalId: any, isChange = true) => {
    if (!modalId) {
      return;
    }

    let intervalTaskList = isPublic
      ? [...publicServiceTasks]
      : [...myServiceTasks];
    let intervalTasks = intervalTaskList.reduce(
      (interval: any, category: any) => {
        const model = category.models.find(
          (modelItem: any) => modelItem.id.toString() === modalId.toString(),
        );
        return model ? model.intervals : interval;
      },
      [],
    );
    let intervalList = isPublic
      ? [...publicServiceIntervals]
      : [...myServiceIntervals];
    let intervals = intervalList.reduce((interval: any, category: any) => {
      const model = category.models.find(
        (modelItem: any) => modelItem.id.toString() === modalId.toString(),
      );
      console.log(model, 'MODEL=====');
      return model ? model.intervals : interval;
    }, []);

    // Return an array of intervals for the model
    console.log(intervalTasks, 'INTERVALS=====Selected');
    setModelIntervals(editTasks && !isChange ? editTasks : intervals);
    setModelIntervalTasks(intervalTasks);
  };
  useEffect(() => {
    console.log(selectedModel, 'selectedModelChange=====');
    getModelIntervals(selectedModel, editTasks ? false : true);
  }, [
    myServiceIntervals,
    selectedModel,
    myServiceTasks,
    publicServiceIntervals,
    publicServiceTasks,
  ]);

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
    setEqModels(result);
  }, [
    publicEquipmentModels,
    myEquipmentModels,
    myServiceIntervals,
    selectedModel,
  ]);

  const getInitialSetup = async () => {
    await getEquipmentModels({isLoader: true});
  };
  const updateServiceTemplates = async (values: any, resetForm: any) => {
    console.log(values, 'VALUES===');
    let task_id = modelIntervals.flatMap((interval: any) =>
      (interval.task || []).map((task: any) => task.id),
    );
    if (!task_id || task_id.length < 1) {
      setTasksError('Service Tasks is required');
      return;
    }
    console.log(task_id, 'TASKS=====');
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: templateData?.id,
          task_id,
        }
      : {
          ...values,
          task_id,
        };
    let res = await postServiceTemplate(postData);
    if (res) {
      if (!isEdit) {
        resetForm();
        navigation.navigate(screens.templatesAndSetup);
      } else {
        onSuccess();
      }
    }
  };
  const attachTask = (taskItem: any, isSelected: boolean) => {
    setTasksError('');
    setTempIntervals((prevIntervals: any) =>
      prevIntervals.map((interval: any) =>
        interval?.id.toString() === taskItem.interval_id.toString()
          ? {
              ...interval,
              task: isSelected
                ? interval?.task.filter((task: any) => task.id !== taskItem.id)
                : interval?.task
                ? [...interval?.task, taskItem]
                : [taskItem],
            }
          : interval,
      ),
    );
  };

  const removeTaskItem = (taskItem: any) => {
    setTasksError('');
    showAlert('Warning', 'Are you want to remove the service task?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          setModelIntervals((prevIntervals: any) =>
            prevIntervals.map((interval: any) =>
              interval?.id.toString() === taskItem.interval_id.toString()
                ? {
                    ...interval,
                    task: interval?.task.filter(
                      (task: any) =>
                        task.id.toString() !== taskItem.id.toString(),
                    ),
                  }
                : interval,
            ),
          );
        },
      },
    ]);
  };

  const formComponent = () => {
    console.log(templateData, 'TASK EDIT DATA=======');
    return (
      <>
        {isEdit ? (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'Edit Service Template'}</Text>
          </View>
        ) : null}

        <View style={templateFormStyle.detailsContainer}>
          {/* <Text style={templateFormStyle.titleText}>SERVICE TEMPLATE</Text> */}
          <Formik
            innerRef={formikRef}
            initialValues={{
              name: taskEditData ? taskEditData?.name.toString() : '',
              model_id: taskEditData ? taskEditData?.model_id.toString() : '',
              isEdit: false,
            }}
            validationSchema={serviceTemplateValidation}
            onSubmit={(values, {resetForm}) => {
              updateServiceTemplates(values, resetForm);
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
                    value={values.name}
                    PlaceHolder="Enter template name"
                    maxLength={100}
                    label="Service template name"
                    onBlur={handleBlur('name')}
                    onChange={handleChange('name')}
                    error={
                      touched.name && errors.name ? errors.name.toString() : ''
                    }
                  />
                  <DropDown
                    value={values.model_id}
                    onChange={async selectedItem => {
                      await setEditTasks(null);
                      await setModelIntervals([]);
                      await setModelIntervalTasks([]);
                      await setSelectedModel(selectedItem.toString());

                      getModelIntervals(selectedItem.toString(), true);

                      handleChange('model_id')(selectedItem.toString());
                    }}
                    setTouched={() => setFieldTouched('model_id', true)}
                    items={eqModels}
                    label="Equipment model"
                    error={
                      touched.model_id && errors.model_id
                        ? errors.model_id?.toString()
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
                        Service Tasks
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          setTempIntervals(modelIntervals);
                          setAttachVisible(true);
                        }}
                        style={styles.attachBtn}>
                        <Text
                          style={{
                            color: Colors.white,
                            fontSize: getHeight(55),
                          }}>
                          Attach New
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {tasksError ? (
                      <Text style={CommonStyles.errorText}>{tasksError}</Text>
                    ) : null}
                    {modelIntervals.length > 0 ? (
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={modelIntervals}
                        renderItem={({item}: any) => {
                          return (
                            <TemplateTaskItem
                              onPressTask={(task: any) => {
                                removeTaskItem(task);
                              }}
                              isView={true}
                              isRemove={true}
                              isSelected={false}
                              key={item.id}
                              item={item}
                            />
                          );
                        }}
                      />
                    ) : (
                      <Text
                        style={{fontSize: getHeight(55), color: Colors.black}}>
                        No intervals found!
                      </Text>
                    )}
                  </View>
                </View>
                {isEdit ? (
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
                          let tasks = modelIntervals.flatMap((interval: any) =>
                            (interval.task || []).map((task: any) => task.id),
                          );
                          if (tasks.length < 1) {
                            setTasksError('Service tasks is required');
                          }
                          handleSubmit();
                        }}
                        label="Save"
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    <FormButton
                      isYellow={true}
                      onPress={() => {
                        let tasks = modelIntervals.flatMap((interval: any) =>
                          (interval.task || []).map((task: any) => task.id),
                        );

                        if (tasks.length < 1) {
                          setTasksError('Service tasks is required');
                        }
                        handleSubmit();
                      }}
                      label={'Create'}
                    />
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
              onPress={() => navigation.navigate(screens.templatesAndSetup)}
            />
            <Text style={templateFormStyle.title}>Create Service Template</Text>
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

      {/* =============== section to Attach service tasks ============ */}

      <Modal animationType="slide" transparent visible={attachVisible}>
        <View
          style={[
            CommonStyles.containerFlex1,
            {
              backgroundColor: Colors.transparentBlack,
              justifyContent: 'flex-end',
              alignItems: 'center',
            },
          ]}>
          <View
            style={{
              height: getHeight(1.2),
              width: getWidth(1.05),
              backgroundColor: Colors.white,
              padding: getWidth(18),
              borderRadius: 24,
            }}>
            <View style={styles.closeContainer}>
              <Text style={styles.modalTitle}>Attach Service Tasks</Text>
            </View>
            <View style={{height: '85%'}}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={Object.values(modelIntervalTasks)}
                renderItem={({item}: any) => {
                  return (
                    <TemplateTaskItem
                      onPressTask={(taskItem: any, isSelected: boolean) => {
                        attachTask(taskItem, isSelected);
                      }}
                      selectedItems={tempIntervals}
                      isSelected={false}
                      key={item.id}
                      item={item}
                    />
                  );
                }}
              />
            </View>
            <View style={{height: '10%'}}>
              <View style={CommonStyles.flexRowContainer}>
                <View style={CommonStyles.containerFlex1}>
                  <FormButton
                    onPress={() => {
                      setTempIntervals([]);
                      setAttachVisible(false);
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
                    onPress={() => {
                      setModelIntervals(tempIntervals);
                      setTempIntervals([]);
                      setAttachVisible(false);
                    }}
                    label="Save"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Alert />
    </>
  );
};

export default ServiceTemplateForm;
