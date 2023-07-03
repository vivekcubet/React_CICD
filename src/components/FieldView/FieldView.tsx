import {View, Text} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
interface FieldViewInterface {
  label?: string;
  value?: string;
}
const FieldView: FC<FieldViewInterface> = ({label, value}) => {
  return (
    <>
      {/* {value ? ( */}
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={[
            styles.valueText,
            {color: value ? Colors.black : Colors.placeholderColor},
          ]}>
          {value ? value : 'Not added'}
        </Text>
      </View>
      {/* ) : null} */}
    </>
  );
};

export default FieldView;
