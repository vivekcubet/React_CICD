import {StyleSheet} from 'react-native';
import Colors from '../../../theme/Colors';
import {getHeight, getWidth} from '../../../theme/Constants';

const styles = StyleSheet.create({
  titleText: {
    fontSize: getHeight(53),
    fontWeight: '500',
    color: Colors.black,
  },
  tabItem: {
    marginRight: getWidth(15),
    height: '100%',
  },
  categoryTitle: {
    fontSize: getHeight(50),
    fontFamily: 'Inter',
    fontWeight: '700',
    marginBottom: getHeight(85),
    color: Colors.black,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    height: getHeight(22),
    borderBottomColor: Colors.menUGrayBg,
  },
  addBtnContainer: {
    width: '100%',
    flexDirection: 'row',
    height: getHeight(22),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: getHeight(55),
  },
  addBtnText: {
    color: Colors.btnOrange,
    fontWeight: '500',
    fontSize: getHeight(55),
  },
});

export default styles;
