import {StyleSheet} from 'react-native';
import Colors from '../../../../theme/Colors';
import {getHeight, getWidth} from '../../../../theme/Constants';

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: getHeight(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  iconContainer: {
    height: getHeight(18),
    width: getHeight(18),
    backgroundColor: '#F3B150',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getWidth(30),
  },
  icon: {height: '45%', width: '45%'},
  title: {
    color: Colors.black,
    fontSize: getHeight(50),
    marginBottom: getHeight(190),
  },
  subTitle: {
    color: Colors.placeholderColor,
    fontSize: getHeight(65),
  },
  detailsContainer: {
    minHeight: getHeight(4),
    backgroundColor: '#F1F3F7',
    marginTop: getHeight(30),
    borderRadius: 10,
    padding: getHeight(60),
    // paddingBottom: getHeight(25),
  },
  detailsItemContainer: {
    backgroundColor: Colors.white,
    padding: getHeight(100),
    borderRadius: 10,
    marginBottom: getHeight(35),
  },
  titleText: {
    color: '#00154B',
    fontWeight: '700',
    fontSize: getHeight(60),
    fontFamily: 'Inter',
    marginBottom: getHeight(55),
  },
  labelText: {
    fontSize: getHeight(55),
    color: Colors.iconGray,
    fontWeight: '600',
    marginBottom: getHeight(55),
  },
  editButton: {
    height: getHeight(20),
    width: getHeight(20),
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
export default styles;
