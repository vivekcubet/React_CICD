import {Platform, StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    width: '100%',
    borderRadius: 8,
    padding: getWidth(22),
    marginBottom: getWidth(22),
  },
  label: {
    color: Colors.placeholderColor,
    fontSize: getHeight(60),
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  valueText: {
    marginTop: getHeight(85),
    fontSize: getHeight(50),
    color: Colors.black,
    fontFamily: 'Inter',
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
  },
});
export default styles;
