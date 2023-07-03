import {StyleSheet} from 'react-native';
import {getHeight} from '../../theme/Constants';

const styles = StyleSheet.create({
  tabMenuContainer: {
    height: getHeight(10),
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: getHeight(65),
    flex: 1,
  },
});
export default styles;
