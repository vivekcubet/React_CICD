import {StyleSheet} from 'react-native';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';

const styles = StyleSheet.create({
  titleContainer: {
    height: getHeight(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: getHeight(45),
  },
  titleText: {
    fontSize: getHeight(50),
    fontFamily: 'Inter',
    fontWeight: '700',
    color: Colors.black,
    flex: 1,
  },
  selectContainer: {
    width: getWidth(2.2),
    height: '70%',
    borderWidth: 3,
    borderColor: Colors.borderGray,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    justifyContent: 'space-between',
  },
});

export default styles;
