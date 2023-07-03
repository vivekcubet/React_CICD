/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, StyleSheet, Modal} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {getHeight, getWidth} from '../../../../theme/Constants';
import Colors from '../../../../theme/Colors';
import * as yup from 'yup';
import {
  FilePicker,
  FormButton,
  InputText,
  KeyboardAwareScroll,
  LinkText,
  TaskDocItem,
} from '../../../../components';
import {Formik} from 'formik';
import {useAlert} from '../../../../utils/hooks';
import deleteFile from '../../../../utils/helpers/deleteLocalFile';
import {useDeleteRepairDocs} from '../../../../utils/LocalDBHooks';
interface RepairWorkInterface {
  workList: any;
  repairDocs?: any;
  workDeleteIds: any;
  disabled?: boolean;
  onWorkDataUpdate: any;
  onDeleteArrayUpdate: any;
  error: any;
}
const WorkData: FC<RepairWorkInterface> = ({
  workList = [],
  repairDocs = [],
  workDeleteIds = [],
  onWorkDataUpdate,
  onDeleteArrayUpdate,
  disabled = false,
  error = '',
}) => {
  const [deleteRepairDoc] = useDeleteRepairDocs();
  const {Alert, showAlert} = useAlert();
  const [workDeleteArray, setWrkDeleteArray] = useState(workDeleteIds);
  const [workCompleted, setWorkCompleted] = useState(workList);
  const [isWrkVisible, setWrkVisible] = useState(false);
  const [taskFile, setTaskFile] = useState<any>(null);
  const [editObject, setEditObject] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<any>(null);
  const [fileError, setFileError] = useState<any>('');
  const saveWorkData = (values: any, resetForm: any) => {
    console.log(editIndex, 'TEST========');
    console.log(values);
    let workData = {
      ...values,
      work_file: taskFile,
      id: editObject?.id ? editObject?.id : null,
    };
    if (editIndex !== null && editIndex !== undefined) {
      let updatedWorkList = [...workList];
      updatedWorkList[editIndex] = workData;

      setWorkCompleted(updatedWorkList);
    } else {
      setWorkCompleted([...workList, workData]);
    }
    setTaskFile(null);
    setWrkVisible(false);
    resetForm();
  };

  useEffect(() => {
    onWorkDataUpdate(workCompleted);
    onDeleteArrayUpdate(workDeleteArray);
  }, [workCompleted, workDeleteArray]);
  const deleteWorkData = (workData: any, index: number) => {
    showAlert('Warning', 'Are you want to remove the work record? ', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          const deleteId = workData?.id;
          if (deleteId) {
            setWrkDeleteArray([...workDeleteIds, deleteId]);
          }
          setWorkCompleted(workList.filter((_: any, i: any) => i !== index));
        },
      },
    ]);
  };

  return (
    <View>
      <View style={styles.titleRowContainer}>
        <View style={styles.titleContainer}>
          <Text style={[CommonStyles.font45bold, styles.titleTxt]}>
            Work completed
          </Text>
        </View>
        <View style={styles.addBtnContainer}>
          {!disabled ? (
            <LinkText
              onPress={() => {
                setEditObject(null);
                setEditIndex(null);
                setWrkVisible(true);
              }}
              color={Colors.errorColor}
              label="Add +"
            />
          ) : null}
        </View>
      </View>
      {workList.length > 0 ? (
        <>
          {workList.map((item: any, index: number) => {
            let localDoc = repairDocs.find((docItem: any) => {
              return docItem?.id.toString() === item?.id.toString();
            });
            return (
              <TaskDocItem
                isEditable={true}
                onEditPress={() => {
                  setTaskFile(item.work_file);
                  setEditObject(item);
                  setEditIndex(index);
                  setWrkVisible(true);
                }}
                onDeletePress={() => {
                  if (localDoc) {
                    deleteRepairDoc(localDoc?.id);
                    deleteFile(localDoc?.localPath);
                  }
                  deleteWorkData(item, index);
                }}
                disabled={disabled}
                key={item.id}
                isLocal={localDoc?.localPath ? true : item?.isLocal}
                filePath={
                  localDoc?.localPath
                    ? localDoc?.localPath
                    : item?.work_file?.uri
                }
                comments={item?.work_comment}
                taskName={item?.work_name}
              />
            );
          })}
        </>
      ) : (
        <>
          <View
            style={[
              styles.emptyView,
              {marginBottom: error ? getHeight(145) : getHeight(45)},
            ]}>
            <Text style={{color: Colors.placeholderColor}}>
              Records not added
            </Text>
          </View>
          <Text style={[CommonStyles.errorText, styles.errorText]}>
            {error}
          </Text>
        </>
      )}
      <Modal transparent visible={isWrkVisible}>
        <View style={[CommonStyles.containerFlex1, styles.modalContainer]}>
          <KeyboardAwareScroll>
            <View
              style={[
                CommonStyles.containerFlex1,
                styles.modalContentContainer,
              ]}>
              <View style={styles.modalTitleContainer}>
                <View style={styles.closeContainer}>
                  <Text style={styles.modalTitle}>Work completed</Text>
                </View>
                <Formik
                  initialValues={{
                    work_comment: editObject ? editObject?.work_comment : '',
                    work_name: editObject ? editObject?.work_name : '',
                    isLocal: false,
                  }}
                  validationSchema={yup.object().shape({
                    work_comment: yup.string().required('Comment is required'),
                    work_name: yup
                      .string()
                      .required('Work completed is required'),
                  })}
                  onSubmit={(values, {resetForm}) => {
                    if (taskFile) {
                      saveWorkData(values, resetForm);
                    }
                  }}>
                  {({
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    setFieldValue,
                    touched,
                    values,
                    errors,
                  }) => (
                    <>
                      <InputText
                        value={values.work_name}
                        PlaceHolder="Enter work completed"
                        label="Work completed"
                        onBlur={handleBlur('work_name')}
                        onChange={handleChange('work_name')}
                        error={
                          touched.work_name && errors.work_name
                            ? errors.work_name.toString()
                            : ''
                        }
                      />
                      <FilePicker
                        onPickFile={(file: any) => {
                          console.log(file);
                          setFileError('');
                          setFieldValue('isLocal', true);
                          setTaskFile(file);
                        }}
                        file={taskFile}
                        PlaceHolder="Choose a file"
                        label="Attach a file"
                        error={fileError ? fileError : ''}
                      />
                      <InputText
                        value={values.work_comment}
                        isTextArea={true}
                        PlaceHolder="Enter comments"
                        label="Comments"
                        onBlur={handleBlur('work_comment')}
                        onChange={handleChange('work_comment')}
                        error={
                          touched.work_comment && errors.work_comment
                            ? errors.work_comment.toString()
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
                              setWrkVisible(false);
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
const styles = StyleSheet.create({
  titleTxt: {
    fontSize: getHeight(55),
    color: Colors.black,
  },
  emptyView: {
    minHeight: getHeight(20),
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: Colors.borderGray,
    alignSelf: 'center',
  },
  titleRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '95%',
    marginBottom: getHeight(45),
  },
  titleContainer: {
    flex: 2,
  },
  addBtnContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Colors.transparentBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    minHeight: getHeight(1),
    justifyContent: 'center',
  },
  modalTitleContainer: {
    width: getWidth(1.1),
    backgroundColor: Colors.white,
    padding: getWidth(18),
    borderRadius: 10,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: getHeight(45),
    fontWeight: '600',
    fontFamily: 'Inter',
    marginBottom: getHeight(35),
    color: Colors.black,
  },
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
  errorText: {marginBottom: getHeight(45), width: '90%', alignSelf: 'center'},
});
export default WorkData;
