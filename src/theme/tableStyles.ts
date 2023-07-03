import {StyleSheet} from 'react-native';
import {getHeight} from './Constants';
import Colors from './Colors';

const tableStyles = StyleSheet.create({
  tableRowContainer: {
    flex: 1,
    borderWidth: 1.1,
    borderColor: Colors.borderGray,
    minHeight: getHeight(25),
    justifyContent: 'center',
    padding: getHeight(90),
  },
  tableText: {
    color: Colors.black,
    fontSize: getHeight(60),
  },
});
export default tableStyles;
