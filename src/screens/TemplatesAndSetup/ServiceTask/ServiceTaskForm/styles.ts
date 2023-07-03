import {Platform, StyleSheet} from 'react-native';
import Colors from '../../../../theme/Colors';
import {getHeight, getWidth} from '../../../../theme/Constants';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  title: {
    marginTop: getHeight(25),
    fontSize: getHeight(45),
    fontFamily: 'Inter',
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: Colors.black,
    flex: 1,
    maxWidth: '70%',
  },
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
  addBtnContainer: {
    alignItems: 'flex-end',
    width: '96%',
    top: -getHeight(45),
  },
  attachBtn: {
    width: getWidth(3),
    height: getHeight(25),
    backgroundColor: Colors.black,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  deleteContainer: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
