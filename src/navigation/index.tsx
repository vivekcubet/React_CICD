import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoardingNavigation from './OnBoardingNavigation';
import MainNavigation from './MainNavigation';
import {View} from 'react-native';
import Colors from '../theme/Colors';
import {Splash} from '../screens';

const index = () => {
  const Stack = createNativeStackNavigator();
  return (
    <View style={{backgroundColor: Colors.white, flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: 'slide_from_right',
            headerShown: false,
          }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="ON_BOARDING" component={OnBoardingNavigation} />
          <Stack.Screen
            options={{
              animation: 'simple_push',
            }}
            name="MAIN"
            component={MainNavigation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default index;
