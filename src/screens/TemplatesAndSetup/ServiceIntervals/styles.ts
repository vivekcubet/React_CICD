import {StyleSheet} from 'react-native';
import Colors from '../../../theme/Colors';
import {getHeight} from '../../../theme/Constants';

const styles = StyleSheet.create({
  titleText: {
    fontSize: getHeight(40),
    fontWeight: '700',
    marginBottom: getHeight(35),
  },
  addBtnContainer: {
    width: '100%',
    alignItems: 'flex-end',
    height: getHeight(22),
    justifyContent: 'center',
  },
  addBtnText: {
    color: Colors.btnOrange,
    fontWeight: '500',
    fontSize: getHeight(55),
  },
});

export default styles;
