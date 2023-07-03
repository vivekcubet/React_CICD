import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  EquipmentDetails,
  OfflineSync,
  PreventiveMaintenance,
  RepairAddForm,
  ServiceAddForm,
} from '../screens';
import {StatusBar} from 'react-native';
import Colors from '../theme/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

const PreventiveStack = () => {
  const {dailyCheckList, repairOfflineList, serviceOfflineList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    console.log(repairOfflineList.length, 'Get Off Data');
  }, [repairOfflineList]);
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.appYellow} />
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
        }}
        initialRouteName={
          dailyCheckList.length > 0 ||
          repairOfflineList.length > 0 ||
          serviceOfflineList.length > 0
            ? 'OFFLINE_SYNC'
            : 'PREVENTIVE_MAINTENANCE'
        }>
        <Stack.Screen name="OFFLINE_SYNC" component={OfflineSync} />
        <Stack.Screen
          name="PREVENTIVE_MAINTENANCE"
          component={PreventiveMaintenance}
        />
        <Stack.Screen name="ADD_SERVICE" component={ServiceAddForm} />
        <Stack.Screen name="ADD_REPAIR" component={RepairAddForm} />
        <Stack.Screen name="EQUIPMENT_DETAILS" component={EquipmentDetails} />
      </Stack.Navigator>
    </>
  );
};
export default PreventiveStack;
