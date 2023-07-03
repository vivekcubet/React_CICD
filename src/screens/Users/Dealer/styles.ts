import {StyleSheet} from 'react-native';
import {getHeight} from '../../../theme/Constants';
import Colors from '../../../theme/Colors';

const styles = StyleSheet.create({
  linkTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    height: getHeight(22),
    borderBottomColor: Colors.menUGrayBg,
  },
});

export default styles;
