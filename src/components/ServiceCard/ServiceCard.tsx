/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import {DeleteButton, Icon} from '..';
interface ServiceCardInterface {
  cardNumber: any;
  cardTitle: any;
  equipmentName: any;
  equipmentUnit: any;
  onPress: any;
  isArchived?: boolean;
  onDeletePress?: any;
  status?: string;
  archiveBtn?: boolean;
  titleLabel: string;
}
const ServiceCard: FC<ServiceCardInterface> = ({
  cardNumber = '',
  cardTitle = '',
  equipmentName = '',
  equipmentUnit = '',
  titleLabel = '',
  onPress,
  isArchived = false,
  onDeletePress,
  archiveBtn,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[styles.container, CommonStyles.shadow]}>
      <View style={styles.serviceNumberContainer}>
        <Text style={styles.serviceTxt}>{titleLabel}</Text>
        <Text style={styles.serviceTxt}>{cardNumber}</Text>
      </View>
      <View style={{flex: 4}}>
        <View style={[styles.intervalContainer]}>
          <View style={{flex: 3, justifyContent: 'center'}}>
            <Text style={styles.serviceTxt}>{cardTitle}</Text>
          </View>
          {archiveBtn ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: getHeight(20),
              }}>
              <DeleteButton
                onPress={() => (onDeletePress ? onDeletePress() : null)}
                isArchive={!isArchived}
                size={getHeight(25)}
                right={0}
                top={0}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.serviceNameContainer}>
          <View style={{flex: 6}}>
            <Text style={[styles.serviceTxt, {marginTop: getWidth(20)}]}>
              {equipmentName} ({'unit #' + equipmentUnit})
            </Text>
          </View>
          <View
            style={[CommonStyles.containerFlex1, CommonStyles.centerContainer]}>
            <Icon
              color={Colors.black}
              size={getHeight(55)}
              family="AntDesign"
              iconName="right"
            />
          </View>
        </View>
      </View>
      {/* <View style={{flex: 1}}></View> */}
    </TouchableOpacity>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  container: {
    minHeight: getHeight(8),
    backgroundColor: Colors.white,
    marginTop: 5,
    borderRadius: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.borderGray,
    marginBottom: getHeight(45),
  },
  serviceNumberContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    borderRightWidth: 1,
    borderColor: Colors.borderGray,
  },
  serviceTxt: {
    fontSize: getHeight(55),
    fontWeight: '500',
    color: Colors.black,
  },
  intervalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: getWidth(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
    minHeight: getHeight(25),
    // backgroundColor: 'green',
    flexDirection: 'row',
  },
  serviceNameContainer: {
    paddingLeft: getWidth(20),
    flex: 2,
    flexDirection: 'row',
    paddingBottom: getHeight(45),
    // backgroundColor: 'yellow',
  },
});
