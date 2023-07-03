/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {EmptyRecord, TabData, UserCard} from '../../../components';
import {useGetDealerList} from '../../../Api/hooks';
import {getHeight} from '../../../theme/Constants';
import screens from '../../../navigation/screens';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
interface DealerListInterface {
  searchText: string;
}
const DealerList: FC<DealerListInterface> = ({searchText = ''}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getDealerList] = useGetDealerList();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dealerListData, setDealers] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getCompanies('', searchText, false);
  }, [searchText, selectedTab]);
  const getCompanies = async (page = '', search = '', isNext = false) => {
    const res = await getDealerList({
      isLoader: true,
      page,
      search,
      isArchived: selectedTab,
    });
    if (!res) {
      return;
    }
    console.log(res, 'RES======Dealer', page);
    setTotalPage(res?.last_page);
    setCurrentPage(page || 1);
    setDealers(
      isNext ? [...dealerListData, ...(res.dealers || [])] : res.dealers || [],
    );
    setRefreshing(false);
    console.log(isNext, 'Responce== ', res);
  };
  const navigateToNext = (item: any, isView: boolean) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: screens.dealerForm,
          params: {
            isView: selectedTab === 0 && isView ? true : false,
            dealer: item,
            isEdit: true,
            isArchive: selectedTab === 0 ? false : true,
          },
        },
        {name: screens.users, params: {type: 'dOwner'}},
      ],
    });
  };
  return (
    <>
      <TabData
        onTabChange={(index: any) => {
          setSelectedTab(index);
        }}
        onAddPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: screens.dealerForm,
              },
              {name: screens.users},
            ],
          })
        }
      />
      {dealerListData.length > 0 ? (
        <FlatList
          onRefresh={async () => await getCompanies('', searchText, false)}
          refreshing={isRefreshing}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: getHeight(5)}}
          data={dealerListData}
          keyExtractor={index => index.toString()}
          onEndReached={() => {
            if (currentPage !== totalPage) {
              getCompanies(
                (Number(currentPage) + 1).toString(),
                searchText,
                true,
              );
            }
          }}
          renderItem={({item, index}) => {
            return (
              <UserCard
                key={index.toString()}
                onEditPress={
                  selectedTab === 0 ? () => navigateToNext(item, false) : null
                }
                onViewPress={() => navigateToNext(item, true)}
                isDealer={selectedTab === 0 ? true : false}
                phone={item?.phone}
                name={item.name}
                address={item?.address}
                email={item?.email}
                onAssignPress={() =>
                  navigation.navigate(screens.assignDealerClients, {
                    dealer: item,
                  })
                }
              />
            );
          }}
        />
      ) : (
        <EmptyRecord
          onRefreshing={() => {
            getCompanies('', searchText, false);
          }}
        />
      )}
    </>
  );
};

export default DealerList;
