/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {CategoryItem, EmptyRecord} from '../../components';
import {getHeight, getWidth} from '../../theme/Constants';
import styles from './styles';
import Colors from '../../theme/Colors';
import PagerView from 'react-native-pager-view';
import CommonStyles from '../../theme/CommonStyles';
export interface categoryVariable {
  categoryName: string;
  itemName: string;
  subFirst?: string;
  subSecond?: any;
  subArray: string;
}
interface CategoryListInterface {
  isAdmin?: boolean;
  myCatalog: any[];
  publicCatalog: any[];
  archived: any[];
  onPressItem(
    item: any,
    mainItem: any,
    isPublic: boolean,
    isArchived: boolean,
  ): any;
  variables: categoryVariable;
  isArraySub?: boolean;
  onTabChange: any;
  isTask?: boolean;
}
const CategoryList: FC<CategoryListInterface> = ({
  myCatalog,
  publicCatalog,
  archived = [],
  onPressItem,
  isAdmin = false,
  variables,
  onTabChange,
  isArraySub = false,
  isTask = false,
}) => {
  const catalogTabs = [
    {
      label: 'My Catalog',
    },
    {
      label: 'Public Catalog',
    },
    {
      label: 'Archived',
    },
  ];
  const tabRef = useRef<any>();
  const [tabList, setTabList] = useState<any>(catalogTabs);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const zero = 0;

  useEffect(() => {
    console.log(isArraySub, 'ARRAy======111');
    if (isAdmin) {
      const filteredArray = catalogTabs.filter(
        obj => obj.label !== 'Public Catalog',
      );
      setTabList(filteredArray);
    }
    if (onTabChange) {
      console.log('firstokkk111');
      onTabChange();
    }
    tabRef?.current?.setPage(selectedTab);
  }, [selectedTab, isAdmin, isArraySub]);
  return (
    <>
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
                  borderBottomWidth:
                    selectedTab === index ? getWidth(160) : zero,
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
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {isAdmin ? (
        <PagerView
          ref={tabRef}
          onPageSelected={e => {
            setSelectedTab(e.nativeEvent.position);
          }}
          style={CommonStyles.containerFlex1}>
          <View key="1">
            {myCatalog.length > 0 ? (
              <FlatList
                keyExtractor={item => item?.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: getHeight(5)}}
                data={myCatalog}
                renderItem={({item}) => {
                  console.log(item, 'ITEm====');
                  return (
                    <CategoryItem
                      isTask={isTask}
                      isArraySub={isArraySub}
                      variables={variables}
                      onPress={(selectedItem: any, mainItem: any) =>
                        onPressItem(selectedItem, mainItem, false, false)
                      }
                      data={item}
                    />
                  );
                }}
              />
            ) : (
              <EmptyRecord />
            )}
          </View>
          <View key="2">
            {archived.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: getHeight(5)}}
                data={archived}
                renderItem={({item}) => {
                  return (
                    <CategoryItem
                      isTask={isTask}
                      isArraySub={isArraySub}
                      variables={variables}
                      onPress={(selectedItem, mainItem) =>
                        onPressItem(selectedItem, mainItem, false, true)
                      }
                      data={item}
                    />
                  );
                }}
              />
            ) : (
              <EmptyRecord />
            )}
          </View>
        </PagerView>
      ) : (
        <PagerView
          ref={tabRef}
          onPageSelected={e => {
            setSelectedTab(e.nativeEvent.position);
          }}
          style={CommonStyles.containerFlex1}>
          <View key="1">
            {myCatalog.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: getHeight(5)}}
                data={myCatalog}
                renderItem={({item}) => {
                  return (
                    <CategoryItem
                      isTask={isTask}
                      isArraySub={isArraySub}
                      variables={variables}
                      onPress={(selectedItem: any, mainItem: any) =>
                        onPressItem(selectedItem, mainItem, false, false)
                      }
                      data={item}
                    />
                  );
                }}
              />
            ) : (
              <EmptyRecord />
            )}
          </View>
          <View key="2">
            {publicCatalog.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: getHeight(5)}}
                data={publicCatalog}
                renderItem={({item}) => {
                  return (
                    <CategoryItem
                      isTask={isTask}
                      isArraySub={isArraySub}
                      variables={variables}
                      onPress={(selectedItem, mainItem) =>
                        onPressItem(selectedItem, mainItem, true, false)
                      }
                      data={item}
                    />
                  );
                }}
              />
            ) : (
              <EmptyRecord />
            )}
          </View>
          <View key="3">
            {archived.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: getHeight(5)}}
                data={archived}
                renderItem={({item}) => {
                  return (
                    <CategoryItem
                      isTask={isTask}
                      isArraySub={isArraySub}
                      variables={variables}
                      onPress={(selectedItem, mainItem) =>
                        onPressItem(selectedItem, mainItem, false, true)
                      }
                      data={item}
                    />
                  );
                }}
              />
            ) : (
              <EmptyRecord />
            )}
          </View>
        </PagerView>
      )}
    </>
  );
};

export default CategoryList;
