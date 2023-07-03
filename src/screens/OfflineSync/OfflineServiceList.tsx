import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {LinkText, ServiceCard} from '../../components';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {useSyncServiceList} from '../../Api/hooks';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../navigation/screens';
import {useGetEquipmentIntervals} from '../../utils/LocalDBHooks';

const OfflineServiceList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [postSyncServiceList] = useSyncServiceList();
  const [getEqIntervals] = useGetEquipmentIntervals();
  const {serviceOfflineList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  useEffect(() => {
    console.log(serviceOfflineList, 'SERVICELIST=====');
  }, [serviceOfflineList]);
  const syncAllServiceList = async () => {
    // dispatch(resetOffline());
    const res = postSyncServiceList({data: serviceOfflineList});
    console.log(res);
  };

  const onSelectService = async (service: any) => {
    console.log(service?.equipment, 'EQUIPMENT======Selected');
    let intervals = await getEqIntervals({equipment: service?.equipment});
    navigation.navigate(screens.addService, {
      isFromList: true,
      isView: true,
      equipment: service?.equipment,
      intervalList: intervals,
      service: service,
      status: 'active',
      isArchived: false,
    });
  };
  return (
    <>
      {serviceOfflineList.length > 0 ? (
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
                Service List
              </Text>
            </View>
            <View style={styles.linkContainer}>
              <LinkText
                onPress={() => syncAllServiceList()}
                color={Colors.btnOrange}
                label="Sync all"
              />
            </View>
          </View>
          {serviceOfflineList.map((item: any) => {
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
                titleLabel={'Service#'}
                isArchived={false}
                cardTitle={
                  item?.interval
                    ? item?.interval?.interval_hours + ' Hours'
                    : null
                }
                equipmentUnit={item?.equipment?.unit_no}
                cardNumber={item?.service_no}
                equipmentName={item?.equipment?.equipment_model?.name}
                archiveBtn={false}
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
export default OfflineServiceList;
