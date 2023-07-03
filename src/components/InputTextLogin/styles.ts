import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    marginBottom: getHeight(55),
  },
  inputContainer: {
    minHeight: getHeight(17),
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    borderColor: Colors.borderGray,
    paddingLeft: 5,
    alignItems: 'center',
  },

  errorText: {
    marginTop: getHeight(190),
    marginLeft: 10,
    color: Colors.errorColor,
  },
  iconContainer: {
    width: getHeight(20),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    color: Colors.black,
    height: '100%',
    fontSize: getHeight(55),
    fontFamily: 'Inter',
  },
  countryCodeContainer: {
    // backgroundColor: 'red',
    // width: '10%',
    flexDirection: 'row',
    borderRightWidth: 1,
    borderLetWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getHeight(85),
    height: '80%',
    // alignItems: 'center',
    // paddingRight: getHeight(85),
    borderColor: Colors.borderGray,
  },
});

export default styles;
