import {StyleSheet} from 'react-native';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';

const styles = StyleSheet.create({
  linkTextContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
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
