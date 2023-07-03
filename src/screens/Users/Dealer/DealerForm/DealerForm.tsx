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
import {dealerValidation} from '../../../../utils/validations';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {useCreateDealer, useDeleteDealer} from '../../../../Api/hooks';

import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../../navigation/screens';
import {useAlert} from '../../../../utils/hooks';
import {END_POINTS} from '../../../../Api/constants';
import usePostApi from '../../../../Api/hooks/usePostApi';
import {useToast} from 'react-native-toast-notifications';

const DealerForm = ({route}: any) => {
  const {Alert, showAlert} = useAlert();
  const toast = useToast();
  let {
    isView = false,
    dealer = {},
    isEdit = false,
    isArchive = false,
  } = route?.params ? route?.params : {};
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [createDealer] = useCreateDealer();
  const [deleteDealer] = useDeleteDealer();
  const [postApi] = usePostApi();
  const [logo, setLogo] = useState(dealer.logo);
  const formikRef = useRef<any>();
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
    }, []),
  );

  /*
  @method to update Company
  */
  const updateDealer = async (values: any, resetForm: any) => {
    console.log(dealer, 'first');
    if (!values?.logo?.uri) {
      delete values.logo;
    }
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: dealer?.id.toString(),
          isForm: values?.logo?.uri ? true : false,
        }
      : {
          ...values,
          isForm: values?.logo?.uri ? true : false,
        };

    let res = await createDealer(postData);
    if (res) {
      resetForm();
      navigation.navigate(screens.users, {type: 'dOwner'});
    }
  };
  const onDeletePress = () => {
    showAlert('Warning', 'Are you want to archive the  dealer?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await deleteDealer({id: dealer?.id.toString()});
          if (response) {
            navigation.navigate(screens.users, {type: 'dOwner'});
          }
        },
      },
    ]);
  };
  const unArchiveCompany = async () => {
    showAlert('Warning', 'Are you want to unarchive the  dealer?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: dealer?.id.toString()},
            endPoint: END_POINTS.UNARCHIVE_DEALER,
          });
          if (response) {
            toast.show(response?.message);
            navigation.navigate(screens.users, {type: 'dOwner'});
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
            params: {company_id: dealer?.id.toString()},
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
        {/* <Text style={styles.titleText}>DEALER</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            company_name: dealer ? dealer?.name : '',
            dealer_owner_name: dealer ? dealer?.dealer_owner_name : '',
            email: dealer ? dealer?.email : '',
            address: dealer ? dealer?.address : '',
            phone_number: dealer ? dealer?.phone : '',
            logo: {uri: ''},
            role_id: '5',
            // company_name: 'SanTest',
          }}
          validationSchema={dealerValidation}
          onSubmit={(values, {resetForm}) => {
            updateDealer(values, resetForm);
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
              <View style={styles.detailsItemContainer}>
                <InputText
                  maxLength={25}
                  editable={!isArchive && !isView}
                  value={values.company_name}
                  PlaceHolder="Enter Dealer name"
                  label="Dealer name"
                  onBlur={handleBlur('company_name')}
                  onChange={handleChange('company_name')}
                  error={
                    touched.company_name && errors.company_name
                      ? errors.company_name.toString()
                      : ''
                  }
                />
                <InputText
                  editable={!isArchive && !isView}
                  maxLength={21}
                  isPhone={true}
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
                <InputText
                  editable={!isArchive && !isView}
                  value={values.dealer_owner_name}
                  PlaceHolder="Enter owner's name"
                  label="Dealer owner's name"
                  onBlur={handleBlur('dealer_owner_name')}
                  onChange={handleChange('dealer_owner_name')}
                  error={
                    touched.dealer_owner_name && errors.dealer_owner_name
                      ? errors.dealer_owner_name.toString()
                      : ''
                  }
                />
                {(!isArchive && !isView) || logo ? (
                  <ImageUpload
                    image={logo ? logo : ''}
                    onRemoveLogo={() => {
                      if (logo) {
                        removeCompanyLogo();
                      }
                    }}
                    editable={!isArchive}
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
                        navigation.navigate(screens.users, {type: 'dOwner'})
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
              navigation.navigate(screens.users, {type: 'dOwner'});
            }}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {isEdit
                ? isView || isArchive
                  ? 'Dealer details'
                  : 'Update dealer'
                : 'Create Dealer'}
            </Text>
            {isEdit && !isArchive && !isView ? (
              <DeleteButton onPress={() => onDeletePress()} />
            ) : null}
          </View>

          <View
            style={[
              CommonStyles.containerFlex1,
              {paddingBottom: getHeight(4)},
            ]}>
            {formComponent()}
          </View>
        </KeyboardAwareScroll>
      </View>
      <Alert />
    </>
  );
};

export default DealerForm;
