import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: getHeight(50),
    fontFamily: 'Inter',
    fontWeight: '700',
    marginBottom: getHeight(75),
    color: Colors.black,
  },
  nameContainer: {
    flexDirection: 'row',
    height: getHeight(20),
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: getHeight(70),
    // width: '90%',
    // backgroundColor: 'green',
  },
  container: {
    flex: 1,
    minHeight: getHeight(10),
    backgroundColor: Colors.backgroundGray,
    borderRadius: 10,
    marginBottom: getHeight(88),
    padding: 15,
    flexDirection: 'row',
  },
  itemContainer: {
    height: getHeight(2),
    // backgroundColor: 'green',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  itemText: {
    fontSize: getHeight(55),
    color: Colors.black,
  },
  textContainer: {
    flex: 5,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
