import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';
interface RadioIconInterface {
  size?: number;
  color?: string;
  isSelected?: boolean;
  disabled?: boolean;
  onPress?: any;
}
const RadioIcon: FC<RadioIconInterface> = ({
  size = 24,
  color = Colors.appYellow,
  isSelected = false,
  disabled = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
      activeOpacity={disabled ? 1 : 0.5}>
      <View
        style={[
          styles.mainContainer,
          {
            height: getHeight(size),
            width: getHeight(size),
            borderColor: color,
          },
        ]}>
        {isSelected ? (
          <View
            style={[
              styles.dot,
              {
                backgroundColor: color,
                height: getHeight(size + 14),
                width: getHeight(size + 14),
              },
            ]}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default RadioIcon;

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 1,
    borderColor: Colors.appYellow,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: getHeight(38),
    width: getHeight(38),
    borderRadius: 100,
    backgroundColor: Colors.appYellow,
  },
});
