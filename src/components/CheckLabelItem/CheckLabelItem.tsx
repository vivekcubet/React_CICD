import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';
import SvgIcon from '../../assets/Icons/SvgIcon';
import styles from './styles';
interface CheckLabelItem {
  label: string;
  checked: boolean;
  onPress?(): any;
  editable?: boolean;
}
const CheckLabelItem: FC<CheckLabelItem> = ({
  label = 'Label',
  checked = false,
  editable = true,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.labelTxt}>{label}</Text>
      <View style={styles.checkContainer}>
        <TouchableOpacity
          activeOpacity={editable ? 0.5 : 1}
          onPress={() => {
            if (onPress && editable) {
              onPress();
            }
          }}
          style={styles.checkBtn}>
          {checked ? (
            <SvgIcon.Tick fill={Colors.black} height={getHeight(65)} />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckLabelItem;
