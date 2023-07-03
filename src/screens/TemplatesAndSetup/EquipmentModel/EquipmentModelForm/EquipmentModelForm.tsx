/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DropDown,
  FormButton,
  InputText,
  KeyboardAwareScroll,
} from '../../../../components';
import styles from './styles';
import {Formik} from 'formik';
import {equipmentModelValidation} from '../../../../utils/validations';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {
  useEquipmentCategories,
  usePostEquipmentModel,
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
interface EquipmentModelFormInterface {
  equipmentData?: any;
  isEdit?: boolean;
  onCancelPress?: any;
  onSuccess?: any;
}
const EquipmentModelForm: FC<EquipmentModelFormInterface> = ({
  equipmentData = null,
  isEdit = false,
  onCancelPress,
  onSuccess,
}) => {
  const formikRef = useRef<any>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getCategories] = useEquipmentCategories();
  const [postEquipmentModel, {errors: postErrors}] = usePostEquipmentModel();
  console.log(postErrors, 'POST ERRORS');
  const {equipmentCategories} = useSelector(
    (state: RootState) => state.EquipmentModelReducer,
  );
  const [categoryList, setCategories] = useState(equipmentCategories);
  const [equipment, setEquipment] = useState(equipmentData);
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
      getEquipmentCategories();
    }, []),
  );
  useEffect(() => {
    setEquipment(equipmentData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentData]);

  useEffect(() => {
    setCategories(equipmentCategories);
  }, [equipmentCategories]);

  /*
  @get equipment model categories
   if device online it fetch data from API
   */
  const getEquipmentCategories = async () => {
    await getCategories();
  };

  /*
  @method to update equipment model
  @values should be EquipmentModelInterface type
  */
  const updateEquipment = async (values: any, resetForm: any) => {
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: equipment?.id,
        }
      : values;
    let res = await postEquipmentModel(postData);
    if (res) {
      if (!isEdit) {
        resetForm();
        navigation.navigate(screens.templatesAndSetup);
      } else {
        onSuccess();
      }
    }
  };
  const formComponent = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.titleText}>EQUIPMENT MODEL</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            name: equipment ? equipment?.name : '',
            category_id: equipment ? equipment?.category_id.toString() : '',
            brand: equipment ? equipment?.brand : '',
            model: equipment ? equipment?.model : '',
          }}
          validationSchema={equipmentModelValidation}
          onSubmit={(values, {resetForm}) => {
            updateEquipment(values, resetForm);
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldTouched,
            touched,
            values,
            errors,
          }) => (
            <>
              <View style={styles.detailsItemContainer}>
                <InputText
                  maxLength={100}
                  value={values.name}
                  PlaceHolder="Enter model name"
                  label="Model Name"
                  onBlur={handleBlur('name')}
                  onChange={handleChange('name')}
                  error={
                    touched.name && errors.name ? errors.name.toString() : ''
                  }
                />
                <DropDown
                  value={values.category_id}
                  onChange={selectedItem => {
                    handleChange('category_id')(selectedItem.toString());
                  }}
                  setTouched={() => setFieldTouched('category_id', true)}
                  items={categoryList}
                  label="Model Category"
                  error={
                    touched.category_id && errors.category_id
                      ? errors.category_id?.toString()
                      : ''
                  }
                />
                <InputText
                  value={values.brand}
                  PlaceHolder="Enter brand"
                  maxLength={100}
                  label="Brand"
                  onBlur={handleBlur('brand')}
                  onChange={handleChange('brand')}
                  error={
                    touched.brand && errors.brand ? errors.brand.toString() : ''
                  }
                />
                <InputText
                  value={values.model}
                  PlaceHolder="Enter model"
                  maxLength={100}
                  label="Model"
                  onBlur={handleBlur('model')}
                  onChange={handleChange('model')}
                  error={
                    touched.model && errors.model
                      ? errors.model?.toString()
                      : ''
                  }
                />
              </View>
              {isEdit ? (
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
              onPress={() => navigation.navigate(screens.templatesAndSetup)}
            />
            <Text style={styles.title}>Create Equipment Model</Text>
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

export default EquipmentModelForm;
