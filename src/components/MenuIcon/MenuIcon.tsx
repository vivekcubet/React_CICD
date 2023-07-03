import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';
interface MenuItemInterface {
  Icon: any;
  menu: string;
}
interface MenuIconInterface {
  data: MenuItemInterface;
  isSelected: boolean;
  isImage?: boolean;
  onPress(): any;
}
const MenuIcon: FC<MenuIconInterface> = ({
  data,
  isSelected,
  onPress,
  isImage = false,
}) => {
  const {Icon} = data;
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[
          {backgroundColor: isSelected ? Colors.appYellow : Colors.menUGrayBg},
          styles.container,
        ]}>
        {isImage ? (
          <Image
            resizeMode="contain"
            style={{
              width: getHeight(30),
              height: getHeight(30),
            }}
            source={Icon}
          />
        ) : (
          <Icon
            fill={isSelected ? Colors.black : Colors.placeholderColor}
            height={getHeight(38)}
            width={getHeight(38)}
          />
        )}
      </TouchableOpacity>
      <Text
        numberOfLines={2}
        style={[
          {color: isSelected ? Colors.black : Colors.placeholderColor},
          styles.menuText,
        ]}>
        {data.menu}
      </Text>
    </View>
  );
};

export default MenuIcon;
