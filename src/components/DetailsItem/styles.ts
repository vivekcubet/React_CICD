import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.placeholderColor,
    borderBottomWidth: 0.3,
    paddingBottom: getHeight(80),
    marginBottom: getHeight(50),
  },
  labelText: {
    fontSize: getHeight(55),
    color: Colors.iconGray,
    fontWeight: '600',
  },
  valueText: {
    fontSize: getHeight(50),
    color: Colors.black,
    fontWeight: '600',
    marginTop: getWidth(46),
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingRight: getWidth(25),
  },
  editButton: {
    height: getHeight(20),
    width: getHeight(20),
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
export default styles;
