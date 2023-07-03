import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    height: getHeight(22),
    borderBottomColor: Colors.menUGrayBg,
  },
  titleText: {
    fontSize: getHeight(53),
    fontWeight: '700',
  },
  tabItem: {
    marginRight: getWidth(15),
    height: '100%',
  },
});

export default styles;
