import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';
import SvgIcon from '../../assets/Icons/SvgIcon';
import CommonStyles from '../../theme/CommonStyles';
interface DeleteButtonInterface {
  onPress?: () => void;
  top?: any;
  isArchive?: boolean;
  size?: any;
  isEdit?: boolean;
  right?: any;
}
const DeleteButton: FC<DeleteButtonInterface> = ({
  onPress,
  top = getHeight(25),
  isArchive = true,
  size = getHeight(20),
  isEdit = false,
  right = getHeight(70),
}: any) => {
  let bgColor = isArchive ? Colors.errorColor : Colors.appYellow;
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[
        styles.iconContainer,
        isEdit ? CommonStyles.shadow : null,
        {
          width: size,
          height: size,
          right: right,
          backgroundColor: isEdit ? Colors.white : bgColor,
          marginTop: top,
        },
      ]}>
      {isEdit ? <SvgIcon.EditIcon /> : <SvgIcon.ArchiveIcon />}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});
export default DeleteButton;
