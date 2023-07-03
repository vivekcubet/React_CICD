import {Text, View} from 'react-native';
import React, {useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DetailsItem,
  FormButton,
  KeyboardAwareScroll,
  LockButton,
} from '../../../../components';
import styles from './styles';
import {ServiceIntervalForm} from '../../../../screens';
import {getHeight} from '../../../../theme/Constants';
import screens from '../../../../navigation/screens';
import {
  useArchiveServiceInterval,
  useGetServiceIntervals,
  useUnArchiveServiceInterval,
} from '../../../../Api/hooks';
import {useAlert} from '../../../../utils/hooks';
import {RootState} from '../../../../redux/store';
import {useSelector} from 'react-redux';
import {END_POINTS} from '../../../../Api/constants';
import usePostApi from '../../../../Api/hooks/usePostApi';
import {useToast} from 'react-native-toast-notifications';

const ServiceIntervalDetails = ({route, navigation}: any) => {
  const {
    intervalData = null,
    isPublic = false,
    isArchived = false,
    category = null,
  } = route.params;
  console.log(intervalData, 'DATA====');
  const toast = useToast();
  const {Alert, showAlert} = useAlert();
  const [isEdit, setEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [archiveInterval] = useArchiveServiceInterval();
  const [unArchiveInterval] = useUnArchiveServiceInterval();
  const [getServiceIntervals] = useGetServiceIntervals();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const [postApi] = usePostApi();
  const updateSuccess = () => {
    setEdit(false);
    setEditData(null);
    navigation.navigate(screens.templatesAndSetup);
  };

  const archiveIntervalItem = async (id: any) => {
    showAlert('Warning', 'Are you want to archive the  service interval?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await archiveInterval({
            id: id,
          });
          if (res) {
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const unArchiveIntervalItem = async (id: any) => {
    showAlert('Warning', 'Are you want to unarchive the service interval?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await unArchiveInterval({
            id: id,
          });
          if (res) {
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const createDuplicateInterval = async () => {
    showAlert('Warning', 'Are you want to duplicate the service interval?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await postApi({
            endPoint: END_POINTS.DUPLICATE_SERVICE_INTERVAL,
            params: {
              company_id: userCompany?.company_id,
              model_id: intervalData?.intervals[0]?.model_id,
              interval_hours: intervalData.intervals.map((item: any) =>
                String(item.interval_hours),
              ),
            },
          });

          if (response) {
            await getServiceIntervals({isLoader: true});
            toast.show(response.message);
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
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
          <View style={styles.titleContainer}>
            <View>
              <Text style={isEdit ? CommonStyles.formTitle : styles.title}>
                {isEdit ? 'Edit Service Interval' : category?.name}
              </Text>
            </View>
            {isPublic ? (
              <LockButton label="Service interval" isPublic={isPublic} />
            ) : null}
          </View>
          {isEdit ? (
            <ServiceIntervalForm
              onSuccess={() => updateSuccess()}
              onCancelPress={() => {
                setEditData(null);
                setEdit(false);
              }}
              isEdit={true}
              intervalData={editData}
            />
          ) : (
            <View style={styles.detailsContainer}>
              <Text style={styles.titleText}>SERVICE INTERVAL</Text>
              <View style={styles.detailsItemContainer}>
                <DetailsItem
                  label="Equipment Model"
                  value={intervalData?.name}
                />
                {intervalData.intervals.map((item: any, index: number) => {
                  return (
                    <DetailsItem
                      key={item?.id.toString()}
                      onEditPress={() => {
                        if (isArchived) {
                          console.log('first');
                        } else {
                          setEditData(item);
                          setEdit(true);
                        }
                      }}
                      onArchivePress={() => {
                        if (isArchived) {
                          unArchiveIntervalItem(item?.id);
                        } else {
                          archiveIntervalItem(item?.id);
                        }
                      }}
                      lockLabel="Interval"
                      isLock={item?.lock_status}
                      isPublic={isPublic}
                      isArchived={isPublic ? false : isArchived}
                      label={index === 0 ? 'Interval hours' : ''}
                      value={item?.interval_hours}
                      isEdit={isArchived || isPublic ? false : true}
                    />
                  );
                })}

                {/* <DetailsItem label="Model" value={equipment?.model} /> */}
              </View>
              {isPublic ? (
                <FormButton
                  isYellow={true}
                  onPress={() => {
                    createDuplicateInterval();
                  }}
                  label={'DUPLICATE TO MY TEMPLATES'}
                />
              ) : null}
            </View>
          )}
        </View>
      </KeyboardAwareScroll>
      <Alert />
    </View>
  );
};

export default ServiceIntervalDetails;
