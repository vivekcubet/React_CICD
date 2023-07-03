import {View, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DeleteButton,
  ImageUpload,
  FormButton,
  InputText,
  KeyboardAwareScroll,
} from '../../../../components';
import styles from '../../Dealer/DealerForm/styles';
import {Formik} from 'formik';
import {userValidation} from '../../../../utils/validations';
import {getWidth} from '../../../../theme/Constants';
import {
  useCreateCompany,
  useCreateUser,
  useDeleteCompany,
} from '../../../../Api/hooks';

import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../../navigation/screens';
import {RootState} from '../../../../redux/store';
import {useSelector} from 'react-redux';
import {useAlert} from '../../../../utils/hooks';
import {END_POINTS} from '../../../../Api/constants';
import usePostApi from '../../../../Api/hooks/usePostApi';
import {useToast} from 'react-native-toast-notifications';

const DealerClientForm = ({route}: any) => {
  const {Alert, showAlert} = useAlert();
  const toast = useToast();
  const [deleteCompany, {errors: deleteErrors}] = useDeleteCompany();
  const [postApi] = usePostApi();
  const {dealerCompany} = useSelector((state: RootState) => state.AuthReducer);
  let {
    dealerClient = {},
    isEdit = false,
    isArchive = false,
    isView = false,
  } = route?.params ? route?.params : {};
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [createUser, {errors: postErrors}] = useCreateUser();
  const [createCompany, {errors: updateErrors}] = useCreateCompany();
  const [logo, setLogo] = useState(dealerClient.logo);
  console.log(postErrors, 'POST', deleteErrors, ' ERRORS====', updateErrors);

  /*
  @method to update Company
  */
  const updateDealerClient = async (values: any, resetForm: any) => {
    console.log(dealerClient, 'first');
    if (!values?.logo?.uri) {
      delete values.logo;
    }
    if (isEdit) {
      delete values.role_id;
      delete values.company_name;
    }
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          id: dealerClient?.id.toString(),
          isForm: values?.logo?.uri ? true : false,
        }
      : {
          ...values,
          company_id: dealerCompany?.company_id,
          isForm: values?.logo?.uri ? true : false,
        };
    if (isEdit) {
      postData['phone'] = postData['phone_number'];
      delete postData['phone_number'];
    }
    console.log(postData, 'RESPONCE====');
    let res = isEdit
      ? await createCompany(postData)
      : await createUser(postData);

    if (res) {
      resetForm();
      navigation.navigate(screens.users, {type: 'dClient'});
    }
  };
  const onDeletePress = () => {
    showAlert('Warning', 'Are you want to archive the  client?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await deleteCompany({id: dealerClient?.id.toString()});
          if (response) {
            navigation.navigate(screens.users, {type: 'dClient'});
          }
        },
      },
    ]);
  };
  const unArchiveClient = async () => {
    showAlert('Warning', 'Are you want to unarchive the  client?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: dealerClient?.id.toString()},
            endPoint: END_POINTS.UNARCHIVE_COMPANY,
          });
          if (response) {
            toast.show(response.message);
            navigation.navigate(screens.users, {type: 'dClient'});
          }
        },
      },
    ]);
  };
  const removeCompanyLogo = () => {
    showAlert('Warning', 'Are you want to remove the logo?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {company_id: dealerClient?.id.toString()},
            endPoint: END_POINTS.COMPANY_LOGO_REMOVE,
          });
          if (response) {
            setLogo('');
          }
        },
      },
    ]);
  };
  const formikRef = useRef<any>();
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
    }, []),
  );
  const formComponent = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.titleText}>DEALER CLIENT</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            name: dealerClient ? dealerClient?.name : '',
            company_name: dealerClient ? dealerClient?.company_name : '',
            email: dealerClient ? dealerClient?.email : '',
            address: dealerClient ? dealerClient?.address : '',
            phone_number: dealerClient ? dealerClient?.phone : '',
            role_id: '2',
            logo: {uri: ''},
          }}
          validationSchema={userValidation}
          onSubmit={(values, {resetForm}) => {
            updateDealerClient(values, resetForm);
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
            touched,
            values,
            errors,
            // setFieldValue,
          }) => (
            <>
              {console.log(errors)}
              <View style={styles.detailsItemContainer}>
                <InputText
                  editable={!isArchive && !isView}
                  value={values.name}
                  PlaceHolder="Enter name"
                  maxLength={25}
                  label="Name"
                  onBlur={handleBlur('name')}
                  onChange={handleChange('name')}
                  error={
                    touched.name && errors.name ? errors.name.toString() : ''
                  }
                />
                {!isEdit ? (
                  <InputText
                    editable={!isArchive && !isView}
                    value={values.company_name}
                    PlaceHolder="Enter company name"
                    maxLength={30}
                    label="Company Name"
                    onBlur={handleBlur('company_name')}
                    onChange={handleChange('company_name')}
                    error={
                      touched.company_name && errors.company_name
                        ? errors.company_name.toString()
                        : ''
                    }
                  />
                ) : null}
                <InputText
                  editable={!isArchive && !isView}
                  value={values.phone_number}
                  maxLength={21}
                  isPhone={true}
                  PlaceHolder="Enter phone number"
                  label="Phone Number"
                  onBlur={handleBlur('phone_number')}
                  keyboardType={'number-pad'}
                  onChange={handleChange('phone_number')}
                  error={
                    touched.phone_number && errors.phone_number
                      ? errors.phone_number.toString()
                      : ''
                  }
                />
                <InputText
                  editable={!isArchive && !isView}
                  value={values.email}
                  PlaceHolder="Enter email"
                  label="Email"
                  onBlur={handleBlur('email')}
                  onChange={handleChange('email')}
                  error={
                    touched.email && errors.email ? errors.email.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchive && !isView}
                  value={values.address}
                  isTextArea={true}
                  PlaceHolder="Enter address"
                  label="Address"
                  onBlur={handleBlur('address')}
                  onChange={handleChange('address')}
                  error={
                    touched.address && errors.address
                      ? errors.address.toString()
                      : ''
                  }
                />
                {/* {!isArchive || logo ? ( */}
                <ImageUpload
                  image={logo ? logo : ''}
                  onRemoveLogo={() => {
                    if (logo) {
                      removeCompanyLogo();
                    }
                  }}
                  editable={!isArchive && !isView ? true : false}
                  value={values.email}
                  PlaceHolder="Choose image"
                  label="Logo"
                  onChangeImage={image => {
                    setFieldValue('logo', image);
                  }}
                  error={
                    touched.logo && errors.logo ? errors.logo.toString() : ''
                  }
                />
                {/* ) : null} */}
              </View>
              {isView ? (
                <FormButton
                  isYellow={true}
                  onPress={() =>
                    navigation.navigate(screens.users, {
                      type: 'dClient',
                    })
                  }
                  label={'Go back'}
                />
              ) : (
                <>
                  {isEdit && !isArchive ? (
                    <View style={styles.flexRowView}>
                      <View style={CommonStyles.containerFlex1}>
                        <FormButton
                          onPress={() =>
                            navigation.navigate(screens.users, {
                              type: 'dClient',
                            })
                          }
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
                      onPress={() =>
                        isArchive ? unArchiveClient() : handleSubmit()
                      }
                      label={isArchive ? 'Unarchive' : 'Create'}
                    />
                  )}
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
      <View style={CommonStyles.mainContainer}>
        <KeyboardAwareScroll>
          <BackButton
            onPress={() => {
              navigation.navigate(screens.users, {type: 'dClient'});
            }}
          />
          {!isArchive ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isEdit
                  ? isView
                    ? dealerClient?.name
                    : 'Update dealer client'
                  : 'Create dealer client'}
              </Text>
              {isEdit && !isArchive && !isView ? (
                <DeleteButton onPress={() => onDeletePress()} />
              ) : null}
            </View>
          ) : null}
          <View style={[CommonStyles.formContainer]}>{formComponent()}</View>
        </KeyboardAwareScroll>
      </View>
      <Alert />
    </>
  );
};

export default DealerClientForm;
