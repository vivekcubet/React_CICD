import {View, FlatList, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {MenuIcon} from '../../../../components';
import {getHeight} from '../../../../theme/Constants';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {getEquipmentMenuPermission} from './equipmentMenuPermission';
interface TabMenuInterface {
  equipment: any;
  intervalList: any;
}
const EquipmentTabMenu: FC<TabMenuInterface> = ({
  equipment = null,
  intervalList = [],
}) => {
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View>
      <FlatList
        nestedScrollEnabled={true}
        horizontal={true}
        scrollEnabled={false}
        contentContainerStyle={styles.tabMenuContainer}
        renderItem={({item}) => {
          return (
            <MenuIcon
              isImage={item.isImage}
              isSelected={true}
              onPress={() => {
                if (item?.screen) {
                  navigation.navigate(item.screen, {
                    equipment,
                    intervalList,
                    isAdd: true,
                    status: 'active',
                  });
                }
              }}
              data={item}
            />
          );
        }}
        data={getEquipmentMenuPermission(roleType)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  tabMenuContainer: {
    height: getHeight(8),
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: getHeight(55),
  },
});
export default EquipmentTabMenu;
