import {StyleSheet} from 'react-native';
import {getHeight, getWidth} from '../../../../theme/Constants';
import Colors from '../../../../theme/Colors';

const styles = StyleSheet.create({
  iconContainer: {
    width: getHeight(20),
    height: getHeight(20),
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginRight: getWidth(35),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getHeight(45),
  },
  imageContainer: {
    height: getHeight(4.5),
    backgroundColor: Colors.backgroundGray,
    marginTop: getHeight(45),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 10,
    marginBottom: getHeight(40),
  },
  eqImage: {height: '100%', width: '100%', borderRadius: 8},
  fluidTitleContainer: {
    paddingBottom: 5,
    width: getWidth(2.3),
    borderBottomColor: Colors.btnOrange,
    alignSelf: 'center',
    borderBottomWidth: 1,
    marginBottom: getHeight(40),
  },
  fluidTitle: {
    fontSize: getHeight(55),
    color: Colors.btnOrange,
    textAlign: 'center',
  },
});
export default styles;
