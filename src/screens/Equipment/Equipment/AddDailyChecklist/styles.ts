import {StyleSheet} from 'react-native';
import {getHeight, getWidth} from '../../../../theme/Constants';
import Colors from '../../../../theme/Colors';

const styles = StyleSheet.create({
  checkTitle: {
    height: getHeight(24),
    backgroundColor: Colors.transparentAppYellow,
    justifyContent: 'center',
    paddingLeft: getWidth(22),
    marginTop: getHeight(30),
  },
  btnContainer: {
    width: '95%',
    alignSelf: 'center',
    marginTop: getHeight(35),
  },
  detailsContainer: {
    backgroundColor: '#F1F3F7',
    marginTop: getHeight(30),
    borderRadius: 10,
    padding: getHeight(60),
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerView: {
    width: getWidth(2.5),
    minHeight: getHeight(23),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 8,
  },
});
export default styles;
