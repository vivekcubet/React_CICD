import {Platform, StyleSheet} from 'react-native';
import {getHeight} from './Constants';
import Colors from './Colors';

const styles = StyleSheet.create({
  title: {
    marginTop: getHeight(25),
    fontSize: getHeight(45),
    fontFamily: 'Inter',
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: Colors.black,
    flex: 1,
    maxWidth: '70%',
  },
  detailsContainer: {
    minHeight: getHeight(4),
    backgroundColor: '#F1F3F7',
    marginTop: getHeight(30),
    borderRadius: 10,
    padding: getHeight(70),
    paddingBottom: getHeight(35),
  },
  titleText: {
    color: '#00154B',
    fontWeight: '700',
    fontSize: getHeight(60),
    fontFamily: 'Inter',
    marginBottom: getHeight(55),
  },
  detailsItemContainer: {
    backgroundColor: Colors.white,
    padding: getHeight(100),
    borderRadius: 10,
    marginBottom: getHeight(35),
  },
  flexRowView: {
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: getHeight(20),
    height: getHeight(20),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: getHeight(25),
  },
});
export default styles;
