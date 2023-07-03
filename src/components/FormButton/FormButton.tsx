import {Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
import {getWidth} from '../../theme/Constants';
interface FormBtnInterface {
  label: string;
  onPress(): any;
  isYellow?: boolean;
}
const FormButton: FC<FormBtnInterface> = ({label, onPress, isYellow}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[
        styles.container,
        {
          backgroundColor: isYellow ? Colors.appYellow : Colors.white,
          borderColor: Colors.borderGray,
          borderWidth: getWidth(430),
        },
      ]}>
      <Text
        style={[
          styles.btnText,
          {
            color: isYellow ? Colors.black : Colors.btnOrange,
          },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FormButton;
