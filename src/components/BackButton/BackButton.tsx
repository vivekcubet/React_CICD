import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {Icon} from '../../components';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';
import {useNavigation} from '@react-navigation/native';
interface BackButtonInterface {
  onPress?: any;
}
const BackButton: FC<BackButtonInterface> = ({onPress}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          navigation.goBack();
        }
      }}
      style={styles.container}>
      <Icon
        size={getHeight(65)}
        color={Colors.black}
        family="FontAwesome5"
        iconName="chevron-left"
      />
      <Text
        style={{
          marginLeft: getWidth(55),
          fontSize: getHeight(55),
          color: Colors.black,
        }}>
        Back
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center'},
});
