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
import EquipmentModelForm from '../EquipmentModelForm/EquipmentModelForm';
import {getHeight, getWidth} from '../../../../theme/Constants';
import screens from '../../../../navigation/screens';
import {
  useArchiveEquipmentModel,
  usePostEquipmentModel,
  useUnArchiveEquipmentModel,
} from '../../../../Api/hooks';
import {useAlert} from '../../../../utils/hooks';

const EquipmentModelDetails = ({route, navigation}: any) => {
  const {
    equipment = null,
    category = null,
    isPublic = false,
    isArchived = false,
  } = route.params;
  const {lock_status} = equipment;
  const {Alert, showAlert} = useAlert();
  const [archiveEquipmentModel, {errors: archiveErrors}] =
    useArchiveEquipmentModel();
  const [unArchiveEquipmentModel, {errors: unArchiveErrors}] =
    useUnArchiveEquipmentModel();
  const [postEquipmentModel, {errors: postErrors}] = usePostEquipmentModel();
  const [isEdit, setEdit] = useState(false);
  const updateSuccess = () => {
    setEdit(false);
    navigation.navigate(screens.templatesAndSetup);
  };
  useEffect(() => {
    console.log(archiveErrors, postErrors, unArchiveErrors);
  }, [archiveErrors, postErrors, unArchiveErrors]);

  const archiveEquipment = async () => {
    showAlert('Warning', 'Are you want to archive the equipment model?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await archiveEquipmentModel({
            id: equipment?.id,
            category_id: equipment?.category_id,
          });
          if (res) {
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const unArchiveEquipment = async () => {
    showAlert('Warning', 'Are you want to unarchive the equipment model?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await unArchiveEquipmentModel({
            id: equipment?.id,
            category_id: equipment?.category_id,
            model: equipment,
          });
          if (res) {
            navigation.navigate(screens.templatesAndSetup);
          }
        },
      },
    ]);
  };
  const createDuplicateModel = async () => {
    showAlert('Warning', 'Are you want to duplicate the equipment model?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          let duplicateEquipment = {
            ...equipment,
            is_duplicate: true,
          };
          let res = await postEquipmentModel(duplicateEquipment);
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
              setEdit(false);
              navigation.navigate(screens.templatesAndSetup);
            }}
          />
          <View style={styles.titleContainer}>
            <View>
              <Text style={isEdit ? CommonStyles.formTitle : styles.title}>
                {isEdit ? 'Edit Equipment Model' : category?.name}
              </Text>
              {!isEdit ? (
                <Text style={styles.subTitle}>
                  {equipment?.model + '  •  ' + equipment?.brand}
                </Text>
              ) : null}
            </View>
            {(lock_status || isPublic) && !isArchived ? (
              <LockButton isPublic={isPublic} label="Equipment model" />
            ) : null}
          </View>
          {isEdit ? (
            <EquipmentModelForm
              onSuccess={() => updateSuccess()}
              onCancelPress={() => setEdit(false)}
              isEdit={true}
              equipmentData={equipment}
            />
          ) : (
            <View style={styles.detailsContainer}>
              <Text style={styles.titleText}>EQUIPMENT MODEL</Text>
              <View style={styles.detailsItemContainer}>
                <DetailsItem label="Model Name" value={equipment?.name} />
                <DetailsItem label="Model Category" value={category?.name} />
                <DetailsItem label="Brand" value={equipment?.brand} />
                <DetailsItem label="Model" value={equipment?.model} />
              </View>
              {isPublic || isArchived || lock_status ? (
                <>
                  {lock_status && !isArchived && !isPublic ? null : (
                    <FormButton
                      isYellow={isArchived ? false : true}
                      onPress={() => {
                        if (isArchived) {
                          unArchiveEquipment();
                        } else {
                          createDuplicateModel();
                        }
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
                        isPublic ? createDuplicateModel() : archiveEquipment();
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

export default EquipmentModelDetails;
