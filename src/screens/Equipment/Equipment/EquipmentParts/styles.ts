import {StyleSheet} from 'react-native';
import Colors from '../../../../theme/Colors';
import {getHeight} from '../../../../theme/Constants';

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tableHeadContainer: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  categoryText: {
    marginTop: 5,
    color: Colors.black,
    fontWeight: '700',
    fontSize: getHeight(50),
  },
  tableTxt: {
    color: Colors.black,
    fontSize: getHeight(50),
    paddingRight: 10,
  },
  tableContainer: {
    marginTop: getHeight(45),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderGray,
    paddingBottom: getHeight(60),
  },
});
export default styles;
