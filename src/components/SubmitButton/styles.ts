import {Platform, StyleSheet} from 'react-native';
import {getHeight} from '../../theme/Constants';
const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: getHeight(16),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  btnText: {
    fontSize: getHeight(Platform.OS === 'ios' ? 40 : 45),
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});
export default styles;
