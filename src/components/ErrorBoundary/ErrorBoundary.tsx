import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import CommonStyles from '../../theme/CommonStyles';
import Lottie from 'lottie-react-native';
import animations from '../../assets/animations';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import SubmitButton from '../SubmitButton/SubmitButton';
import RNRestart from 'react-native-restart';
// import RNRestart from 'react-native-restart';
// some stylesheet

export class ErrorBoundary extends React.Component<any, any> {
  state = {
    error: false,
  };

  static getDerivedStateFromError(error: any) {
    console.log(error);
    return {error: true};
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
    // deal with errorInfo if needed
  }

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={CommonStyles.centerContainer}>
          <Lottie
            resizeMode="contain"
            autoPlay
            loop
            source={animations.maintenance}
            style={{height: getWidth(2), width: getWidth(2)}}
          />
          <Text style={[{color: Colors.black}, CommonStyles.font45bold]}>
            Under Maintenance
          </Text>
          <View style={{width: getWidth(1.5), marginTop: getHeight(15)}}>
            <SubmitButton onPress={() => RNRestart.restart()} label="Reload" />
          </View>
        </SafeAreaView>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
