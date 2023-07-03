import {StyleSheet} from 'react-native';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: getHeight(6),
    backgroundColor: Colors.backgroundGray,
    borderRadius: 10,
    marginBottom: getHeight(88),
    padding: 15,
  },
  nameContainer: {
    flexDirection: 'row',
    height: getHeight(20),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: getHeight(70),
    // width: '90%',
    // backgroundColor: 'green',
  },
  nameTxt: {
    color: Colors.black,
    fontFamily: 'Inter',
    fontSize: getHeight(50),
    fontWeight: '600',
    maxWidth: '70%',
  },
  iconContainer: {
    width: getHeight(20),
    height: getHeight(20),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,

    // marginRight: getWidth(18),
  },
  addressTxt: {
    color: Colors.placeholderColor,
    fontSize: getHeight(55),
    marginBottom: 10,
  },
});
export default styles;
