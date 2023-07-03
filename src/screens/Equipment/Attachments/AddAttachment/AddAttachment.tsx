import {View, Text} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  ImageUpload,
  FormButton,
  InputText,
  KeyboardAwareScroll,
} from '../../../../components';
import styles from '../../../Users/Dealer/DealerForm/styles';
import {Formik} from 'formik';
import {equipmentAttachmentValidation} from '../../../../utils/validations';
import {getWidth} from '../../../../theme/Constants';
import {useAddAttachment} from '../../../../Api/hooks';

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
interface AddAttachmentInterface {
  attachment?: any;
  isEdit?: boolean;
  onCancelPress?: any;
  isArchived?: boolean;
  onSuccess?: any;
}
const AddAttachment: FC<AddAttachmentInterface> = ({
  attachment = {},
  isEdit = false,
  isArchived = false,
  onCancelPress,
  onSuccess,
}) => {
  const [postApi] = usePostApi();
  const {Alert, showAlert} = useAlert();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [addAttachment] = useAddAttachment();
  const [logo, setLogo] = useState(attachment.logo);
  console.log(isEdit, 'ATTACHMENT EDIT====', attachment.id);

  /*
  @method to update attachment
  */
  const updateAttachment = async (
    values: any,
    resetForm: any,
  ): Promise<void> => {
    console.log(attachment, 'first==========', values?.logo);
    if (!values?.logo?.uri || !values?.logo?.name) {
      await delete values.logo;
    }
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: 1,
          id: attachment?.id.toString(),
          isForm: true,
        }
      : {
          ...values,
          company_id: userCompany?.company_id,
          isForm: values?.logo?.uri ? true : false,
        };
    console.log(postData, 'POST DATAA', values?.logo);
    let res = await addAttachment(postData);
    console.log(res, 'RESPONCE====');
    if (res) {
      resetForm();
      if (!isEdit) {
        navigation.navigate(screens.equipmentList);
      } else {
        onSuccess();
      }
    }
  };
  const removeAttachmentLogo = () => {
    showAlert('Warning', 'Are you want to remove the logo?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: attachment?.id.toString()},
            endPoint: END_POINTS.DELETE_ATTACHMENT_LOGO,
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
        <Formik
          innerRef={formikRef}
          initialValues={{
            unit_no: attachment ? attachment?.unit_no : '',
            make: attachment ? attachment?.make : '',
            model: attachment ? attachment?.model : '',
            sl_no: attachment ? attachment?.sl_no : '',

            logo: attachment
              ? {uri: attachment.logo ? attachment.logo : ''}
              : {uri: ''},
          }}
          validationSchema={equipmentAttachmentValidation}
          onSubmit={(values, {resetForm}) => {
            updateAttachment(values, resetForm);
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
                  editable={!isArchived}
                  value={values.unit_no}
                  maxLength={100}
                  PlaceHolder="Enter Unit"
                  label="Unit #"
                  onBlur={handleBlur('unit_no')}
                  onChange={handleChange('unit_no')}
                  error={
                    touched.unit_no && errors.unit_no
                      ? errors.unit_no.toString()
                      : ''
                  }
                />
                <InputText
                  editable={!isArchived}
                  value={values.make}
                  maxLength={100}
                  PlaceHolder="Enter Make"
                  label="Make"
                  onBlur={handleBlur('make')}
                  onChange={handleChange('make')}
                  error={
                    touched.make && errors.make ? errors.make.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchived}
                  value={values.model}
                  maxLength={100}
                  PlaceHolder="Enter Model"
                  label="Model"
                  onBlur={handleBlur('model')}
                  onChange={handleChange('model')}
                  error={
                    touched.model && errors.model ? errors.model.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchived}
                  maxLength={100}
                  value={values.sl_no}
                  PlaceHolder="Enter Serial Number"
                  label="Serial #"
                  onBlur={handleBlur('sl_no')}
                  onChange={handleChange('sl_no')}
                  error={
                    touched.sl_no && errors.sl_no ? errors.sl_no.toString() : ''
                  }
                />
                {!isArchived || logo ? (
                  <ImageUpload
                    onRemoveLogo={() => {
                      if (logo) {
                        removeAttachmentLogo();
                      }
                    }}
                    image={logo ? logo : ''}
                    editable={!isArchived}
                    PlaceHolder="Choose image"
                    label="Image"
                    onChangeImage={image => {
                      setFieldValue('logo', image);
                    }}
                    error={
                      touched.logo && errors.logo ? errors.logo.toString() : ''
                    }
                  />
                ) : null}
              </View>

              {isEdit && !isArchived ? (
                <View style={styles.flexRowView}>
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
                  label={'Create'}
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
                navigation.navigate(screens.equipmentList);
              }}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isEdit ? 'Update attachment' : 'Add attachment'}
              </Text>
            </View>
            <View style={[CommonStyles.formContainer]}>{formComponent()}</View>
          </KeyboardAwareScroll>
        </View>
      )}
      <Alert />
    </>
  );
};

export default AddAttachment;
