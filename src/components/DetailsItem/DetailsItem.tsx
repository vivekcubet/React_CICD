import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {getHeight} from '../../theme/Constants';
import {DeleteButton, Icon, LockButton} from '..';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
interface DetailsItemInterface {
  label: string;
  value: string;
  isEdit?: boolean;
  onArchivePress?(): any;
  onEditPress?(): any;
  isArchived?: boolean;
  isPublic?: boolean;
  isLock?: boolean;
  lockLabel?: string;
}
const DetailsItem: FC<DetailsItemInterface> = ({
  label,
  value,
  isEdit = false,
  isArchived = false,
  onEditPress,
  onArchivePress,
  isPublic = false,
  isLock = false,
  lockLabel = '',
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.labelText}>{label}</Text> : null}
      <View style={styles.textContainer}>
        <Text style={styles.valueText}>{value}</Text>
        <View style={CommonStyles.flexRowContainer}>
          {isLock ? (
            <LockButton label={lockLabel} />
          ) : (
            <>
              {isEdit ? (
                <TouchableOpacity
                  onPress={() => {
                    if (onEditPress) {
                      onEditPress();
                    }
                  }}
                  style={styles.editButton}>
                  <Icon
                    color={Colors.black}
                    iconName="edit"
                    size={getHeight(45)}
                    family="Feather"
                  />
                </TouchableOpacity>
              ) : null}
              {onArchivePress && !isPublic ? (
                <View style={{marginLeft: getHeight(45)}}>
                  <DeleteButton
                    top={0}
                    isArchive={!isArchived}
                    onPress={() => {
                      if (onArchivePress) {
                        onArchivePress();
                      }
                    }}
                  />
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default DetailsItem;
