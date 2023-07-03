/* eslint-disable dot-notation */
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
import styles from './styles';
import {Formik} from 'formik';
import {companyValidation} from '../../../../utils/validations';
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
import {useAlert} from '../../../../utils/hooks';
import usePostApi from '../../../../Api/hooks/usePostApi';
import {END_POINTS} from '../../../../Api/constants';
import {useToast} from 'react-native-toast-notifications';

const CompanyForm = ({route}: any) => {
  const {Alert, showAlert} = useAlert();
  const toast = useToast();
  let {
    isView = false,
    company = {},
    isEdit = false,
    isArchive = false,
  } = route?.params ? route?.params : {};
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [createCompany] = useCreateCompany();
  const [deleteCompany] = useDeleteCompany();
  const [createUser] = useCreateUser();
  const [postApi] = usePostApi();
  const [logo, setLogo] = useState(company.logo);
  const formikRef = useRef<any>();
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
    }, []),
  );

  /*
  @method to update Company
  */
  const updateCompany = async (values: any, resetForm: any) => {
    console.log(company, 'first');
    if (!values?.logo?.uri) {
      delete values.logo;
    }
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          id: company?.id.toString(),
          isForm: values?.logo?.uri ? true : false,
        }
      : {
          ...values,
          role_id: '2',
          company_name: values.name,
          isForm: values?.logo?.uri ? true : false,
        };
    if (!isEdit) {
      postData['phone_number'] = postData['phone'];
      delete postData['phone'];
    }
    let res = isEdit
      ? await createCompany(postData)
      : await createUser(postData);
    if (res) {
      resetForm();
      navigation.navigate(screens.users, {type: 'cOwner'});
    }
  };

  const onDeletePress = () => {
    showAlert('Warning', 'Are you want to archive the  company?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await deleteCompany({id: company?.id.toString()});
          if (response) {
            navigation.navigate(screens.users, {type: 'cOwner'});
          }
        },
      },
    ]);
  };
  const unArchiveCompany = async () => {
    showAlert('Warning', 'Are you want to unarchive the  company?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: company?.id.toString()},
            endPoint: END_POINTS.UNARCHIVE_COMPANY,
          });
          if (response) {
            toast.show(response.message);
            navigation.navigate(screens.users, {type: 'cOwner'});
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
            params: {company_id: company?.id.toString()},
            endPoint: END_POINTS.COMPANY_LOGO_REMOVE,
          });
          if (response) {
            setLogo('');
          }
        },
      },
    ]);
  };
  const formComponent = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.titleText}>COMPANY</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            name: company ? company?.name : '',
            email: company ? company?.email : '',
            address: company ? company?.address : '',
            phone: company ? company?.phone : '8',
            logo: {uri: ''},
          }}
          validationSchema={companyValidation}
          onSubmit={(values, {resetForm}) => {
            updateCompany(values, resetForm);
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            values,
            errors,
            setFieldValue,
          }) => (
            <>
              <View style={styles.detailsItemContainer}>
                <InputText
                  maxLength={25}
                  editable={!isArchive && !isView}
                  value={values.name}
                  PlaceHolder="Enter Company name"
                  label="Company name"
                  onBlur={handleBlur('name')}
                  onChange={handleChange('name')}
                  error={
                    touched.name && errors.name ? errors.name.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchive && !isView}
                  maxLength={21}
                  isPhone={true}
                  value={values.phone}
                  PlaceHolder="Enter phone number"
                  label="Phone Number"
                  onBlur={handleBlur('phone')}
                  keyboardType={'number-pad'}
                  onChange={handleChange('phone')}
                  error={
                    touched.phone && errors.phone ? errors.phone.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchive && !isView}
                  value={values.email}
                  PlaceHolder="Enter email"
                  label="Email "
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
                {(!isArchive && !isView) || logo ? (
                  <ImageUpload
                    onRemoveLogo={() => {
                      if (logo) {
                        removeCompanyLogo();
                      }
                    }}
                    image={logo ? logo : ''}
                    editable={!isArchive && !isView}
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
                ) : null}
              </View>

              {isEdit && !isArchive && !isView ? (
                <View style={styles.flexRowView}>
                  <View style={CommonStyles.containerFlex1}>
                    <FormButton
                      onPress={() =>
                        navigation.navigate(screens.users, {type: 'cOwner'})
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
                <>
                  {!isView ? (
                    <FormButton
                      isYellow={true}
                      onPress={() =>
                        isArchive ? unArchiveCompany() : handleSubmit()
                      }
                      label={isArchive ? 'Unarchive' : 'Create'}
                    />
                  ) : null}
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
              navigation.navigate(screens.users, {type: 'cOwner'});
            }}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {isEdit
                ? isView || isArchive
                  ? 'Company details'
                  : 'Update company'
                : 'Create company'}
            </Text>
            {isEdit && !isArchive && !isView ? (
              <DeleteButton onPress={() => onDeletePress()} />
            ) : null}
          </View>
          <View style={[CommonStyles.formContainer]}>{formComponent()}</View>
        </KeyboardAwareScroll>
      </View>
      <Alert />
    </>
  );
};

export default CompanyForm;
