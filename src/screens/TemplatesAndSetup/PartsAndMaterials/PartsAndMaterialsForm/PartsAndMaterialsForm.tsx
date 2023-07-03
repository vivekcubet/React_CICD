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
import {partsAndMaterialValidation} from '../../../../utils/validations';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {
  useGetMeasurementTypes,
  useGetPartsCategories,
  usePostPartsAndMaterials,
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
interface EquipmentFormInterface {
  partsData?: any;
  isEdit?: boolean;
  onCancelPress?: any;
  onSuccess?: any;
}
const PartsAndMaterialsForm: FC<EquipmentFormInterface> = ({
  partsData = null,
  isEdit = false,
  onCancelPress,
  onSuccess,
}) => {
  const formikRef = useRef<any>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getPartsCategories] = useGetPartsCategories();
  const [getPartsMeasurements] = useGetMeasurementTypes();
  const [postPartsAndMaterial, {errors: postErrors}] =
    usePostPartsAndMaterials();
  console.log(postErrors, 'POST ERRORS');
  const {partsCategories, partsMeasurementTypes} = useSelector(
    (state: RootState) => state.PartsAndMaterialReducer,
  );
  const [categoryList, setCategories] = useState(partsCategories);
  const [measurementList, setMeasurements] = useState(partsMeasurementTypes);
  const [partsEditData, setPartsData] = useState(partsData);
  useEffect(() => {
    console.log(partsData, 'VALUES==');
    setPartsData(partsData);
    getInitialSetup();
  }, [partsData]);
  useFocusEffect(
    React.useCallback(() => {
      formikRef.current?.resetForm();
    }, []),
  );
  useEffect(() => {
    setCategories(partsCategories);
    setMeasurements(partsMeasurementTypes);
  }, [partsCategories, partsMeasurementTypes]);

  /*
  @get parts and meterial model categories & measurement types
   if device online it fetch data from API
   */
  const getInitialSetup = async () => {
    await getPartsCategories();
    await getPartsMeasurements({isLoader: true});
  };

  /*
  @method to update equipment model
  @values should be EquipmentModelInterface type
  */
  const updateEquipment = async (values: any, resetForm: any) => {
    console.log(values, 'VALUES==');
    const postData = isEdit
      ? {
          ...values,
          isEdit: true,
          is_active: true,
          id: partsEditData?.id,
        }
      : values;
    let res = await postPartsAndMaterial(postData);
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
        {/* <Text style={styles.titleText}>PARTS AND MATERIAL</Text> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            part_no: partsEditData ? partsEditData?.part_no : '',
            measurement_type_id: partsEditData
              ? partsEditData?.measurement_type_id.toString()
              : '',
            parts_category_id: partsEditData
              ? partsEditData?.parts_category_id.toString()
              : '',
            description: partsEditData ? partsEditData?.description : '',
          }}
          validationSchema={partsAndMaterialValidation}
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
                <DropDown
                  value={values.parts_category_id}
                  onChange={selectedItem => {
                    handleChange('parts_category_id')(selectedItem.toString());
                  }}
                  items={categoryList}
                  label="Category"
                  error={errors.parts_category_id?.toString()}
                />
                <InputText
                  value={values.part_no}
                  PlaceHolder="Enter part"
                  maxLength={100}
                  label="Part ID"
                  onBlur={handleBlur('part_no')}
                  onChange={handleChange('part_no')}
                  error={
                    touched.part_no && errors.part_no
                      ? errors.part_no.toString()
                      : ''
                  }
                />

                <InputText
                  value={values.description}
                  isTextArea={true}
                  PlaceHolder="Enter description"
                  label="Description"
                  onBlur={handleBlur('description')}
                  onChange={handleChange('description')}
                  error={
                    touched.description && errors.description
                      ? errors.description.toString()
                      : ''
                  }
                />
                <DropDown
                  value={values.measurement_type_id}
                  setTouched={() =>
                    setFieldTouched('measurement_type_id', true)
                  }
                  onChange={selectedItem => {
                    handleChange('measurement_type_id')(
                      selectedItem.toString(),
                    );
                  }}
                  items={measurementList}
                  label="Measurement Type"
                  error={
                    touched.measurement_type_id && errors.measurement_type_id
                      ? errors.measurement_type_id?.toString()
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
            <Text style={styles.title}>Create Parts and material</Text>
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

export default PartsAndMaterialsForm;
