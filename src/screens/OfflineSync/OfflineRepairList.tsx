import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {LinkText, ServiceCard} from '../../components';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {useSyncRepairList} from '../../Api/hooks';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../navigation/screens';

const OfflineRepairList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [postSyncRepairList] = useSyncRepairList();
  const {repairOfflineList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const syncAllChecklist = async () => {
    console.log('first');
    const res = postSyncRepairList({data: repairOfflineList});
    console.log(res);
  };
  const onSelectService = async (repair: any) => {
    let status = 'active';
    navigation.navigate(screens.addRepair, {
      isFromList: true,
      isView: true,
      equipment: repair?.equipment,
      repair: repair,
      status,
      isArchived: false,
    });
  };
  return (
    <>
      {repairOfflineList.length > 0 ? (
        <>
          <View
            style={[
              CommonStyles.flexRowContainer,
              {marginTop: getHeight(45), marginBottom: getHeight(45)},
            ]}>
            <View style={styles.titleTextContainer}>
              <Text
                style={{
                  fontSize: getHeight(45),
                  color: Colors.black,
                }}>
                Repair List
              </Text>
            </View>
            <View style={styles.linkContainer}>
              <LinkText
                onPress={() => syncAllChecklist()}
                color={Colors.btnOrange}
                label="Sync all"
              />
            </View>
          </View>
          {repairOfflineList.map((item: any) => {
            console.log(item, 'REPAIR ITEM====');

            return (
              <ServiceCard
                key={item.toString()}
                onPress={async () => {
                  try {
                    await onSelectService(item);
                  } catch (error) {
                    // Handle the error appropriately
                  }
                }}
                titleLabel={'Repair#'}
                isArchived={item?.is_archived === 0 ? false : true}
                cardTitle={item?.name}
                equipmentUnit={item?.equipment?.unit_no}
                cardNumber={item?.repair_no}
                archiveBtn={false}
                equipmentName={item?.equipment?.equipment_model?.name}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  titleTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  itemContainer: {
    width: '95%',
    minHeight: getHeight(10),
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: getHeight(45),
    padding: 12,
  },
  cardText: {
    fontSize: getHeight(55),
    fontWeight: '500',
    marginBottom: getHeight(65),
  },
  linkContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default OfflineRepairList;
