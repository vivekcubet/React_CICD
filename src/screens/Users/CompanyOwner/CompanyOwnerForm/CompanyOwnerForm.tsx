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
import {useToast} from 'react-native-toast-notifications';
import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../../navigation/screens';
import {RootState} from '../../../../redux/store';
import {useSelector} from 'react-redux';
import {END_POINTS} from '../../../../Api/constants';
import {useAlert} from '../../../../utils/hooks';
import usePostApi from '../../../../Api/hooks/usePostApi';

const CompanyOwnerForm = ({route}: any) => {
  const {Alert, showAlert} = useAlert();
  const toast = useToast();
  const [archiveUser, {errors: archiveErrors}] = useArchiveUser();
  const {userCompany, dealerCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  let {
    companyOwner = {},
    isEdit = false,
    isArchived = false,
  } = route?.params ? route?.params : {};
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [createUser, {errors: postErrors}] = useCreateUser();
  const [postApi] = usePostApi();
  console.log(postErrors, 'POST ERRORS====', archiveErrors);

  /*
  @method to update Company
  */
  const updateCompanyOwners = async (values: any, resetForm: any) => {
    console.log(companyOwner, 'first');
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: companyOwner?.id.toString(),
        }
      : {
          ...values,
          company_id: userCompany?.company_id,
          endUrl: dealerCompany ? END_POINTS.ADD_DEALER_COMPANY_OWNER : null,
        };

    let res = await createUser(postData);
    console.log(res, 'RESPONCE====');
    if (res) {
      resetForm();
      navigation.navigate(screens.users, {type: 'cOwnerC'});
    }
  };

  const onDeletePress = () => {
    showAlert('Warning', 'Are you want to archive the  company owner?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await archiveUser({id: companyOwner?.id.toString()});
          if (response) {
            navigation.navigate(screens.users, {type: 'cOwner'});
          }
        },
      },
    ]);
  };

  const unArchiveCompanyOwner = async () => {
    showAlert('Warning', 'Are you want to Unarchive the  company owner?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: companyOwner?.id.toString()},
            endPoint: END_POINTS.UNARCHIVE_USER,
          });
          if (response) {
            toast.show(response.message);
            navigation.navigate(screens.users, {type: 'cOwner'});
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
        {/* <Text style={styles.titleText}>COMPANY OWNER</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            name: companyOwner ? companyOwner?.name : '',
            email: companyOwner ? companyOwner?.email : '',
            address: companyOwner ? companyOwner?.address : '',
            phone_number: companyOwner ? companyOwner?.phone_number : '',
            role_id: '2',

            // logo: company ? {uri: company.logo ? company.logo : ''} : {uri: ''},
          }}
          validationSchema={userValidation}
          onSubmit={(values, {resetForm}) => {
            updateCompanyOwners(values, resetForm);
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
                  editable={!isArchived}
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
                  editable={!isArchived}
                  value={values.phone_number}
                  isPhone={true}
                  maxLength={21}
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
                  editable={!isArchived}
                  value={values.email}
                  PlaceHolder="Enter email"
                  label="Email address"
                  onBlur={handleBlur('email')}
                  onChange={handleChange('email')}
                  error={
                    touched.email && errors.email ? errors.email.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchived}
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

              {isEdit && !isArchived ? (
                <View style={styles.flexRowView}>
                  <View style={CommonStyles.containerFlex1}>
                    <FormButton
                      onPress={() =>
                        navigation.navigate(screens.users, {type: 'cOwnerC'})
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
                    isArchived ? unArchiveCompanyOwner() : handleSubmit()
                  }
                  label={isArchived ? 'Unarchive' : 'Create'}
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
              navigation.navigate(screens.users, {type: 'cOwnerC'});
            }}
          />
          {!isArchived ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isEdit ? 'Update company owner' : 'Create company owner'}
              </Text>
              {isEdit && !isArchived ? (
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

export default CompanyOwnerForm;
