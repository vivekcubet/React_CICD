import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';

const styles = StyleSheet.create({
  proPicContainer: {
    flex: 1,
    alignItems: 'center',
  },
  proPicView: {
    height: getHeight(7),
    width: getHeight(7),
    backgroundColor: Colors.menUGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: getWidth(45),
    borderRadius: getWidth(1),
  },
  proPic: {
    height: '100%',
    width: '100%',
    position: 'relative',
    borderRadius: 100,
    resizeMode: 'contain',
    // backgroundColor: Colors.menUGrayBg,
    // borderRadius: 100,
  },
  companyName: {
    marginTop: getHeight(50),
    fontWeight: '700',
    fontSize: getHeight(45),
    color: Colors.black,
    fontFamily: 'Inter',
  },
  editBtn: {
    width: getWidth(4),
    height: getHeight(25),
    backgroundColor: Colors.black,
    borderRadius: 12,
    marginTop: getHeight(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getHeight(20),
  },
  editBtnTxt: {
    color: Colors.white,
    fontSize: getHeight(55),
    fontWeight: '600',
  },
  bottomContainer: {flex: 2.5},
  imgIconContainer: {
    width: getHeight(24),
    height: getHeight(24),
    backgroundColor: Colors.appYellow,
    borderRadius: 100,
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
