import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';
const styles = StyleSheet.create({
  container: {
    minHeight: getHeight(12),
    backgroundColor: Colors.appYellow,
    paddingRight: getWidth(18),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
  },
  menuBtn: {
    justifyContent: 'center',
    paddingLeft: getWidth(18),
    flex: 1,
  },
  clientContainer: {
    flex: 1,
    // backgroundColor: 'yellow',
    justifyContent: 'center',
  },
  companyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: 'green',
  },
  companyName: {
    fontWeight: '700',
    fontSize: getHeight(75),
    marginRight: 10,
    width: '45%',
    textAlign: 'right',
    fontFamily: 'Inter',
    color: Colors.black,
  },
  selectContainer: {
    width: '90%',
    height: getHeight(25),
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    justifyContent: 'space-between',
    backgroundColor: '#FFD56A',
    // alignSelf: 'flex-end',
  },
  companyImage: {height: '75%', width: '40%'},
});

export default styles;
