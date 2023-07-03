import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    padding: getWidth(90),
    marginBottom: getHeight(38),
  },
  label: {
    color: Colors.placeholderColor,
    fontSize: getHeight(60),
    fontFamily: 'Inter',
    fontWeight: '500',
    marginBottom: getHeight(60),
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.borderGray,
    backgroundColor: '#F6F5F5',
    justifyContent: 'center',
  },
  text: {
    fontSize: getHeight(55),
    marginLeft: getWidth(35),
    color: Colors.placeholderColor,
    textAlignVertical: 'center',
  },
  closeContainer: {
    width: getHeight(20),
    height: getHeight(20),
    backgroundColor: Colors.white,
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    resizeMode: 'contain',
    height: '90%',
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: '90%',
    height: getHeight(4),
    justifyContent: 'center',
    backgroundColor: Colors.backgroundGray,
    alignSelf: 'center',
  },
});
export default styles;
