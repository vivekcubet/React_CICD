import {StyleSheet} from 'react-native';
import Colors from '../../../theme/Colors';
import {getHeight} from '../../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    minHeight: getHeight(20),
    borderBottomColor: Colors.menUGrayBg,
  },
  titleText: {
    textAlign: 'center',
    fontSize: getHeight(53),
    fontWeight: '700',
  },
  tabItem: {
    flex: 1,
    height: '100%',
  },
  addBtnContainer: {
    width: '100%',
    alignItems: 'flex-end',
    height: getHeight(22),
    justifyContent: 'center',
  },
});

export default styles;
