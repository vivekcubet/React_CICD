import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import SvgIcon from '../../assets/Icons/SvgIcon';
import {getHeight, getWidth} from '../../theme/Constants';
interface UserCardInterface {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  onEditPress?: any;
  onViewPress?: any;
  onDeletePress?: any;
  isDealer?: boolean;
  onAssignPress?(): any;
}
const UserCard: FC<UserCardInterface> = ({
  onEditPress,
  name,
  address,
  phone,
  email,
  isDealer = false,
  onAssignPress,
  onViewPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text numberOfLines={2} style={styles.nameTxt}>
          {name}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {isDealer ? (
            <TouchableOpacity
              onPress={() => {
                if (onAssignPress) {
                  onAssignPress();
                }
              }}
              style={[styles.iconContainer, {right: getHeight(70)}]}>
              <SvgIcon.Companies width={getHeight(42)} height={getHeight(42)} />
            </TouchableOpacity>
          ) : null}
          {onEditPress ? (
            <TouchableOpacity
              onPress={() => onEditPress()}
              style={[
                styles.iconContainer,
                {marginRight: onViewPress ? getWidth(55) : getWidth(0)},
              ]}>
              <SvgIcon.EditIcon width={getHeight(42)} height={getHeight(42)} />
            </TouchableOpacity>
          ) : null}
          {onViewPress ? (
            <TouchableOpacity
              onPress={() => onViewPress()}
              style={styles.iconContainer}>
              <SvgIcon.ViewIcon width={getHeight(42)} height={getHeight(42)} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <Text numberOfLines={2} style={styles.addressTxt}>
        {address}
      </Text>
      <Text numberOfLines={2} style={styles.addressTxt}>
        {phone}
      </Text>
      <Text numberOfLines={2} style={styles.addressTxt}>
        {email}
      </Text>
    </View>
  );
};

export default UserCard;
