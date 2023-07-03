import {Text, StyleSheet, View, TouchableOpacity, Linking} from 'react-native';
import React, {FC} from 'react';
import {getHeight} from '../../theme/Constants';
import CommonStyles from '../../theme/CommonStyles';
import {Icon} from '..';
import Colors from '../../theme/Colors';
import SvgIcon from '../../assets/Icons/SvgIcon';
import FileViewer from 'react-native-file-viewer';
interface TableInterface {
  filePath?: string;
  taskName: string;
  comments: string;
  onDeletePress?: any;
  onEditPress?: any;
  isLocal?: any;
  disabled?: boolean;
  isEditable?: boolean;
}
const TaskDocItem: FC<TableInterface> = ({
  filePath = '',
  taskName = '',
  comments = '',
  onDeletePress,
  onEditPress,
  isLocal = false,
  disabled = false,
  isEditable = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={[CommonStyles.containerFlex1, styles.fileIconContainer]}>
        <TouchableOpacity
          onPress={() => {
            if (filePath) {
              if (isLocal) {
                FileViewer.open(filePath);
              } else {
                Linking.openURL(filePath);
              }
            }
          }}
          style={[styles.fileIcon, CommonStyles.shadow]}>
          <SvgIcon.FileIcon />
        </TouchableOpacity>
      </View>
      <View style={{flex: 4, paddingLeft: 15}}>
        <Text numberOfLines={1} style={styles.taskName}>
          {taskName}
        </Text>
        <Text style={{fontSize: getHeight(55), color: Colors.black}}>
          {comments}
        </Text>
      </View>
      {!disabled ? (
        <>
          {isEditable ? (
            <View
              style={[
                CommonStyles.containerFlex1,
                CommonStyles.centerContainer,
              ]}>
              <TouchableOpacity
                onPressIn={() => {
                  if (onEditPress) {
                    onEditPress();
                  }
                }}
                style={[
                  styles.listDelete,
                  CommonStyles.shadow,
                  {
                    backgroundColor: Colors.white,
                  },
                ]}>
                <SvgIcon.EditIcon height={getHeight(65)} />
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            style={[CommonStyles.containerFlex1, CommonStyles.centerContainer]}>
            <TouchableOpacity
              onPressIn={() => {
                if (onDeletePress) {
                  // Are you want to remove the document?

                  onDeletePress();
                }
              }}
              style={[
                styles.listDelete,
                CommonStyles.shadow,
                {
                  backgroundColor: Colors.errorColor,
                },
              ]}>
              <Icon
                color={Colors.white}
                iconName={'trash-can-outline'}
                size={getHeight(45)}
                family="MaterialCommunityIcons"
              />
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    // backgroundColor: 'green',
    alignSelf: 'center',
    flexDirection: 'row',
    minHeight: getHeight(15),
    marginBottom: getHeight(40),
  },
  listDelete: {
    width: getHeight(25),
    height: getHeight(25),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  fileIconContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  fileIcon: {
    height: getHeight(20),
    width: getHeight(20),
    backgroundColor: Colors.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskName: {
    fontSize: getHeight(55),
    fontWeight: 'bold',
    marginBottom: getHeight(85),
    color: Colors.placeholderColor,
  },
});
export default TaskDocItem;
