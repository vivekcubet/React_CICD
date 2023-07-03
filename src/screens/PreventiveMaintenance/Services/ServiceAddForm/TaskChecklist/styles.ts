import {StyleSheet} from 'react-native';
import {getHeight, getWidth} from '../../../../../theme/Constants';
import Colors from '../../../../../theme/Colors';

const styles = StyleSheet.create({
  tableHead: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: getWidth(35),
    // backgroundColor: Colors.transparentAppYellow,
  },
  titleTxt: {
    fontSize: getHeight(55),
    marginTop: getHeight(0),
    marginBottom: getHeight(60),
    marginLeft: getWidth(30),
  },
  tableTitle: {
    fontSize: getHeight(55),
    color: Colors.black,
    fontWeight: '500',
  },
  tableContentText: {
    fontSize: getHeight(55),
    color: Colors.black,
  },
  closeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  closeBtn: {
    height: getHeight(22),
    width: getHeight(22),
    alignItems: 'flex-end',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: getHeight(45),
    fontWeight: '600',
    fontFamily: 'Inter',
    marginBottom: getHeight(35),
    color: Colors.black,
  },
  partText: {
    color: Colors.black,
    marginRight: 10,
    fontSize: getHeight(55),
  },
  modalContainer: {
    backgroundColor: Colors.transparentBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    minHeight: getHeight(1),
    justifyContent: 'center',
  },
  modalTitleContainer: {
    width: getWidth(1.1),
    backgroundColor: Colors.white,
    padding: getWidth(18),
    borderRadius: 10,
  },
});
export default styles;
