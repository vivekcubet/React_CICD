/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, Modal} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {getHeight, getWidth} from '../../../../../theme/Constants';
import CommonStyles from '../../../../../theme/CommonStyles';
import styles from './styles';
import Colors from '../../../../../theme/Colors';
import {
  FilePicker,
  FormButton,
  InputText,
  KeyboardAwareScroll,
  RadioIcon,
  TaskDocItem,
} from '../../../../../components';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useAlert} from '../../../../../utils/hooks';
import {useDeleteServiceDoc} from '../../../../../utils/LocalDBHooks';
import deleteFile from '../../../../../utils/helpers/deleteLocalFile';
interface TaskCheckInterface {
  taskList: any;
  serviceDocs?: any;
  onTaskDataChange: any;
  disabled?: boolean;
}
const TaskCheckList: FC<TaskCheckInterface> = ({
  taskList = [],
  serviceDocs = [],
  onTaskDataChange,
  disabled = false,
}) => {
  const [deleteServiceDoc] = useDeleteServiceDoc();
  const {Alert, showAlert} = useAlert();
  const [taskCheckData, setTaskCheck] = useState<any>(taskList);
  const [editTaskItem, setTaskItem] = useState<any>(null);
  const [taskFile, setTaskFile] = useState<any>(null);
  const [fileError, setFileError] = useState<any>('');
  const saveTask = (values: any, resetForm: any) => {
    console.log(values);
    let taskData = {
      ...editTaskItem,
      ...values,
      isLocal: true,
      upload: taskFile,
    };
    let tempTaskCheckData = [...taskCheckData];
    const index = taskCheckData.findIndex(
      (item: any) => item.task_id === editTaskItem.task_id,
    );

    if (index !== -1) {
      tempTaskCheckData[index] = taskData; // Task with matching task_id found, replace it
    } else {
      tempTaskCheckData.push(taskData); // Task with matching task_id not found, push it to the array
    }
    setTaskCheck(tempTaskCheckData);
    setTaskFile(null);
    setTaskItem(null);
    resetForm();
  };
  useEffect(() => {
    onTaskDataChange(taskCheckData);
  }, [taskCheckData]);

  const deleteTaskData = (index: any) => {
    const tempTaskCheckData = [...taskCheckData];
    if (tempTaskCheckData[index]) {
      const {task_id, task_name, id = null} = tempTaskCheckData[index];
      tempTaskCheckData[index] = {task_id, is_checked: null, task_name, id};
    }
    setTaskCheck(tempTaskCheckData);
  };
  return (
    <View>
      <Text style={[CommonStyles.font45bold, styles.titleTxt]}>Checklist</Text>
      <View
        style={[
          CommonStyles.flexRowContainer,
          {
            minHeight: getHeight(25),
            backgroundColor: Colors.transparentAppYellow,
          },
        ]}>
        <View style={[styles.tableHead]}>
          <Text style={styles.tableTitle}>Tasks</Text>
        </View>
        <View
          style={[
            styles.tableHead,
            CommonStyles.containerFlex1,
            CommonStyles.contentCenter,
          ]}>
          <Text style={styles.tableTitle}>Good</Text>
        </View>
        <View
          style={[
            styles.tableHead,
            CommonStyles.containerFlex1,
            CommonStyles.contentCenter,
          ]}>
          <Text style={styles.tableTitle}>Poor</Text>
        </View>
      </View>
      <View
        style={{
          marginBottom: getHeight(55),
          borderBottomColor: Colors.transparentAppYellow,
          borderBottomWidth: getHeight(800),
        }}>
        {taskList && taskList.length > 0 ? (
          <>
            {taskList.map((item: any) => {
              return (
                <View
                  key={item.toString()}
                  style={[
                    CommonStyles.flexRowContainer,
                    {
                      minHeight: getHeight(25),
                    },
                  ]}>
                  <View style={[styles.tableHead, {padding: getHeight(55)}]}>
                    <Text style={styles.tableContentText}>
                      {item?.task_name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableHead,
                      CommonStyles.containerFlex1,
                      CommonStyles.contentCenter,
                    ]}>
                    <RadioIcon
                      disabled={disabled}
                      onPress={() => {
                        if (!disabled) {
                          setTaskItem({
                            upload: null,
                            comment: null,
                            task_name: item?.task_name,
                            task_id: item?.task_id,
                            is_checked: 1,
                          });
                        }
                      }}
                      isSelected={
                        item?.is_checked === 1 ||
                        (editTaskItem?.task_id === item?.task_id &&
                          editTaskItem?.is_checked === 1)
                          ? true
                          : false
                      }
                      size={28}
                    />
                  </View>
                  <View
                    style={[
                      styles.tableHead,
                      CommonStyles.containerFlex1,
                      CommonStyles.contentCenter,
                    ]}>
                    <RadioIcon
                      disabled={disabled}
                      onPress={() => {
                        if (!disabled) {
                          setTaskItem({
                            upload: null,
                            comment: null,
                            task_name: item?.task_name,
                            task_id: item?.task_id,
                            is_checked: 0,
                          });
                        }
                      }}
                      isSelected={
                        item?.is_checked === 0 ||
                        (editTaskItem?.task_id === item?.task_id &&
                          editTaskItem?.is_checked === 0)
                          ? true
                          : false
                      }
                      size={28}
                    />
                  </View>
                </View>
              );
            })}
          </>
        ) : null}
      </View>
      {taskCheckData.filter((item: any) => item.is_checked !== null).length >
      0 ? (
        <>
          <Text style={[CommonStyles.font45bold, styles.titleTxt]}>
            Task Comments & Photos
          </Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.borderGray,
              marginBottom: getHeight(45),
            }}>
            {taskCheckData.map((item: any, index: number) => {
              let localDoc = serviceDocs.find((docItem: any) => {
                return docItem?.id.toString() === item?.id.toString();
              });
              console.log('====found=====', localDoc);
              return (
                <>
                  {item?.comment ? (
                    <TaskDocItem
                      disabled={disabled}
                      key={item.id}
                      isLocal={localDoc?.localPath ? true : item?.isLocal}
                      filePath={
                        localDoc?.localPath
                          ? localDoc?.localPath
                          : item?.upload?.uri
                      }
                      comments={item?.comment}
                      taskName={item?.task_name}
                      onDeletePress={() => {
                        showAlert(
                          'Warning',
                          'Are you want to remove the document?',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                            },
                            {
                              text: 'Confirm',
                              onPress: async () => {
                                if (localDoc) {
                                  deleteServiceDoc(localDoc?.id);
                                  deleteFile(localDoc?.localPath);
                                }
                                deleteTaskData(index);
                              },
                            },
                          ],
                        );
                      }}
                    />
                  ) : null}
                </>
              );
            })}
          </View>
        </>
      ) : null}
      <Modal transparent visible={editTaskItem ? true : false}>
        <View style={[CommonStyles.containerFlex1, styles.modalContainer]}>
          <KeyboardAwareScroll>
            <View
              style={[
                CommonStyles.containerFlex1,
                styles.modalContentContainer,
              ]}>
              <View style={styles.modalTitleContainer}>
                <View style={styles.closeContainer}>
                  <Text style={styles.modalTitle}>Task Comments & Photos</Text>
                </View>
                <Formik
                  initialValues={{
                    comment: '',
                  }}
                  validationSchema={yup.object().shape({
                    comment: yup.string().required('Comment is required'),
                  })}
                  onSubmit={(values, {resetForm}) => {
                    saveTask(values, resetForm);
                  }}>
                  {({
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    touched,
                    values,
                    errors,
                  }) => (
                    <>
                      <FilePicker
                        onPickFile={(file: any) => {
                          setFileError('');
                          setTaskFile(file);
                        }}
                        file={taskFile}
                        PlaceHolder="Choose a file"
                        label="Attach a file"
                        error={fileError ? fileError : ''}
                      />
                      <InputText
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
                      <View
                        style={[
                          CommonStyles.flexRowContainer,
                          {marginTop: getHeight(45)},
                        ]}>
                        <View style={CommonStyles.containerFlex1}>
                          <FormButton
                            onPress={() => {
                              setTaskFile(null);
                              setTaskItem(null);
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
                              if (!taskFile) {
                                setFileError('File is required');
                              }
                              handleSubmit();
                            }}
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
    </View>
  );
};

export default TaskCheckList;
