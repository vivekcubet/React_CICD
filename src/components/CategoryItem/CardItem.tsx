import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';
import {DeleteButton, Icon} from '..';
import styles from './CardStyle';
import SvgIcon from '../../assets/Icons/SvgIcon';
import CommonStyles from '../../theme/CommonStyles';
interface cardItemInterface {
  item: any;
  variables: any;
  isArraySub?: boolean;
  onPress?: any;
  data?: any;
  isTask?: boolean;
  onPressBtn?: any;
  isArchive?: boolean;
  archiveEnabled?: boolean;
}
const CardItem: FC<cardItemInterface> = ({
  item = null,
  variables = null,
  isArraySub = false,
  onPress,
  data,
  isTask = false,
  onPressBtn,
  isArchive = true,
  archiveEnabled = true,
}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            onPress(item, data);
          }
        }}
        style={styles.container}>
        {/* <View style={styles.textContainer}> */}
        <View
          style={{width: '100%', alignSelf: 'center', flexDirection: 'row'}}>
          <View style={{width: '95%'}}>
            <View style={styles.nameContainer}>
              <Text numberOfLines={1} style={styles.itemText}>
                {item[variables.itemName]}
              </Text>
              {onPressBtn && archiveEnabled ? (
                <DeleteButton
                  isArchive={isArchive}
                  onPress={() => (onPressBtn ? onPressBtn(item) : null)}
                  size={getHeight(22)}
                  top={0}
                />
              ) : // <TouchableOpacity style={styles.iconContainer}>
              null}
            </View>
            <View style={styles.textContainer}>
              <>
                {isArraySub === true ? (
                  <>
                    {variables.subFirst ? (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemText,
                          {color: Colors.placeholderColor},
                        ]}>
                        {item[variables.subFirst].map(
                          (textItem: any, index: number) => {
                            if (variables.subFirst) {
                              return index ===
                                item[variables.subFirst].length - 1
                                ? textItem[variables.subSecond]
                                : textItem[variables.subSecond] + '  •  ';
                            }
                          },
                        )}
                      </Text>
                    ) : null}
                  </>
                ) : (
                  <>
                    {variables.subFirst ? (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemText,
                          {color: Colors.placeholderColor},
                        ]}>
                        {item[variables?.subFirst].toString().substring(0, 15)}
                        {item[variables?.subFirst].length > 20 ? '...' : ''}
                      </Text>
                    ) : null}
                    {variables.subSecond && item[variables.subSecond] ? (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemText,
                          {color: Colors.placeholderColor},
                        ]}>
                        {'  •  '}
                        {isTask ? 'Task ' : ''}
                        {item[variables.subSecond].toString().substring(0, 13)}
                        {item[variables.subSecond].length > 20 ? '...' : ''}
                      </Text>
                    ) : null}
                    {variables.subThird && item[variables.subThird] ? (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemText,
                          {color: Colors.placeholderColor},
                        ]}>
                        {'  •  '}
                        {isTask ? 'Task ' : ''}
                        {item[variables.subThird].toString().substring(0, 13)}
                        {item[variables.subThird].length > 20 ? '...' : ''}
                      </Text>
                    ) : null}
                  </>
                )}
              </>
            </View>
          </View>
          <View
            style={{
              width: '5%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Icon
              color={Colors.black}
              size={getHeight(65)}
              family="AntDesign"
              iconName="right"
            />
          </View>
        </View>

        {/* <TouchableOpacity
                onPress={() => onPress(item, data)}
                style={styles.iconContainer}>
                <SvgIcon.ViewIcon
                  width={getHeight(42)}
                  height={getHeight(42)}
                />
              </TouchableOpacity> */}
      </TouchableOpacity>
    </View>
  );
};

export default CardItem;
