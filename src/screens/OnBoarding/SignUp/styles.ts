import {StyleSheet} from 'react-native';
import {getHeight} from '../../../theme/Constants';
const styles = StyleSheet.create({
  registerTitle: {
    marginTop: getHeight(30),
    fontSize: getHeight(40),
    fontWeight: '500',
  },
  title: {
    marginTop: getHeight(48),
    marginBottom: getHeight(20),
    fontSize: getHeight(30),
  },
  linkTextContainer: {
    marginTop: getHeight(40),
    alignItems: 'center',
  },
});
export default styles;
