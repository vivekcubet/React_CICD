import {Text, View} from 'react-native';
import React, {useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  DetailsItem,
  FormButton,
  KeyboardAwareScroll,
} from '../../../../components';
import styles from './styles';
import AddAttachment from '../AddAttachment/AddAttachment';
import {getHeight} from '../../../../theme/Constants';
import screens from '../../../../navigation/screens';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';

const AttachmentDetails = ({route, navigation}: any) => {
  const {
    attachment = null,
    isLocked = false,
    isArchived = false,
  } = route.params ? route.params : {};
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const [isEdit, setEdit] = useState(false);
  const updateSuccess = () => {
    setEdit(false);
    navigation.navigate(screens.equipmentList);
  };

  return (
    <View style={CommonStyles.mainContainer}>
      <KeyboardAwareScroll>
        <View
          style={[CommonStyles.containerFlex1, {paddingBottom: getHeight(5)}]}>
          <BackButton
            onPress={() => {
              setEdit(false);
              navigation.navigate(screens.equipmentList);
            }}
          />
          <View style={styles.titleContainer}>
            <View>
              {isEdit ? (
                <Text style={CommonStyles.formTitle}>{'Edit Attachment'}</Text>
              ) : null}
            </View>
          </View>
          {isEdit ? (
            <AddAttachment
              onSuccess={() => updateSuccess()}
              onCancelPress={() => setEdit(false)}
              isEdit={true}
              attachment={attachment}
            />
          ) : (
            <View style={styles.detailsContainer}>
              <Text style={styles.titleText}>ATTACHMENT DETAILS</Text>
              <View style={styles.detailsItemContainer}>
                {attachment?.logo ? (
                  <View style={styles.logoContainer}>
                    <FastImage
                      source={{
                        uri: attachment?.logo,
                      }}
                      style={styles.image}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                ) : null}
                <DetailsItem label="Unit #" value={attachment?.unit_no} />
                <DetailsItem label="Make" value={attachment?.make} />
                <DetailsItem label="Model" value={attachment?.model} />
                <DetailsItem label="Serial #" value={attachment?.sl_no} />
              </View>
              {isLocked || isArchived || roleType !== 'cOwner' ? null : (
                <FormButton
                  isYellow={true}
                  onPress={() => setEdit(true)}
                  label="Edit"
                />
              )}
            </View>
          )}
        </View>
      </KeyboardAwareScroll>
    </View>
  );
};

export default AttachmentDetails;
