/* eslint-disable react-hooks/exhaustive-deps */
import {Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import {getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import LinkText from '../LinkText/LinkText';
interface TabDataInterface {
  onTabChange(index: number): any;
  onAddPress(): any;
}
const TabData: FC<TabDataInterface> = ({onTabChange, onAddPress}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  let tabList = [
    {
      label: 'Active',
    },
    {
      label: 'Archived',
    },
  ];
  useEffect(() => {
    onTabChange(selectedTab);
  }, [selectedTab]);
  const zero = 0;
  return (
    <View style={styles.container}>
      {tabList.map((tab: any, index: number) => {
        return (
          <TouchableOpacity
            key={Number(index).toString()}
            onPress={() => {
              setSelectedTab(index);
            }}
            style={[
              styles.tabItem,
              {
                borderBottomWidth: selectedTab === index ? getWidth(160) : zero,
                borderBottomColor:
                  selectedTab === index
                    ? Colors.appYellow
                    : Colors.placeholderColor,
              },
            ]}>
            <Text
              style={[
                styles.titleText,
                {
                  color:
                    selectedTab === index
                      ? Colors.black
                      : Colors.placeholderColor,
                },
              ]}>
              {tab?.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View style={styles.linkTextContainer}>
        <LinkText
          color={Colors.btnOrange}
          onPress={() => onAddPress()}
          label="+ Add new"
        />
      </View>
    </View>
  );
};

export default TabData;
