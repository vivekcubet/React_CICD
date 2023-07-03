import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ServiceTaskDetails, ServiceTaskForm} from '../screens';
import {StatusBar} from 'react-native';
import Colors from '../theme/Colors';

const ServiceTaskNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.appYellow} />
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
        }}
        initialRouteName="SERVICE_TASK_DETAILS">
        <Stack.Screen
          name="SERVICE_TASK_DETAILS"
          component={ServiceTaskDetails}
        />
        <Stack.Screen name="SERVICE_TASK_FORM" component={ServiceTaskForm} />
      </Stack.Navigator>
    </>
  );
};
export default ServiceTaskNavigation;
