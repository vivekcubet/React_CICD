import {Platform, StyleSheet} from 'react-native';
import Colors from '../../../../theme/Colors';
import {getHeight} from '../../../../theme/Constants';

const styles = StyleSheet.create({
  title: {
    marginTop: getHeight(25),
    fontSize: getHeight(45),
    fontFamily: 'Inter',
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: Colors.black,
    flex: 1,
    maxWidth: '70%',
    marginBottom: getHeight(75),
  },
  detailsContainer: {
    height: getHeight(1.5),
    backgroundColor: '#F1F3F7',
    marginTop: getHeight(30),
    borderRadius: 10,
    padding: getHeight(60),
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
    // padding: getHeight(100),
    borderRadius: 10,
    marginBottom: getHeight(35),
    height: '100%',
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
  listDelete: {
    width: getHeight(25),
    height: getHeight(25),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
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
  listText: {
    fontSize: getHeight(50),
    width: '80%',
    color: Colors.black,
  },
});
export default styles;
