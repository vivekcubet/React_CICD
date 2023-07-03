/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import CommonStyles from '../../theme/CommonStyles';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import {DeleteButton, Icon} from '..';
import SvgIcon from '../../assets/Icons/SvgIcon';
interface ArchiveItemInterface {
  label: string;
  btnName: string;
  onPress?(): any;
  isEditable?: boolean;
  onPressItem?(): any;
  onPressView?(): any;
  isDanger?: boolean;
  isDelete?: boolean;
  isArchive?: boolean;
  isView?: boolean;
  disabled?: boolean;
}
const ArchiveLabelItem: FC<ArchiveItemInterface> = ({
  label = '',
  isArchive = true,
  onPress,
  onPressItem,
  onPressView,
  isEditable = true,
  isDelete = false,
  isView = false,
  disabled = false,
}) => {
  return (
    <View
      style={[
        CommonStyles.flexRowContainer,
        {
          width: '100%',
          minHeight: getHeight(18),
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderGray,
          marginBottom: getHeight(45),
          paddingBottom: getHeight(45),
        },
      ]}>
      <TouchableOpacity
        activeOpacity={onPressItem ? 0.5 : 1}
        onPress={() => (onPressItem ? onPressItem() : null)}>
        <Text style={{color: Colors.black, maxWidth: getWidth(2)}}>
          {label}
        </Text>
      </TouchableOpacity>
      <View style={CommonStyles.flexRowContainer}>
        {isView ? (
          <TouchableOpacity
            onPressIn={() => {
              if (onPressView) {
                onPressView();
              }
            }}
            style={[
              styles.listDelete,
              {
                backgroundColor: Colors.backgroundGray,
                marginRight: getWidth(25),
              },
            ]}>
            <SvgIcon.ViewIcon width={getHeight(42)} height={getHeight(42)} />
          </TouchableOpacity>
        ) : null}
        {isEditable && !disabled ? (
          <>
            {isDelete ? (
              <TouchableOpacity
                onPressIn={() => {
                  if (onPress) {
                    onPress();
                  }
                }}
                style={[
                  styles.listDelete,
                  {
                    backgroundColor: Colors.errorColor,
                  },
                ]}>
                <Icon
                  color={Colors.white}
                  iconName={'trash-can-outline'}
                  size={getHeight(45)}
                  family="MaterialCommunityIcons"
                />
              </TouchableOpacity>
            ) : (
              <DeleteButton
                onPress={() => {
                  if (onPress) {
                    onPress();
                  }
                }}
                size={getHeight(22)}
                isArchive={!isArchive}
                top={0}
              />
            )}
          </>
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  listDelete: {
    width: getHeight(25),
    height: getHeight(25),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});
export default ArchiveLabelItem;
