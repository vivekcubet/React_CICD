/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {EmptyRecord, TabData, UserCard} from '../../../components';
import {useGetCompanyList} from '../../../Api/hooks';
import {getHeight} from '../../../theme/Constants';
import screens from '../../../navigation/screens';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
interface CompanyListInterface {
  searchText: string;
}
const CompanyList: FC<CompanyListInterface> = ({searchText = ''}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getCompanyList] = useGetCompanyList();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [companyListData, setCompanies] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getCompanies('', searchText, false);
  }, [searchText, selectedTab]);
  const getCompanies = async (page = '', search = '', isNext = false) => {
    const res = await getCompanyList({
      isLoader: true,
      page,
      search,
      isArchived: selectedTab,
    });
    if (!res) {
      return;
    }
    console.log(res, 'RES======');
    setTotalPage(res?.last_page);
    setCurrentPage(page || 1);
    setCompanies(
      isNext
        ? [...companyListData, ...(res.companies || [])]
        : res.companies || [],
    );
    setRefreshing(false);
    console.log(isNext, 'Responce== ', res);
  };
  const navigateToNext = (item: any, isView: boolean) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: screens.companyForm,
          params: {
            isView: selectedTab === 0 && isView ? true : false,
            company: item,
            isEdit: true,
            isArchive: selectedTab === 0 ? false : true,
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
                name: screens.companyForm,
              },
              {name: screens.users},
            ],
          })
        }
      />
      {companyListData.length > 0 ? (
        <FlatList
          onRefresh={() => {
            getCompanies('', searchText, false);
          }}
          refreshing={isRefreshing}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: getHeight(5)}}
          data={companyListData}
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
          renderItem={({item}) => {
            return (
              <UserCard
                onEditPress={
                  selectedTab === 0 ? () => navigateToNext(item, false) : null
                }
                onViewPress={() => navigateToNext(item, true)}
                phone={item?.phone}
                name={item.name}
                address={item?.address}
                email={item?.email}
              />
            );
          }}
          ListEmptyComponent={companyListData.length > 0 ? null : EmptyRecord}
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

export default CompanyList;
