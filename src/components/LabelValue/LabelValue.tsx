import {View, Text} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
interface LabelValueInterface {
  label: string;
  value: any;
  isBox?: boolean;
}
const LabelValue: FC<LabelValueInterface> = ({
  label = 'Label',
  value = 'value',
  isBox = false,
}) => {
  return (
    <View style={isBox ? styles.box : styles.container}>
      <Text style={styles.labelStyle}>{label}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
};

export default LabelValue;
