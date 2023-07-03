/* eslint-disable react-hooks/exhaustive-deps */
import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DetailsItem,
  FormButton,
  KeyboardAwareScroll,
  LockButton,
} from '../../../../components';
import styles from './styles';
import {PartsAndMaterialsForm} from '../../../../screens';
import {getHeight, getWidth} from '../../../../theme/Constants';
import screens from '../../../../navigation/screens';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import useArchivePartsAndMaterials from '../../../../Api/hooks/PartsAndMaterials/useArchivePartsAndMaterials';
import {
  useGetMeasurementTypes,
  useGetPartsCategories,
  usePostPartsAndMaterials,
  useUnArchiveParts,
} from '../../../../Api/hooks';
import {useAlert} from '../../../../utils/hooks';

const PartsAndMaterialsDetails = ({route, navigation}: any) => {
  const {
    partsData = null,
    category = null,
    isPublic = false,
    isArchived = false,
  } = route.params;
  const {lock_status} = partsData;
  const {Alert, showAlert} = useAlert();
  const [getPartsCategories] = useGetPartsCategories();
  const [getPartsMeasurements] = useGetMeasurementTypes();
  const {partsMeasurementTypes} = useSelector(
    (state: RootState) => state.PartsAndMaterialReducer,
  );
  const [isEdit, setEdit] = useState(false);
  const [archivePartsAndMaterials, {errors: archiveErrors}] =
    useArchivePartsAndMaterials();
  const [unArchiveParts, {errors: unArchiveErrors}] = useUnArchiveParts();
  const [postPartsAndMaterial, {errors: postErrors}] =
    usePostPartsAndMaterials();
  const updateSuccess = () => {
    setEdit(false);
    navigation.navigate(screens.templatesAndSetup);
  };
  useEffect(() => {
    console.log(
      'ARCHIVE-ERROR-',
      archiveErrors,
      'UN_ARCHIVE-ERROR',
      unArchiveErrors,
      'POST-PART-ERROR',
      postErrors,
    );
    getInitialSetup();
  }, [archiveErrors, unArchiveErrors, postErrors]);
  /*
  @get parts and meterial model categories & measurement types
   if device online it fetch data from API
   */
  const getInitialSetup = async () => {
    await getPartsCategories();
    await getPartsMeasurements({isLoader: true});
  };
  const archivePartsData = async () => {
    showAlert('Warning', 'Are you want to archive the  parts and materials?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await archivePartsAndMaterials({
            id: partsData?.id,
            parts_category_id: partsData?.parts_category_id,
          });
          if (res) {
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const unArchivePartsData = async () => {
    showAlert('Warning', 'Are you want to unarchive the parts and materials?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await unArchiveParts({
            id: partsData?.id,
            parts_category_id: partsData?.parts_category_id,
            part: partsData,
          });
          if (res) {
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const createDuplicateParts = async () => {
    showAlert('Warning', 'Are you want to duplicate the parts and materials?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          let duplicateParts = {
            ...partsData,
            is_duplicate: true,
          };
          let res = await postPartsAndMaterial(duplicateParts);
          if (res) {
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  return (
    <View style={CommonStyles.mainContainer}>
      <KeyboardAwareScroll>
        <View
          style={[CommonStyles.containerFlex1, {paddingBottom: getHeight(5)}]}>
          <BackButton
            onPress={() => {
              navigation.navigate(screens.templatesAndSetup);
              setEdit(false);
            }}
          />
          <View style={styles.titleContainer}>
            <View>
              <Text style={isEdit ? CommonStyles.formTitle : styles.title}>
                {isEdit ? 'Edit Parts and materials' : category?.name}
              </Text>
            </View>
            {(lock_status || isPublic) && !isArchived ? (
              <LockButton label="Parts and materials" isPublic={isPublic} />
            ) : null}
          </View>
          {isEdit ? (
            <PartsAndMaterialsForm
              onSuccess={() => updateSuccess()}
              onCancelPress={() => setEdit(false)}
              isEdit={true}
              partsData={partsData}
            />
          ) : (
            <View style={styles.detailsContainer}>
              <Text style={styles.titleText}>PARTS AND MATERIAL</Text>
              <View style={styles.detailsItemContainer}>
                <DetailsItem label="Category" value={category?.name} />
                <DetailsItem label="Part" value={partsData?.part_no} />
                <DetailsItem
                  label="Description"
                  value={partsData?.description}
                />
                <DetailsItem
                  label="Measurement Type"
                  value={
                    partsMeasurementTypes && partsMeasurementTypes.length > 0
                      ? partsMeasurementTypes.find(
                          obj =>
                            obj.value?.toString() ===
                            partsData?.measurement_type_id.toString(),
                        )?.label
                      : ''
                  }
                />
              </View>
              {isPublic || isArchived || lock_status ? (
                <>
                  {lock_status && !isPublic && !isArchived ? null : (
                    <FormButton
                      isYellow={isArchived ? false : true}
                      onPress={() => {
                        isArchived
                          ? unArchivePartsData()
                          : createDuplicateParts();
                      }}
                      label={
                        isArchived ? 'Unarchive' : 'DUPLICATE TO MY TEMPLATES'
                      }
                    />
                  )}
                </>
              ) : (
                <View style={CommonStyles.flexRowContainer}>
                  <View style={CommonStyles.containerFlex1}>
                    <FormButton
                      onPress={() => {
                        if (isPublic) {
                          createDuplicateParts();
                        } else {
                          archivePartsData();
                        }
                      }}
                      label={'Archive'}
                    />
                  </View>
                  <View
                    style={[
                      CommonStyles.containerFlex1,
                      {paddingLeft: getWidth(40)},
                    ]}>
                    <FormButton
                      isYellow={true}
                      onPress={() => setEdit(true)}
                      label="Edit"
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </KeyboardAwareScroll>
      <Alert />
    </View>
  );
};

export default PartsAndMaterialsDetails;
