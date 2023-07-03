/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';
import CommonStyles from '../../theme/CommonStyles';
import SvgIcon from '../../assets/Icons/SvgIcon';
import Fonts from '../../theme/Fonts';
import {Icon} from '..';
interface TemplateTaskInterface {
  item: any;
  isSelected?: boolean;
  isView?: boolean;
  isRemove?: boolean;
  selectedItems?: any[];
  onPressTask?(task: any, isSelected?: boolean): any;
}
const TemplateTaskItem: FC<TemplateTaskInterface> = ({
  item,
  isRemove = false,
  selectedItems = [],
  onPressTask,
}) => {
  let selectedTasks = selectedItems.find(
    intervalItem => intervalItem.id.toString() === item.id.toString(),
  );
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: Colors.borderGray,
        marginBottom: 10,
        backgroundColor: Colors.white,
      }}>
      <View
        style={{
          height: getHeight(28),
          backgroundColor: isRemove ? Colors.white : Colors.backgroundGray,
          paddingLeft: getWidth(25),
          borderBottomWidth: 2,
          borderBottomColor: Colors.borderGray,
          justifyContent: 'center',
        }}>
        <Text
          style={[
            Fonts.B700,
            {
              fontSize: getHeight(55),
              color: Colors.black,
            },
          ]}>
          {item?.interval_hours} Hours
        </Text>
      </View>
      {item?.task && item?.task.length > 0 ? (
        <>
          {item?.task.map((taskItem: any, index: number) => {
            let isSelectedTask = false;
            if (selectedTasks?.task && selectedTasks?.task.length > 0) {
              isSelectedTask = selectedTasks?.task.find((task: any) => {
                console.log(
                  task?.id,
                  'TASK item11111112222',
                  task?.id.toString() === taskItem.id.toString(),
                );
                return task?.id.toString() === taskItem.id.toString();
              });
            }
            console.log(
              isSelectedTask,
              'TASK item1111111',
              isSelectedTask ? 'POPOPOPOPO===========' : '',
            );
            return (
              <>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    {
                      borderBottomWidth:
                        index === item?.task.length - 1 ? 0 : 2,
                      width: '90%',
                      alignSelf: 'center',
                      marginBottom: getHeight(90),
                      borderColor: Colors.borderGray,
                      paddingBottom: getHeight(35),
                      paddingTop: getHeight(75),
                    },
                  ]}>
                  <View
                    style={[
                      CommonStyles.flexRowContainer,
                      {
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: getHeight(55),
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: getHeight(55),
                        color: Colors.black,
                        flexDirection: 'row',
                      }}>
                      {taskItem?.name}
                    </Text>
                    {onPressTask ? (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          if (onPressTask) {
                            onPressTask(
                              taskItem,
                              isSelectedTask ? true : false,
                            );
                          }
                        }}>
                        <View
                          style={{
                            height: getHeight(35),
                            width: getHeight(30),
                            backgroundColor: isRemove
                              ? Colors.errorColor
                              : Colors.appYellow,
                            borderRadius: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {isSelectedTask && !isRemove ? (
                            <SvgIcon.Tick height={getHeight(65)} />
                          ) : null}
                          {isRemove ? (
                            <Icon
                              color={Colors.white}
                              family="Fontisto"
                              iconName="close-a"
                              size={getHeight(65)}
                            />
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text
                    style={{
                      fontSize: getHeight(60),
                      color: Colors.black,
                      lineHeight: 25,
                    }}>
                    {taskItem?.parts[0]?.part?.description}
                    <Text
                      style={{
                        color: Colors.placeholderColor,
                      }}>
                      {'  •  '}
                      {taskItem?.parts[0]?.part?.part_no}
                      {'  •  '}
                      {taskItem?.parts[0]?.quantity + ' '}
                      {taskItem?.parts[0]?.part?.measurement_type?.name}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </>
            );
          })}
        </>
      ) : (
        <View
          style={[
            {
              width: '100%',
              alignSelf: 'center',
              marginBottom: getHeight(90),
              borderColor: Colors.borderGray,
              backgroundColor: Colors.white,
              padding: getHeight(55),
            },
          ]}>
          <Text style={{fontSize: getHeight(55), color: Colors.black}}>
            None
          </Text>
        </View>
      )}
    </View>
  );
};

export default TemplateTaskItem;
