/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {EmptyRecord, TabData, UserCard} from '../../../components';
import {useGetUserList} from '../../../Api/hooks';
import {getHeight} from '../../../theme/Constants';
import screens from '../../../navigation/screens';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {END_POINTS} from '../../../Api/constants';

interface DealerClientListInterface {
  searchText: string;
}
const DealerClientList: FC<DealerClientListInterface> = ({searchText = ''}) => {
  const {dealerCompany} = useSelector((state: RootState) => state.AuthReducer);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getUserList] = useGetUserList();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [clientList, setClients] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getDealerClients('', searchText, false);
  }, [searchText, selectedTab]);
  const getDealerClients = async (page = '', search = '', isNext = false) => {
    let url =
      END_POINTS.GET_DEALER_CLIENTS +
      '?id=' +
      dealerCompany?.company_id +
      '&is_archived=' +
      selectedTab +
      '&per_page=5&search=' +
      search;
    const res = await getUserList({
      isLoader: true,
      page,
      endUrl: url,
    });
    if (!res) {
      setRefreshing(false);
      return;
    }
    console.log(res, 'RES======CLIENT', url);
    setTotalPage(res?.last_page);
    setCurrentPage(page || 1);
    setClients(
      isNext ? [...clientList, ...(res.clients || [])] : res.clients || [],
    );
    setRefreshing(false);
    console.log(isNext, 'Responce== ', res);
  };
  const viewDetails = (item: any, isView = false) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: screens.addDealerClients,
          params: {
            dealerClient: item,
            isEdit: true,
            isArchive: selectedTab === 0 ? false : true,
            isView: selectedTab === 0 ? isView : false,
          },
        },
        {name: screens.users},
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
                name: screens.addDealerClients,
              },
              {name: screens.users},
            ],
          })
        }
      />
      {clientList.length > 0 ? (
        <FlatList
          onRefresh={async () => await getDealerClients('', searchText, false)}
          refreshing={isRefreshing}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: getHeight(5)}}
          data={clientList}
          keyExtractor={index => index.toString()}
          onEndReached={() => {
            if (currentPage !== totalPage) {
              getDealerClients(
                (Number(currentPage) + 1).toString(),
                searchText,
                true,
              );
            }
          }}
          renderItem={({item}) => {
            return (
              <UserCard
                onViewPress={
                  item.created_by_dealer !== 1 || selectedTab !== 0
                    ? () => {
                        viewDetails(item, true);
                      }
                    : null
                }
                onEditPress={
                  item.created_by_dealer === 1 && selectedTab === 0
                    ? () => {
                        viewDetails(item);
                      }
                    : null
                }
                phone={item?.phone}
                name={item.name}
                address={item?.address}
                email={item?.email}
              />
            );
          }}
        />
      ) : (
        <EmptyRecord
          onRefreshing={() => {
            getDealerClients('', searchText, false);
          }}
        />
      )}
    </>
  );
};

export default DealerClientList;
