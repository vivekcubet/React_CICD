import {StyleSheet} from 'react-native';
import {getHeight} from '../../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: getHeight(18),
    minWidth: '100%',
    paddingBottom: getHeight(7),
  },
  bottomBtnContainer: {flexDirection: 'row'},
  submitBtnContainer: {flex: 1, padding: 5},
});
export default styles;
