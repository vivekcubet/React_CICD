import {StyleSheet} from 'react-native';
import Colors from '../../../theme/Colors';
import {getHeight, getWidth} from '../../../theme/Constants';

const styles = StyleSheet.create({
  otpInputBox: {marginTop: getHeight(85), marginBottom: getHeight(15)},
  otpInput: {
    borderRadius: 5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    height: getWidth(8),
    width: getWidth(8),
    fontSize: getHeight(45),
  },
});

export default styles;
