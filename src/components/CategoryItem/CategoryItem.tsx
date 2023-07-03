import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {FC, useEffect} from 'react';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import styles from './styles';
import {categoryVariable} from '../CategoryList/CategoryList';
import {Icon} from '..';
interface CategoryItemInterface {
  data: any;
  onPress(Item: any, mainItem: any): any;
  variables: categoryVariable;
  isArraySub?: boolean;
  isTask?: boolean;
}
const CategoryItem: FC<CategoryItemInterface> = ({
  data,
  onPress,
  variables,
  isArraySub = false,
  isTask = false,
}) => {
  useEffect(() => {
    console.log(isArraySub, 'ARRAy======');
  }, [isArraySub]);

  return (
    <View style={{marginBottom: getHeight(45)}}>
      <Text style={styles.categoryTitle}>{data[variables.categoryName]}</Text>
      <FlatList
        scrollEnabled={false}
        data={data[variables.subArray]}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(item, data)}
              style={styles.container}>
              {/* <View style={styles.textContainer}> */}
              <View style={{width: '95%'}}>
                <View style={styles.nameContainer}>
                  <Text numberOfLines={1} style={styles.itemText}>
                    {item[variables.itemName]}
                  </Text>
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
                            {variables?.subFirst === 'task_count'
                              ? 'Tasks '
                              : ''}
                            {item[variables?.subFirst]
                              .toString()
                              .substring(0, 16)}
                            {item[variables?.subFirst].length > 15 ? '...' : ''}
                          </Text>
                        ) : null}
                        {variables.subSecond && item[variables.subSecond] ? (
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.itemText,
                              {color: Colors.placeholderColor},
                            ]}>
                            {variables?.subFirst ? '  •  ' : ''}
                            {isTask ? 'Task ' : ''}
                            {item[variables.subSecond]
                              .toString()
                              .substring(0, 15)}
                            {item[variables.subSecond].length > 15 ? '...' : ''}
                          </Text>
                        ) : null}
                      </>
                    )}
                  </>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Icon
                  color={Colors.black}
                  size={getHeight(65)}
                  family="AntDesign"
                  iconName="right"
                />
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
          );
        }}
      />
    </View>
  );
};

export default CategoryItem;
