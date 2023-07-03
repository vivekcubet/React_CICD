import {StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: getHeight(50),
    fontFamily: 'Inter',
    fontWeight: '700',
    // marginBottom: getHeight(75),
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
    minHeight: getHeight(12),
    backgroundColor: Colors.backgroundGray,
    borderRadius: 10,
    flexDirection: 'row',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 10,
    marginBottom: getHeight(88),
    padding: 10,
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
    maxWidth: getWidth(1.5),
  },
  textContainer: {
    flex: 5,
    flexDirection: 'row',
    // backgroundColor: 'green',
  },
  iconContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveButton: {
    height: getHeight(25),
    width: getWidth(3.5),
    backgroundColor: Colors.appYellow,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default styles;
