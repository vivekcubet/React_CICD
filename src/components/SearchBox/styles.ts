import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    marginBottom: getHeight(55),
  },
  inputContainer: {
    minHeight: getHeight(17),
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    borderColor: 'rgba(30, 30, 30, 0.1)',
    paddingLeft: getWidth(25),
    backgroundColor: '#EDEDED',
  },
  closeIconContainer: {
    minHeight: getHeight(17),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: getWidth(15),
  },
  iconContainer: {
    minHeight: getHeight(17),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: getWidth(10),
  },
  closeContainer: {
    minHeight: getHeight(17),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: getWidth(15),
    // backgroundColor: 'green',
  },
  textInput: {
    flex: 1,
    color: Colors.black,
    height: '100%',
    fontSize: getHeight(55),
    fontFamily: 'Inter',
  },
});

export default styles;
