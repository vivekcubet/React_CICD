import {StyleSheet} from 'react-native';
import {getHeight} from '../../theme/Constants';

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: getHeight(14),
    height: getHeight(14),
  },
  container: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    textAlign: 'center',
    marginTop: getHeight(70),
    fontSize: getHeight(85),
    fontWeight: '600',
  },
});

export default styles;
