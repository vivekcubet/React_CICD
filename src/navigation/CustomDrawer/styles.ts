import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  drawerItemTextStyle: {
    fontSize: getHeight(50),
    right: 10,
    color: Colors.black,
    // fontFamily: 'Inter',
    fontWeight: '400',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    marginBottom: getHeight(85),
  },
  topContainer: {
    height: getHeight(3.5),
    backgroundColor: Colors.appYellow,
    marginBottom: getHeight(55),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    height: getHeight(1),
  },
  notificationContainer: {
    height: getHeight(17),
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIconContainer: {
    height: '70%',
    width: getHeight(25),
    backgroundColor: 'black',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proImage: {
    resizeMode: 'contain',
    height: getHeight(8),
    width: getHeight(8),
    backgroundColor: '#EDEDED',
    borderRadius: 100,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGray,
  },
  userName: {
    alignSelf: 'center',
    marginTop: getHeight(50),
    color: Colors.black,
    fontSize: getHeight(40),
    fontFamily: 'Inter',
    fontWeight: '700',
    width: '95%',
    textAlign: 'center',
  },
});

export default styles;
