import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {getHeight} from '../../theme/Constants';
import CommonStyles from '../../theme/CommonStyles';
import Colors from '../../theme/Colors';
interface StickerResetInterface {
  label: string;
  isReset: boolean;
  onPress?: any;
  disabled: boolean;
}
const StickerResetItem: FC<StickerResetInterface> = ({
  label = '',
  isReset = true,
  onPress,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelView}>
        <Text style={{fontSize: getHeight(55), color: Colors.black}}>
          {label}
        </Text>
      </View>
      {!disabled ? (
        <View
          style={[CommonStyles.containerFlex1, CommonStyles.centerContainer]}>
          <TouchableOpacity
            activeOpacity={isReset ? 0.5 : 1}
            onPress={() => onPress()}
            style={[
              styles.resetButton,
              {backgroundColor: isReset ? Colors.errorColor : Colors.appYellow},
            ]}>
            <Text
              style={{
                fontSize: getHeight(55),
                color: isReset ? Colors.white : Colors.black,
              }}>
              {isReset ? 'Reset' : 'Undo'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    minHeight: getHeight(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  labelView: {flex: 3, justifyContent: 'center'},
  resetButton: {
    width: '100%',
    height: getHeight(28),

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default StickerResetItem;
