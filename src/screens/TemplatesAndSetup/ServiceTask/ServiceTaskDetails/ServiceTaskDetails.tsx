/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DetailsItem,
  Icon,
  KeyboardAwareScroll,
  LinkText,
  LockButton,
} from '../../../../components';
import styles from './styles';
import {ServiceTaskForm} from '../../../../screens';
import {getHeight} from '../../../../theme/Constants';
import screens from '../../../../navigation/screens';
import Colors from '../../../../theme/Colors';
import {useFocusEffect} from '@react-navigation/native';
import SvgIcon from '../../../../assets/Icons/SvgIcon';

const ServiceIntervalDetails = ({route, navigation}: any) => {
  const {
    taskData = null,
    isPublic = false,
    isArchived = false,
    category = null,
  } = route.params;
  console.log(taskData, 'INT DATA====', isPublic);
  const [isEdit, setEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const updateSuccess = () => {
    setEdit(false);
    setEditData(null);
    navigation.navigate(screens.templatesAndSetup);
  };
  useFocusEffect(
    React.useCallback(() => {
      setEdit(false);
    }, []),
  );

  return (
    <View style={CommonStyles.mainContainer}>
      <KeyboardAwareScroll>
        <View
          style={[CommonStyles.containerFlex1, {paddingBottom: getHeight(5)}]}>
          <BackButton
            onPress={() => {
              setEditData(null);
              setEdit(false);
              if (!isEdit) {
                navigation.navigate(screens.templatesAndSetup);
              }
            }}
          />

          {isEdit ? (
            <ServiceTaskForm
              onSuccess={() => updateSuccess()}
              onCancelPress={() => {
                setEditData(null);
                setEdit(false);
              }}
              isEdit={true}
              isPublic={isPublic}
              taskData={editData}
            />
          ) : (
            <>
              <View style={styles.titleContainer}>
                <View>
                  <Text style={styles.title}>{category?.name}</Text>
                  {/* <Text style={styles.subTitle}>
                {equipment?.model + '  •  ' + equipment?.brand}
              </Text> */}
                </View>
                {isPublic ? (
                  <LockButton label="Service Task" isPublic={isPublic} />
                ) : null}
                {!isArchived && !isPublic ? (
                  <LinkText
                    color={Colors.btnOrange}
                    onPress={() =>
                      navigation.navigate(screens.serviceTaskForm, {
                        model: taskData?.id,
                      })
                    }
                    label="+ Add new"
                  />
                ) : null}
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.titleText}>SERVICE TASK</Text>
                <View style={styles.detailsItemContainer}>
                  <DetailsItem label="Equipment Model" value={taskData?.name} />
                  <Text style={styles.labelText}>All Tasks for Equipment</Text>
                  {Object.values(taskData?.intervals).map((item: any) => {
                    console.log(item, 'TASK===');
                    return (
                      <View
                        key={item?.id?.toString()}
                        style={{
                          borderWidth: 0.5,
                          padding: 10,
                          borderColor: Colors.borderGray,
                          marginTop: getHeight(55),
                          backgroundColor: Colors.backgroundGray,
                        }}>
                        <Text
                          style={{
                            fontSize: getHeight(55),
                            fontWeight: '700',
                            marginBottom: getHeight(55),
                          }}>
                          {item?.interval_hours}
                          {' Hours'}
                        </Text>
                        {item?.task.map((task: any) => {
                          return (
                            <View
                              key={task?.id?.toString()}
                              style={{
                                backgroundColor: Colors.white,
                                width: '100%',
                                padding: 10,
                                paddingBottom: getHeight(50),
                              }}>
                              <View
                                style={[
                                  CommonStyles.flexRowContainer,
                                  {justifyContent: 'space-between'},
                                ]}>
                                <Text
                                  style={{
                                    fontSize: getHeight(55),
                                    fontWeight: '500',
                                    marginBottom: getHeight(65),
                                    color: Colors.black,
                                  }}>
                                  {task?.name}
                                </Text>
                                {/* {isPublic ? null : ( */}
                                <TouchableOpacity
                                  onPress={() => {
                                    setEditData({
                                      interval_hours: item?.id,
                                      model_id: item?.model_id,
                                      task: task,
                                      isArchive: isArchived,
                                      isPublic: isPublic,
                                      isLock: task?.lock_status,
                                    });
                                    setEdit(true);
                                  }}
                                  style={styles.editButton}>
                                  {task?.lock_status || isPublic ? (
                                    <SvgIcon.ViewIcon
                                      width={getHeight(42)}
                                      height={getHeight(42)}
                                    />
                                  ) : (
                                    <Icon
                                      color={Colors.black}
                                      iconName={
                                        task?.lock_status ||
                                        isArchived ||
                                        isPublic
                                          ? 'eye'
                                          : 'edit'
                                      }
                                      size={getHeight(45)}
                                      family="Feather"
                                    />
                                  )}
                                </TouchableOpacity>
                                {/* )} */}
                              </View>
                              {task?.parts.map((part: any) => {
                                console.log(part, 'PART ITEM====');
                                return (
                                  <View
                                    key={part.toString()}
                                    style={CommonStyles.flexRowContainer}>
                                    <Text
                                      style={{
                                        fontSize: getHeight(55),
                                        color: Colors.iconGray,
                                        paddingBottom: getHeight(95),
                                      }}>
                                      {part?.part?.description}
                                      {'  •  '}
                                      {part?.part?.part_no}
                                      {'  •  '}
                                      {part?.quantity}{' '}
                                      {part?.part?.measurement_type?.name}
                                      {/* [{part?.quantity}] */}
                                    </Text>
                                  </View>
                                );
                              })}
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          )}
        </View>
      </KeyboardAwareScroll>
    </View>
  );
};

export default ServiceIntervalDetails;
