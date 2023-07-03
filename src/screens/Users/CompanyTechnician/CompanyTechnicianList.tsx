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
interface CompanyOperatorListInterface {
  searchText: string;
}
const CompanyTechnicianList: FC<CompanyOperatorListInterface> = ({
  searchText = '',
}) => {
  const {userCompany, roleType} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getUserList] = useGetUserList();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [companyListData, setCompanies] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getCompanyOperators('', searchText, false);
  }, [searchText, roleType, userCompany, selectedTab]);
  const getCompanyOperators = async (
    page = '',
    search = '',
    isNext = false,
  ) => {
    const res = await getUserList({
      isLoader: true,
      page,
      search,
      roleId: '3',
      company_id: userCompany?.company_id,
      isArchived: selectedTab,
    });
    if (!res) {
      return;
    }
    console.log(res, 'RES======');
    setTotalPage(res?.last_page);
    setCurrentPage(page || 1);
    setCompanies(
      isNext ? [...companyListData, ...(res.users || [])] : res.users || [],
    );
    setRefreshing(false);
    console.log(isNext, 'Responce== ', res);
  };
  const navigateToNext = (item: any) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: screens.companyTechnicianForm,
          params: {
            companyTechnician: item,
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
                name: screens.companyTechnicianForm,
              },
              {name: screens.users},
            ],
          })
        }
      />
      {companyListData.length > 0 ? (
        <FlatList
          onRefresh={async () =>
            await getCompanyOperators('', searchText, false)
          }
          refreshing={isRefreshing}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: getHeight(5)}}
          data={companyListData}
          keyExtractor={item => item.id.toString()}
          onEndReached={async () => {
            if (currentPage !== totalPage) {
              getCompanyOperators(
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
                  selectedTab === 0 ? () => navigateToNext(item) : null
                }
                onViewPress={
                  selectedTab !== 0 ? () => navigateToNext(item) : null
                }
                phone={item?.phone_number}
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
            getCompanyOperators('', searchText, false);
          }}
        />
      )}
    </>
  );
};

export default CompanyTechnicianList;
