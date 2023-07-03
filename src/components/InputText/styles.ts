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
  closeIconContainer: {
    minHeight: getHeight(17),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: getWidth(15),
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
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.borderGray,
    backgroundColor: '#F6F5F5',
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: getHeight(55),
    marginLeft: getWidth(35),
    // width: '88%',
    color: Colors.black,
    textAlignVertical: 'top',
    height: '100%',
    // backgroundColor: 'green',
  },
  countryCodeContainer: {
    // backgroundColor: 'red',
    // width: '10%',
    left: getHeight(99),
    borderRightWidth: 1,
    marginRight: getHeight(150),
    flexDirection: 'row',
  },
  modalContainer: {flex: 1, justifyContent: 'center'},
  mainContainer: {
    width: '90%',
    height: '90%',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    padding: getWidth(25),
    borderRadius: 10,
  },
  closeContainer: {alignItems: 'flex-end'},
  closeBtn: {
    height: getHeight(22),
    width: getHeight(22),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: getHeight(40),
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: getHeight(35),
    color: Colors.black,
  },
  itemView: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
    marginBottom: getHeight(35),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: getHeight(50),
  },
  listText: {fontSize: getHeight(45), width: '90%', color: Colors.black},
});
export default styles;
