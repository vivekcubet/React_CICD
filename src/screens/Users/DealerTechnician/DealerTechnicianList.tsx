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
interface DealerTechnicianListInterface {
  searchText: string;
}
const DealerTechnicianList: FC<DealerTechnicianListInterface> = ({
  searchText = '',
}) => {
  const {dealerCompany, roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [getUserList] = useGetUserList();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [technicianList, setTechnicians] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getDealerTechnicians('', searchText, false);
  }, [searchText, roleType, userCompany, selectedTab]);
  const getDealerTechnicians = async (
    page = '',
    search = '',
    isNext = false,
  ) => {
    const res = await getUserList({
      isLoader: true,
      page,
      search,
      roleId: '6', // user role ID
      company_id: dealerCompany?.company_id,
      isArchived: selectedTab,
    });
    if (!res) {
      setRefreshing(false);
      return;
    }
    setTotalPage(res?.last_page);
    setCurrentPage(page || 1);
    setTechnicians(
      isNext ? [...technicianList, ...(res.users || [])] : res.users || [],
    );
    setRefreshing(false);
    console.log(isNext, 'Responce== ', res);
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
                name: screens.dealerTechnicianForm,
              },
              {name: screens.users},
            ],
          })
        }
      />
      {technicianList.length > 0 ? (
        <FlatList
          onRefresh={async () =>
            await getDealerTechnicians('', searchText, false)
          }
          refreshing={isRefreshing}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: getHeight(5)}}
          data={technicianList}
          keyExtractor={index => index.toString()}
          onEndReached={() => {
            if (currentPage !== totalPage) {
              getDealerTechnicians(
                (Number(currentPage) + 1).toString(),
                searchText,
                true,
              );
            }
          }}
          renderItem={({item}) => {
            return (
              <UserCard
                onEditPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: screens.dealerTechnicianForm,
                        params: {
                          dealerTechnician: item,
                          isEdit: true,
                          isArchive: selectedTab === 0 ? false : true,
                        },
                      },
                      {name: screens.users},
                    ],
                  })
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
            getDealerTechnicians('', searchText, false);
          }}
        />
      )}
    </>
  );
};

export default DealerTechnicianList;
