import {View, Text} from 'react-native';
import React from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DeleteButton,
  FormButton,
  InputText,
  KeyboardAwareScroll,
} from '../../../../components';
import styles from '../../Dealer/DealerForm/styles';
import {Formik} from 'formik';
import {userValidation} from '../../../../utils/validations';
import {getWidth} from '../../../../theme/Constants';
import {useArchiveUser, useCreateUser} from '../../../../Api/hooks';

import {useNavigation, ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../../navigation/screens';
import {RootState} from '../../../../redux/store';
import {useSelector} from 'react-redux';
import {END_POINTS} from '../../../../Api/constants';
import {useAlert} from '../../../../utils/hooks';
import usePostApi from '../../../../Api/hooks/usePostApi';
import {useToast} from 'react-native-toast-notifications';

const DealerTechnicianForm = ({route}: any) => {
  const toast = useToast();
  const {Alert, showAlert} = useAlert();
  const [archiveUser] = useArchiveUser();
  const [postApi] = usePostApi();
  const {dealerCompany} = useSelector((state: RootState) => state.AuthReducer);
  let {
    dealerTechnician = {},
    isEdit = false,
    isArchive = false,
  } = route?.params ? route?.params : {};
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [createUser, {errors: postErrors}] = useCreateUser();
  console.log(postErrors, 'POST ERRORS====');

  /*
  @method to update Company
  */
  const updateCompanyTechnician = async (values: any, resetForm: any) => {
    console.log(dealerTechnician, 'first', dealerCompany);
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: dealerTechnician?.id.toString(),
        }
      : {
          ...values,
          company_id: dealerCompany?.company_id,
        };

    let res = await createUser(postData);
    if (res) {
      resetForm();
      navigation.navigate(screens.users, {type: 'dTecnician'});
    }
  };
  const onDeletePress = () => {
    showAlert('Warning', 'Are you want to archive the  dealer technician?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await archiveUser({
            id: dealerTechnician?.id.toString(),
          });
          if (response) {
            navigation.navigate(screens.users, {type: 'dTecnician'});
          }
        },
      },
    ]);
  };

  const unArchiveUser = async () => {
    showAlert('Warning', 'Are you want to Unarchive the  dealer technician?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: dealerTechnician?.id.toString()},
            endPoint: END_POINTS.UNARCHIVE_USER,
          });
          if (response) {
            toast.show(response.message);
            navigation.navigate(screens.users, {type: 'dTecnician'});
          }
        },
      },
    ]);
  };
  const formComponent = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.titleText}>DEALER TECHNICIAN</Text> */}
        <Formik
          initialValues={{
            name: dealerTechnician ? dealerTechnician?.name : '',
            email: dealerTechnician ? dealerTechnician?.email : '',
            address: dealerTechnician ? dealerTechnician?.address : '',
            phone_number: dealerTechnician
              ? dealerTechnician?.phone_number
              : '',
            role_id: '6',

            // logo: company ? {uri: company.logo ? company.logo : ''} : {uri: ''},
          }}
          validationSchema={userValidation}
          onSubmit={(values, {resetForm}) => {
            updateCompanyTechnician(values, resetForm);
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            values,
            errors,
            // setFieldValue,
          }) => (
            <>
              <View style={styles.detailsItemContainer}>
                <InputText
                  editable={!isArchive}
                  value={values.name}
                  PlaceHolder="Enter name"
                  label="Name"
                  onBlur={handleBlur('name')}
                  onChange={handleChange('name')}
                  error={
                    touched.name && errors.name ? errors.name.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchive}
                  value={values.phone_number}
                  isPhone={true}
                  maxLength={30}
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
                  editable={!isArchive}
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
                  editable={!isArchive}
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
                {/* <ImageUpload
                  value={values.email}
                  PlaceHolder="Choose logo"
                  label="Logo"
                  onChangeImage={image => {
                    setFieldValue('logo', image);
                  }}
                  error={
                    touched.logo && errors.logo ? errors.logo.toString() : ''
                  }
                /> */}
              </View>

              {isEdit && !isArchive ? (
                <View style={styles.flexRowView}>
                  <View style={CommonStyles.containerFlex1}>
                    <FormButton
                      onPress={() =>
                        navigation.navigate(screens.users, {type: 'dTecnician'})
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
                  onPress={() => (isArchive ? unArchiveUser() : handleSubmit())}
                  label={isArchive ? 'Unarchive' : 'Create'}
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
      <View style={CommonStyles.mainContainer}>
        <KeyboardAwareScroll>
          <BackButton
            onPress={() => {
              navigation.navigate(screens.users, {type: 'dTecnician'});
            }}
          />
          {!isArchive ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isEdit
                  ? 'Update dealer technician'
                  : 'Create dealer technician'}
              </Text>
              {isEdit && !isArchive ? (
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

export default DealerTechnicianForm;
