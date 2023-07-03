import {Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
interface SubmitButtonInterface {
  label: string;
  onPress(): any;
  isWhite?: boolean;
  isBorder?: boolean;
}
const SubmitButton: FC<SubmitButtonInterface> = ({
  label,
  onPress,
  isWhite = false,
  isBorder = true,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[
        {
          borderColor: isBorder ? Colors.borderGray : Colors.black,
          backgroundColor: isWhite ? Colors.white : Colors.black,
        },
        styles.button,
      ]}>
      <Text
        style={[
          {color: isWhite ? Colors.black : Colors.white},
          styles.btnText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
