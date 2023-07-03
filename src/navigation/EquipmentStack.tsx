import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AddAttachment,
  AddDailyChecklist,
  EquipmentDetails,
  EquipmentDocument,
  EquipmentForm,
  EquipmentList,
  EquipmentParts,
  RepairAddForm,
  ServiceAddForm,
} from '../screens';
import {StatusBar} from 'react-native';
import Colors from '../theme/Colors';

const EquipmentStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.appYellow} />
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
        }}>
        <Stack.Screen name="EQUIPMENT_LIST" component={EquipmentList} />

        <Stack.Screen name="EQUIPMENT_FORM" component={EquipmentForm} />
        <Stack.Screen name="ADD_ATTACHMENT" component={AddAttachment} />
        <Stack.Screen name="EQUIPMENT_DETAILS" component={EquipmentDetails} />
        <Stack.Screen
          name="EQUIPMENT_DOCUMENTS"
          component={EquipmentDocument}
        />
        <Stack.Screen name="EQUIPMENT_PARTS" component={EquipmentParts} />
        <Stack.Screen name="ADD_SERVICE" component={ServiceAddForm} />
        <Stack.Screen name="ADD_REPAIR" component={RepairAddForm} />
        <Stack.Screen
          name="ADD_DAILY_CHECKLIST"
          component={AddDailyChecklist}
        />
      </Stack.Navigator>
    </>
  );
};
export default EquipmentStack;
