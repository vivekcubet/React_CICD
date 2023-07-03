import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Colors from '../../theme/Colors';
import {Icon} from '..';
import {useAlert} from '../../utils/hooks';
import CommonStyles from '../../theme/CommonStyles';
import {getHeight, getWidth} from '../../theme/Constants';
interface Lock {
  label: string;
  usedLocation?: string;
  isPublic?: boolean;
}
const LockButton: FC<Lock> = ({
  label = 'Item',
  usedLocation = 'service template',
  isPublic = false,
}) => {
  let msg =
    'This ' +
    label +
    ' is being locked since it is currently used in a ' +
    usedLocation +
    '.Please remove it from the ' +
    usedLocation +
    ' to unlock editing alternatively create a new one';
  let publicMsg =
    'This ' + label + ' is been created by admin hence unable to edit.';
  const {Alert, showAlert} = useAlert();
  return (
    <TouchableOpacity
      style={[CommonStyles.flexRowContainer, styles.container]}
      onPress={() =>
        showAlert('Warning', isPublic ? publicMsg : msg, [
          {text: 'OK', onPress: () => null},
        ])
      }>
      <Icon color={Colors.placeholderColor} iconName="lock" family="Feather" />
      <Text style={styles.text}>Locked</Text>
      <Alert />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    marginLeft: getWidth(65),
    fontSize: getHeight(55),
    color: Colors.placeholderColor,
  },
});
export default LockButton;
