import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    height: getHeight(18),
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: Colors.btnOrange,
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: getHeight(60),
  },
});

export default styles;
