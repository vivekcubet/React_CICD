/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DropDown,
  FormButton,
  Icon,
  KeyboardAwareScroll,
  TextBox,
} from '../../../../components';
import {Formik} from 'formik';
import {serviceIntervalValidation} from '../../../../utils/validations';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {
  useGetEquipmentModels,
  useGetPartsCategories,
  usePostServiceInterval,
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
interface ServiceIntervalInterface {
  intervalData?: any;
  isEdit?: boolean;
  onCancelPress?: any;
  onSuccess?: any;
}
const ServiceIntervalForm: FC<ServiceIntervalInterface> = ({
  intervalData = null,
  isEdit = false,
  onCancelPress,
  onSuccess,
}) => {
  const formikRef = useRef<any>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getPartsCategories] = useGetPartsCategories();
  const [getEquipmentModels] = useGetEquipmentModels();
  const [postServiceInterval] = usePostServiceInterval();
  const {myEquipmentModels, publicEquipmentModels} = useSelector(
    (state: RootState) => state.EquipmentModelReducer,
  );
  const [eqModels, setEqModels] = useState([]);
  const [intervalEditData, setIntervalData] = useState(intervalData);
  const [intervalError, setError] = useState('');
  const [intervals, setIntervals] = useState<any>([]);
  useEffect(() => {
    console.log(intervalData, 'VALUES==');
    setIntervalData(intervalData);
    getInitialSetup();
  }, [intervalData]);
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
      setIntervals(!isEdit ? [] : []);
    }, []),
  );

  useEffect(() => {
    let array = [...myEquipmentModels];
    const result = array.reduce((acc, curr) => {
      const dataItem = curr.models.map((model: any) => ({
        value: model.id.toString(),
        label: model.name + ' - ' + curr?.name,
      }));
      return acc.concat(dataItem);
    }, []);
    result.sort((a: any, b: any) => a.label.localeCompare(b.label));
    setEqModels(result);
  }, [publicEquipmentModels, myEquipmentModels]);

  const getInitialSetup = async () => {
    await getPartsCategories();
    await getEquipmentModels({isLoader: true});
  };

  const updateInterval = async (values: any, resetForm: any) => {
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: intervalEditData?.id,
        }
      : {
          ...values,
          interval_hours: values.interval_hours
            ? [...intervals, values.interval_hours]
            : intervals,
        };
    if (isEdit && !values.interval_hours) {
      setError('Interval is required');
      return;
    } else if (!isEdit && intervals.length < 1 && !values.interval_hours) {
      setError('Interval is required');
      return;
    }
    let res = await postServiceInterval(postData);
    if (res) {
      if (!isEdit) {
        resetForm();
        navigation.navigate(screens.templatesAndSetup);
      } else {
        onSuccess();
      }
    }
  };
  const addNewInterval = (interval: any) => {
    if (!interval) {
      setError('Enter interval hours');
      return;
    }
    setIntervals((prevIntervals: any) => [...prevIntervals, interval]);
  };
  const removeItemIndex = (index: number) => {
    setIntervals((prevInterval: any): any =>
      prevInterval.filter((item: any, i: number) => i !== index),
    );
  };

  const formComponent = () => {
    return (
      <View style={templateFormStyle.detailsContainer}>
        {/* <Text style={templateFormStyle.titleText}>SERVICE INTERVAL</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            model_id: intervalEditData
              ? intervalEditData.model_id.toString()
              : '',
            interval_hours: intervalEditData
              ? intervalEditData?.interval_hours?.toString()
              : '',
            isEdit: false,
          }}
          validationSchema={serviceIntervalValidation}
          onSubmit={(values, {resetForm}) => {
            updateInterval(values, resetForm);
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
            values,
            errors,
          }) => (
            <>
              <View style={templateFormStyle.detailsItemContainer}>
                <DropDown
                  value={values.model_id}
                  onChange={selectedItem => {
                    console.log(selectedItem, 'ITEM====');
                    handleChange('model_id')(selectedItem.toString());
                  }}
                  items={eqModels}
                  label="Equipment model"
                  error={errors.model_id?.toString()}
                />
                <View style={styles.container}>
                  <Text style={styles.label}>Interval hours</Text>
                  {intervals.length > 0 ? (
                    <>
                      {intervals.map((intervalItem: any, index: number) => {
                        console.log(intervalItem, 'INTERVAL===');
                        return (
                          <View
                            key={intervalItem.toString()}
                            style={{
                              marginBottom: getHeight(45),
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View style={{width: '92%'}}>
                              <TextBox
                                editable={false}
                                maxLength={8}
                                value={intervalItem}
                                PlaceHolder="Enter Interval hour"
                                keyboardType={'number-pad'}
                              />
                            </View>
                            <TouchableOpacity
                              style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => {
                                removeItemIndex(index);
                              }}>
                              <Icon
                                color={Colors.black}
                                iconName={'close'}
                                size={getHeight(45)}
                                family="MaterialCommunityIcons"
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </>
                  ) : null}
                  <TextBox
                    onBlur={handleBlur('interval_hours')}
                    onChange={(value: string) => {
                      setError('');
                      setFieldValue('interval_hours', value.replace(/\D/g, ''));
                    }}
                    maxLength={8}
                    keyboardType={'number-pad'}
                    value={values.interval_hours}
                    PlaceHolder="Enter Interval hour"
                  />
                  {intervalError ? (
                    <Text
                      style={{
                        marginTop: getHeight(120),
                        marginLeft: getHeight(60),
                        fontSize: getHeight(65),
                        color: Colors.errorColor,
                      }}>
                      {intervalError}
                    </Text>
                  ) : null}
                </View>
                {!isEdit ? (
                  <View style={styles.addBtnContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        addNewInterval(values.interval_hours);
                        setFieldValue('interval_hours', '');
                      }}>
                      <Text>Add +</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
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
                      onPress={() => handleSubmit()}
                      label="Save"
                    />
                  </View>
                </View>
              ) : (
                <FormButton
                  isYellow={true}
                  onPress={() => handleSubmit()}
                  label="Create"
                />
              )}
            </>
          )}
        </Formik>
      </View>
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
                navigation.navigate(screens.templatesAndSetup);
              }}
            />
            <Text style={templateFormStyle.title}>Create Service Interval</Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    padding: getWidth(90),
    marginBottom: getHeight(38),
  },
  label: {
    color: Colors.placeholderColor,
    fontSize: getHeight(60),
    fontFamily: 'Inter',
    fontWeight: '500',
    marginBottom: getHeight(60),
  },
  addBtnContainer: {
    alignItems: 'flex-end',
    width: '96%',
    top: -getHeight(45),
  },
});
export default ServiceIntervalForm;
