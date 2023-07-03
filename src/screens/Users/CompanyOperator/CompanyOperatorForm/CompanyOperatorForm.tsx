import {View, Text} from 'react-native';
import React, {useRef} from 'react';
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
const CompanyOperatorForm = ({route}: any) => {
  const {Alert, showAlert} = useAlert();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  let {
    companyOperator = {},
    isEdit = false,
    isArchive = false,
  } = route?.params ? route?.params : {};
  const toast = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [createUser, {errors: postErrors}] = useCreateUser();
  const [archiveUser] = useArchiveUser();
  const [postApi] = usePostApi();
  console.log(postErrors, 'POST ERRORS====');
  const formikRef = useRef<any>();
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
    }, []),
  );
  /*
  @method to update Company
  */
  const updateCompanyOperator = async (values: any, resetForm: any) => {
    console.log(companyOperator, 'first');
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: companyOperator?.id.toString(),
        }
      : {
          ...values,
          company_id: userCompany?.company_id,
        };

    let res = await createUser(postData);
    console.log(res, 'RESPONCE====');
    if (res) {
      resetForm();
      navigation.navigate(screens.users, {type: 'cOperator'});
    }
  };
  const onDeletePress = () => {
    showAlert('Warning', 'Are you want to archive the  company operator?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await archiveUser({
            id: companyOperator?.id.toString(),
          });
          if (response) {
            navigation.navigate(screens.users, {type: 'cOperator'});
          }
        },
      },
    ]);
  };

  const unArchiveUser = async () => {
    showAlert('Warning', 'Are you want to unarchive the  company operator?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: companyOperator?.id.toString()},
            endPoint: END_POINTS.UNARCHIVE_USER,
          });
          if (response) {
            toast.show(response.message);
            navigation.navigate(screens.users, {type: 'cOperator'});
          }
        },
      },
    ]);
  };
  const formComponent = () => {
    return (
      <View style={styles.detailsContainer}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            name: companyOperator ? companyOperator?.name : '',
            email: companyOperator ? companyOperator?.email : '',
            address: companyOperator ? companyOperator?.address : '',
            phone_number: companyOperator ? companyOperator?.phone_number : '',
            role_id: '4',

            // logo: company ? {uri: company.logo ? company.logo : ''} : {uri: ''},
          }}
          validationSchema={userValidation}
          onSubmit={(values, {resetForm}) => {
            updateCompanyOperator(values, resetForm);
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
                  maxLength={25}
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
                  isPhone={true}
                  maxLength={21}
                  value={values.phone_number}
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
                        navigation.navigate(screens.users, {type: 'cOperator'})
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
                  label={isArchive ? 'UnArchive' : 'Create'}
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
              navigation.navigate(screens.users, {type: 'cOperator'});
            }}
          />
          {!isArchive ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isEdit ? 'Update company operator' : 'Create company operator'}
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

export default CompanyOperatorForm;
