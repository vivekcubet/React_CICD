import {StyleSheet} from 'react-native';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FC',
    padding: getHeight(90),
    borderRadius: 10,
    paddingBottom: getHeight(30),
    marginBottom: getHeight(45),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentName: {
    fontWeight: '600',
    fontSize: getHeight(45),
    color: Colors.black,
  },
  modelName: {
    color: Colors.black,
    fontSize: getHeight(55),
    marginBottom: getHeight(80),
    maxWidth: getWidth(1.6),
  },
  modelSubName: {
    color: Colors.placeholderColor,
    fontSize: getHeight(55),
    marginBottom: getHeight(80),
  },

  tableRowContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    minHeight: getHeight(25),
    justifyContent: 'center',
    padding: getHeight(90),
  },
  tableText: {
    color: Colors.black,
    fontSize: getHeight(55),
  },
  archiveButton: {
    width: getWidth(2.5),
    height: getHeight(25),

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  archiveText: {fontSize: getHeight(55), fontWeight: '500'},
});

export default styles;
