/**
 * @format
 */

import {AppRegistry, Text, TextInput, ScrollView} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
KeyboardAwareScrollView.defaultProps =
  KeyboardAwareScrollView.defaultProps || {};
KeyboardAwareScrollView.defaultProps.showsVerticalScrollIndicator = false;
ScrollView.defaultProps = ScrollView.defaultProps || {};
ScrollView.defaultProps.showsVerticalScrollIndicator = false;
AppRegistry.registerComponent(appName, () => App);
