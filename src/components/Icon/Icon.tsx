import React, {FC} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MCicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import {getHeight} from '../../theme/Constants';
export interface IconInterface {
  iconName: string;
  family: string;
  size?: number;
  color?: string;
}
const IconComponent: FC<IconInterface> = ({
  iconName,
  family,
  size = getHeight(38),
  color,
}) => {
  switch (family) {
    case 'MaterialCommunityIcons':
      return <MCicons name={iconName} size={size} color={color} />;
    case 'AntDesign':
      return <AntDesign name={iconName} size={size} color={color} />;
    case 'Feather':
      return <Feather name={iconName} size={size} color={color} />;
    case 'FontAwesome':
      return <FontAwesome name={iconName} size={size} color={color} />;
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconName} size={size} color={color} />;
    case 'Entypo':
      return <Entypo name={iconName} size={size} color={color} />;
    case 'Fontisto':
      return <Fontisto name={iconName} size={size} color={color} />;
    case 'Octicons':
      return <Octicons name={iconName} size={size} color={color} />;
    default:
      return null;
  }
};

export default IconComponent;
