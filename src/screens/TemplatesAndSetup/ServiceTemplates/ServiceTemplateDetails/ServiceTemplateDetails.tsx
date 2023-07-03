/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {FlatList, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DetailsItem,
  FormButton,
  KeyboardAwareScroll,
  LockButton,
  TemplateTaskItem,
} from '../../../../components';
import styles from './styles';
import {ServiceTemplateForm} from '../../../../screens';
import {getHeight, getWidth} from '../../../../theme/Constants';
import screens from '../../../../navigation/screens';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {END_POINTS} from '../../../../Api/constants';
import usePostApi from '../../../../Api/hooks/usePostApi';
import useArchiveApi from '../../../../Api/hooks/useArchiveApi';
import useAlert from '../../../../utils/hooks/useAlert';
import {
  useGetServiceIntervals,
  useGetServiceTasks,
  useGetServiceTemplates,
} from '../../../../Api/hooks';
import {useToast} from 'react-native-toast-notifications';

const ServiceIntervalDetails = ({route, navigation}: any) => {
  const {
    templateData = null,
    isPublic = false,
    isArchived = false,
    mainItem = null,
  } = route.params;
  console.log(templateData, 'INT DATA====', isPublic);
  const {Alert, showAlert} = useAlert();
  const toast = useToast();
  const {myServiceIntervals, publicServiceIntervals} = useSelector(
    (state: RootState) => state.ServiceIntervalReducer,
  );
  const [getServicesTemplateList] = useGetServiceTemplates();
  const [getServiceIntervals] = useGetServiceIntervals();
  const [getTaskList] = useGetServiceTasks();
  const [postApi] = usePostApi();
  const [archiveData] = useArchiveApi();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const [interValTasks, setIntervalTasks] = useState<any>([]);
  const [isEdit, setEdit] = useState(false);
  const updateSuccess = () => {
    setEdit(false);
    navigation.navigate(screens.templatesAndSetup);
  };
  useFocusEffect(
    React.useCallback(() => {
      setEdit(false);
    }, []),
  );
  useEffect(() => {
    setTaskList();
    console.log(templateData, 'TEMPLATE===', mainItem);
  }, [templateData]);

  const setTaskList = async () => {
    const intervalList = isPublic
      ? [...publicServiceIntervals]
      : [...myServiceIntervals];
    const intervals = intervalList.reduce((interval: any, category: any) => {
      const model = category.models.find(
        (modelItem: any) =>
          modelItem.id.toString() === templateData?.model_id.toString(),
      );
      return model ? model.intervals : interval;
    }, []);

    if (templateData.tasks && templateData.tasks.length > 0) {
      const tempInterval = await Promise.all(
        intervals.map(async (interval: any) => {
          const interValItem = {...interval};
          await templateData.tasks.forEach((taskItem: any) => {
            if (
              interval?.id.toString() === taskItem?.task?.interval_id.toString()
            ) {
              interValItem.task = interValItem.task
                ? [...interValItem.task, taskItem.task]
                : [taskItem.task];
            }
          });
          return interValItem;
        }),
      );
      console.log(tempInterval, 'TEST=======');
      setIntervalTasks(tempInterval);
    } else {
      setIntervalTasks(intervals);
    }
  };

  useEffect(() => {
    console.log(setIntervalTasks, 'INTERVAL TASKS');
  }, [setIntervalTasks]);

  const archiveTemplate = async () => {
    showAlert('Warning', 'Are you want to archive the Service template?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await archiveData({
            endPoint:
              END_POINTS.ARCHIVE_SERVICE_TEMPLATE + '?id=' + templateData?.id,
            params: {},
          });

          if (response) {
            await getServicesTemplateList({isLoader: true});
            toast.show(response.message);
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const unArchiveTemplate = async () => {
    showAlert('Warning', 'Are you want to unarchive the Service template?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await postApi({
            endPoint: END_POINTS.UNARCHIVE_SERVICE_TEMPLATE,
            params: {id: templateData?.id},
          });

          if (response) {
            await getServicesTemplateList({isLoader: true});
            toast.show(response.message);
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const duplicateTemplate = async () => {
    console.log(templateData, 'TEMPLATE');
    showAlert(
      'Warning',
      'Are you want to duplicate the the service template?',
      [
        {text: 'Cancel', onPress: () => null},
        {
          text: 'Confirm',
          onPress: async () => {
            const response = await postApi({
              endPoint: END_POINTS.DUPLICATE_SERVICE_TEMPLATE,
              params: {
                company_id: userCompany?.company_id,
                template_id: templateData?.id,
              },
            });

            if (response) {
              await getServicesTemplateList({isLoader: false});
              await getServiceIntervals({isLoader: false});
              await getTaskList({isLoader: true});
              toast.show(response.message);
              navigation.navigate(screens.templatesAndSetup);
            }
          },
        },
      ],
    );
  };
  return (
    <View style={CommonStyles.mainContainer}>
      <KeyboardAwareScroll>
        <View
          style={[CommonStyles.containerFlex1, {paddingBottom: getHeight(5)}]}>
          <BackButton
            onPress={() => {
              navigation.navigate(screens.templatesAndSetup);
              setEdit(false);
            }}
          />
          <View style={styles.titleContainer}>
            {!isEdit ? (
              <View>
                <Text style={styles.title}>{mainItem?.name}</Text>
                <Text style={styles.subTitle}>
                  {'Tasks ' + templateData?.task_count}
                </Text>
              </View>
            ) : null}
            {templateData?.lock_status || isPublic ? (
              <LockButton
                isPublic={isPublic}
                usedLocation="Equipment"
                label={'Service template'}
              />
            ) : null}
          </View>
          {isEdit ? (
            <ServiceTemplateForm
              onSuccess={() => updateSuccess()}
              onCancelPress={() => {
                setEdit(false);
              }}
              templatesTasks={interValTasks}
              isArchived={isArchived}
              isEdit={true}
              isPublic={isPublic}
              templateData={templateData}
            />
          ) : (
            <View style={styles.detailsContainer}>
              <Text style={styles.titleText}>SERVICE TEMPLATE</Text>
              <View style={styles.detailsItemContainer}>
                <DetailsItem
                  label="Service Template Name"
                  value={templateData?.name}
                />
                <DetailsItem
                  label="Equipment Model"
                  value={templateData?.model_name}
                />
                <Text style={styles.labelText}>Service Tasks</Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={interValTasks}
                  renderItem={({item}: any) => {
                    return (
                      <TemplateTaskItem
                        isView={true}
                        isSelected={false}
                        key={item?.id}
                        item={item}
                      />
                    );
                  }}
                />
              </View>
              {isPublic || isArchived || templateData?.lock_status ? (
                <>
                  {templateData.lock_status &&
                  !isArchived &&
                  !isPublic ? null : (
                    <FormButton
                      isYellow={isArchived ? false : true}
                      onPress={() => {
                        if (isArchived) {
                          unArchiveTemplate();
                        } else {
                          duplicateTemplate();
                        }
                      }}
                      label={
                        isArchived ? 'Unarchive' : 'DUPLICATE TO MY TEMPLATES'
                      }
                    />
                  )}
                </>
              ) : (
                <View style={CommonStyles.flexRowContainer}>
                  <View style={CommonStyles.containerFlex1}>
                    <FormButton
                      onPress={() => {
                        archiveTemplate();
                      }}
                      label={'Archive'}
                    />
                  </View>
                  <View
                    style={[
                      CommonStyles.containerFlex1,
                      {paddingLeft: getWidth(40)},
                    ]}>
                    <FormButton
                      isYellow={true}
                      onPress={() => setEdit(true)}
                      label="Edit"
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </KeyboardAwareScroll>
      <Alert />
    </View>
  );
};

export default ServiceIntervalDetails;
