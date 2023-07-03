import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';
interface LinkTextInterface {
  label: string;
  onPress(): any;
  color?: string;
  isNormal?: boolean;
}
const LinkText: FC<LinkTextInterface> = ({
  label,
  onPress,
  color,
  isNormal = false,
}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={() => onPress()}>
      <Text
        style={[
          isNormal ? styles.lightText : styles.text,
          {color: color ? color : Colors.black},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default LinkText;

const styles = StyleSheet.create({
  text: {
    fontSize: getHeight(55),
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  lightText: {
    fontSize: getHeight(65),
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  btn: {
    minHeight: getHeight(25),
    justifyContent: 'center',
  },
});
