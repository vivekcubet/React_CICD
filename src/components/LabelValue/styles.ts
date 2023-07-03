import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    paddingBottom: getHeight(85),
    borderBottomWidth: 0.6,
    borderColor: '#C6C6C8',
    marginBottom: getHeight(55),
  },
  box: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    paddingBottom: getHeight(85),
    borderWidth: 0.6,
    borderColor: '#C6C6C8',
    marginBottom: getHeight(55),
  },
  labelStyle: {
    color: Colors.iconGray,
    marginBottom: getHeight(85),
    fontSize: getHeight(65),
  },
  valueText: {
    color: Colors.black,
    fontSize: getHeight(55),
  },
});
export default styles;
