/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DropDown,
  ImageUpload,
  FormButton,
  InputText,
  KeyboardAwareScroll,
  MultiSelect,
} from '../../../../components';
import styles from '../../../Users/Dealer/DealerForm/styles';
import {Formik} from 'formik';
import {equipmentValidation} from '../../../../utils/validations';
import {getWidth} from '../../../../theme/Constants';
import {
  useEquipmentCategories,
  useGetAttachments,
  useGetEquipmentModels,
  useGetServiceTemplates,
  usePostEquipment,
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
interface EquipmentInterface {
  equipment?: any;
  isEdit?: boolean;
  onCancelPress?: any;
  isArchived?: boolean;
  onSuccess?: any;
  route?: any;
}
const EquipmentForm: FC<EquipmentInterface> = ({
  equipment = null,
  isEdit = false,
  isArchived = false,
  onCancelPress,
  onSuccess,
}) => {
  const [getEquipmentModels] = useGetEquipmentModels();
  const [getCategories] = useEquipmentCategories();
  const [getAttachments] = useGetAttachments();
  const [getServicesTemplateList] = useGetServiceTemplates();
  const [postApi] = usePostApi();
  const {Alert, showAlert} = useAlert();
  const {equipmentCategories, myEquipmentModels} = useSelector(
    (state: RootState) => state.EquipmentModelReducer,
  );
  const {attachmentList} = useSelector(
    (state: RootState) => state.AttachmentReducer,
  );
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const {myServiceTemplates} = useSelector(
    (state: RootState) => state.ServiceTemplateReducer,
  );
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [postEquipment] = usePostEquipment();
  const [logo, setLogo] = useState(equipment?.logo ? equipment?.logo : null);
  const [eqModels, setEqModels] = useState<any>([]);
  const [modelTemplates, setModelTemplates] = useState<any>([]);
  const [selectedCategory, setCategory] = useState<any>('');
  const [selectedModel, setModel] = useState<any>('');
  const [selectedAttachments, setAttachments] = useState<any>([]);
  const [attachments, setAttachmentList] = useState<any>([]);
  const formikRef = useRef<any>();
  useFocusEffect(
    React.useCallback(() => {
      console.log(equipment, 'EQUIPMENT ADDDD');
      formikRef.current?.resetForm();
      initialSetup();
    }, []),
  );

  /*
  @method to update Equipment
  */
  const updateEquipment = async (
    values: any,
    resetForm: any,
  ): Promise<void> => {
    if (!values?.logo?.uri) {
      delete values.logo;
    }
    let attachmentIds = {};
    console.log(JSON.stringify(selectedAttachments), 'SAMPLET========');
    if (selectedAttachments.length > 0) {
      let ids = await selectedAttachments.map((item: any) => item.value);
      attachmentIds = ids.reduce((obj: any, id: any, index: any) => {
        obj[`attachment_id[${index}]`] = id;
        return obj;
      }, {});
    }

    const postData = isEdit
      ? {
          ...values,
          ...attachmentIds,
          isEdit: true,
          is_active: 1,
          id: equipment?.id.toString(),
          // attachment_id: attachment_id,
          isForm: true,
        }
      : {
          ...values,
          ...attachmentIds,
          company_id: userCompany?.company_id,
          isForm: true,
        };
    let res = await postEquipment(postData);
    console.log(res, 'UPDATE RESPONCE===');
    if (res) {
      resetForm();
      if (isEdit) {
        onSuccess();
      } else {
        navigation.navigate(screens.equipmentList);
      }
    }
  };

  useEffect(() => {
    getCategoryModels();
    setModelTemplates([]);
  }, [selectedCategory]);
  useEffect(() => {
    getModelTemplates();
  }, [selectedModel]);
  const initialSetup = async () => {
    if (equipment) {
      if (equipment?.attachments) {
        let attachmentsData = equipment?.attachments?.map((item: any) => {
          return {
            label: item.unit_no,
            value: item.id.toString(),
            attachment: item,
          };
        });
        setAttachments(attachmentsData);
      } else {
        setAttachments([]);
      }
      setCategory(equipment.model_category_id.toString());
      setModel(equipment.model_id.toString());
    } else {
      setCategory('');
      setModel('');
      setAttachments([]);
    }

    await getEquipmentModels({isLoader: false});
    await getAttachments({isLoader: false});
    await getServicesTemplateList({isLoader: false});
    getCategories();
  };
  const getCategoryModels = () => {
    const filteredArray = myEquipmentModels
      .filter((item: any) => item.id.toString() === selectedCategory.toString())
      .flatMap(
        (item: any) =>
          item.models?.map((model: any) => ({
            label: model?.name,
            value: model?.id.toString(),
            model,
          })) ?? [],
      );

    console.log(filteredArray, 'FINAL ARRAY');
    setEqModels(filteredArray);
  };
  const getModelTemplates = () => {
    const filteredTemplates = myServiceTemplates.filter(
      (item: any) => selectedCategory.toString() === item.id.toString(),
    );
    if (filteredTemplates.length > 0) {
      const modelTemplateList = filteredTemplates[0].templates
        .filter(
          (template: any) =>
            template.model_id.toString() === selectedModel.toString(),
        )
        .map((template: any) => ({
          label: template.name,
          value: template.id.toString(),
          template: template,
        }));
      console.log(modelTemplateList, 'TEMPLATES===');
      setModelTemplates(modelTemplateList);
    }
  };

  useEffect(() => {
    configureAttachments();
  }, [attachmentList]);
  const configureAttachments = () => {
    console.log(attachmentList, 'TEST=======');
    let attachmentsData = attachmentList.map(item => {
      if (item?.is_archived !== 1) {
        return {
          label: item.unit_no,
          value: item.id.toString(),
          attachment: item,
        };
      }
    });
    console.log(attachmentsData, 'TEST=======');
    setAttachmentList(attachmentsData);
  };
  const removeEquipmentLogo = () => {
    showAlert('Warning', 'Are you want to remove the logo?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let response = await postApi({
            params: {id: equipment?.id.toString()},
            endPoint: END_POINTS.DELETE_EQUIPMENT_LOGO,
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
        {/* <Text style={styles.titleText}>EQUIPMENT</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            unit_no: equipment ? equipment?.unit_no : '',
            category_id: equipment
              ? equipment?.model_category_id?.toString()
              : '',
            model_id: equipment ? equipment?.model_id?.toString() : '',
            template_id: equipment ? equipment?.template_id : '',
            make: equipment ? equipment?.make : '',
            model: equipment ? equipment?.model : '',
            sl_no: equipment ? equipment?.sl_no : '',
            current_hour: equipment ? equipment?.current_hour.toString() : '',
            logo: equipment
              ? {uri: equipment.logo ? equipment?.logo?.uri : ''}
              : {uri: ''},
          }}
          validationSchema={equipmentValidation}
          onSubmit={(values, {resetForm}) => {
            updateEquipment(values, resetForm);
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            values,
            errors,
            setFieldTouched,
            setFieldValue,
          }) => (
            <>
              <View style={styles.detailsItemContainer}>
                <InputText
                  editable={!isArchived}
                  value={values.unit_no}
                  maxLength={25}
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
                <DropDown
                  value={values.category_id}
                  onChange={selectedItem => {
                    setCategory(selectedItem.toString());
                    setFieldValue('category_id', selectedItem.toString());
                    handleChange('model_id')('');
                    handleChange('template_id')('');
                  }}
                  setTouched={() => setFieldTouched('category_id', true)}
                  items={equipmentCategories}
                  label="Model Category"
                  error={
                    touched.category_id &&
                    errors.category_id &&
                    !values.category_id
                      ? errors.category_id?.toString()
                      : ''
                  }
                />
                <DropDown
                  value={values.model_id.toString()}
                  setTouched={() => setFieldTouched('model_id', true)}
                  onChange={selectedItem => {
                    handleChange('model_id')(selectedItem.toString());
                    setModel(selectedItem.toString());
                    handleChange('template_id')('');
                  }}
                  items={eqModels}
                  label="Equipment Model"
                  error={
                    touched.model_id && errors.model_id && !values.model_id
                      ? errors.model_id?.toString()
                      : ''
                  }
                />
                <DropDown
                  value={values.template_id}
                  setTouched={() => setFieldTouched('template_id', true)}
                  onChange={selectedItem => {
                    handleChange('template_id')(selectedItem.toString());
                  }}
                  items={modelTemplates}
                  label="Service Template"
                  error={
                    touched.template_id && errors.template_id
                      ? errors.template_id?.toString()
                      : ''
                  }
                />
                <MultiSelect
                  isListShow={true}
                  onChange={(selectedValues: any) => {
                    const updatedArray = selectedValues.map((obj: any) => ({
                      ...obj,
                      isNew: true,
                    }));
                    setAttachments(updatedArray);
                  }}
                  removeItem={(index: number) => {
                    const updatedArray = [...selectedAttachments];
                    updatedArray.splice(index, 1);
                    setAttachments(updatedArray);
                  }}
                  label="Attachments"
                  selected={selectedAttachments}
                  items={attachments.filter(
                    (item: any) => item?.label !== undefined,
                  )}
                />
                <InputText
                  editable={!isArchived}
                  value={values.make}
                  maxLength={21}
                  PlaceHolder="Enter make"
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
                  PlaceHolder="Enter model"
                  label="Model"
                  onBlur={handleBlur('model')}
                  onChange={handleChange('model')}
                  error={
                    touched.model && errors.model ? errors.model.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchived}
                  value={values.sl_no}
                  PlaceHolder="Enter serial number"
                  label="Serial #"
                  onBlur={handleBlur('sl_no')}
                  onChange={handleChange('sl_no')}
                  error={
                    touched.sl_no && errors.sl_no ? errors.sl_no.toString() : ''
                  }
                />
                <InputText
                  editable={!isArchived}
                  maxLength={15}
                  value={values.current_hour}
                  PlaceHolder="Enter hours"
                  keyboardType={'number-pad'}
                  label="Hours"
                  onBlur={handleBlur('current_hour')}
                  onChange={(value: string) => {
                    let sanitizedValue = value.replace(/[^\d.]+/g, '');
                    sanitizedValue =
                      sanitizedValue === '.' ? '0.0' : sanitizedValue;
                    setFieldValue('current_hour', sanitizedValue);
                  }}
                  error={
                    touched.current_hour && errors.current_hour
                      ? errors.current_hour.toString()
                      : ''
                  }
                />
                {!isArchived || logo ? (
                  <ImageUpload
                    onRemoveLogo={() => {
                      if (logo) {
                        removeEquipmentLogo();
                      }
                    }}
                    image={logo ? logo : ''}
                    editable={!isArchived}
                    PlaceHolder="Choose Image"
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
        <>
          <Text style={styles.title}>{'Edit equipment'}</Text>
          {formComponent()}
        </>
      ) : (
        <View style={CommonStyles.mainContainer}>
          <KeyboardAwareScroll>
            <BackButton
              onPress={() => {
                navigation.navigate(screens.equipmentList);
              }}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{'Add equipment'}</Text>
            </View>
            <View style={[CommonStyles.formContainer]}>{formComponent()}</View>
          </KeyboardAwareScroll>
        </View>
      )}
      <Alert />
    </>
  );
};

export default EquipmentForm;
