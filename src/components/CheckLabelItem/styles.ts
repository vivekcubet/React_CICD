import {StyleSheet} from 'react-native';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: getHeight(15),
    alignItems: 'center',
    paddingLeft: getWidth(30),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderGray,
    paddingTop: 5,
    paddingBottom: 5,
  },
  labelTxt: {
    flex: 5,
    fontSize: getHeight(50),
    color: Colors.black,
  },
  checkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBtn: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    height: getHeight(30),
    width: getHeight(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
