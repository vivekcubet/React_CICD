import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ForgotPassword,
  Login,
  ResetPassword,
  Signup,
  Welcome,
} from '../screens';
import {StatusBar} from 'react-native';

const OnBoardingNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
        }}>
        <Stack.Screen name="WELCOME" component={Welcome} />
        <Stack.Screen name="SIGN_UP" component={Signup} />
        <Stack.Screen name="LOGIN" component={Login} />
        <Stack.Screen name="FORGOT_PWD" component={ForgotPassword} />
        <Stack.Screen name="RESET_PWD" component={ResetPassword} />
      </Stack.Navigator>
    </>
  );
};
export default OnBoardingNavigation;
