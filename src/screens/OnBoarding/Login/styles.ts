import {StyleSheet} from 'react-native';
import {getHeight} from '../../../theme/Constants';

const styles = StyleSheet.create({
  loginTitle: {
    marginTop: getHeight(15),
    marginBottom: getHeight(30),
  },
  btnContainer: {
    marginTop: getHeight(50),
    marginBottom: getHeight(40),
  },
  linkContainer: {alignItems: 'center'},
});

export default styles;
