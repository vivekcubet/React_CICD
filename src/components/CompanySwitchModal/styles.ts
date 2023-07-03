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
    height: getHeight(20),
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.borderGray,
    backgroundColor: '#F6F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: getHeight(55),
    marginLeft: getWidth(35),
    width: '85%',
  },
  modalContainer: {flex: 1, justifyContent: 'flex-start'},
  mainContainer: {
    width: '90%',
    maxHeight: '90%',
    marginTop: getHeight(20),
    // height: '90%',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    padding: getWidth(22),
    borderRadius: 10,
  },
  closeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  itemView: {
    marginBottom: getHeight(155),
    backgroundColor: '#F8F8FA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: getHeight(18),
    padding: getHeight(55),
    borderRadius: 8,
  },
  listText: {fontSize: getHeight(50), width: '90%', color: Colors.black},
});
export default styles;
