import {StyleSheet} from 'react-native';
import {getHeight} from '../../../theme/Constants';
import Colors from '../../../theme/Colors';
const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    minHeight: getHeight(1),
    justifyContent: 'center',
    backgroundColor: Colors.placeholderColor,
  },
  imageStyle: {
    height: getHeight(3.4),
    width: getHeight(2.5),
    marginTop: getHeight(7),
    marginBottom: getHeight(10),
  },
  btnContainer: {
    width: '100%',
    marginTop: getHeight(18),
    marginBottom: 22,
  },
});

export default styles;
