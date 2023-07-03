/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  EmptyRecord,
  LinkText,
  SearchBox,
  ServiceCard,
} from '../../../components';
import CommonStyles from '../../../theme/CommonStyles';
import {getHeight, getWidth} from '../../../theme/Constants';
import {RootState} from '../../../redux/store';
import {useSelector} from 'react-redux';
import styles from './styles';
import Colors from '../../../theme/Colors';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../navigation/screens';
import {
  useArchiveRepair,
  useGetRepairList,
  useUnArchiveRepair,
} from '../../../Api/hooks';
import {useAlert} from '../../../utils/hooks';
import {useGetEquipmentById} from '../../../utils/LocalDBHooks';

const RepairList = () => {
  const [getEquipment] = useGetEquipmentById();
  const {Alert, showAlert} = useAlert();
  const [getRepairList] = useGetRepairList();
  const [unArchiveRepair] = useUnArchiveRepair();
  const [archiveRepair] = useArchiveRepair();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const {repairOfflineList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const {repairList} = useSelector((state: RootState) => state.RepairReducer);
  const catalogTabs = [
    {
      label: 'Completed',
    },
    {
      label: '',
    },
    {
      label: '',
    },
  ];
  const [searchText, setSearch] = useState<string>('');
  // const [getEqIntervals] = useGetEquipmentIntervals();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [listData, setListData] = useState<any>([]);
  const zero = 0;
  useEffect(() => {
    getRepairList({isLoader: true});
  }, [userCompany]);
  useEffect(() => {
    console.log(repairOfflineList, 'REP LIST DATA===');
  }, [repairOfflineList]);
  const onRefresh = React.useCallback(async () => {
    setSearch('');
    await getRepairList({isLoader: true});
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  useEffect(() => {
    searchList();
  }, [searchText, repairList]);
  const onSelectService = async (repair: any, isArchived: boolean) => {
    const statusLookup: any = {
      0: 'active',
      1: 'finished',
    };
    let equipment = await getEquipment({
      equipmentId: repair?.equipment_id,
    });
    let status = statusLookup[selectedTab] || 'completed';
    navigation.navigate(screens.addRepair, {
      isFromList: true,
      isView: true,
      equipment: equipment,
      repair: repair,
      status,
      isArchived: isArchived,
    });
  };
  const searchList = () => {
    const filteredArray = repairList.filter((item: any) => {
      if (item?.is_archived === 0 || roleType === 'cOwner') {
        const repairNo = item?.repair_no?.toString().toLowerCase();
        const unitNo = item?.equipment?.unit_no.toString().toLowerCase();
        const slNo = item?.equipment?.sl_no.toString().toLowerCase();
        const name = item?.name?.toString().toLowerCase();
        return (
          repairNo?.includes(searchText.toLowerCase()) ||
          unitNo?.includes(searchText.toLowerCase()) ||
          slNo?.includes(searchText.toLowerCase()) ||
          name?.includes(searchText.toLowerCase())
        );
      }
    });
    setListData(filteredArray);
    return filteredArray;
  };
  const updateArchiveRepairItem = (repairId: any, isArchive: boolean) => {
    let action = isArchive ? ' archive ' : ' unarchive ';
    showAlert('Warning', 'Are you want to' + action + 'the repair?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = null;
          if (isArchive) {
            res = await archiveRepair({
              id: repairId,
            });
          } else {
            res = await unArchiveRepair({
              id: repairId,
            });
          }
          console.log(res);
        },
      },
    ]);
  };
  return (
    <View style={[CommonStyles.containerFlex1, {minHeight: getHeight(1.22)}]}>
      <SearchBox
        onClear={() => setSearch('')}
        searchValue={searchText}
        onChange={(text: string) => setSearch(text)}
      />
      {roleType === 'cOwner' ? (
        <View style={styles.addBtnContainer}>
          <LinkText
            color={Colors.btnOrange}
            onPress={() =>
              navigation.navigate(screens.addRepair, {
                isNew: true,
                status: 'active',
              })
            }
            label="+ Add new"
          />
        </View>
      ) : null}
      <View style={{marginBottom: getHeight(5)}}>
        <View style={styles.container}>
          {catalogTabs.map((tab: any, index: number) => {
            return (
              <TouchableOpacity
                activeOpacity={tab.label ? 0.5 : 1}
                key={Number(index).toString()}
                onPress={() => {
                  if (tab.label) {
                    setSelectedTab(index);
                  }
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
                  numberOfLines={2}
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
        {listData.length > 0 ? (
          <FlatList
            onRefresh={() => onRefresh()}
            refreshing={refreshing}
            contentContainerStyle={{
              minHeight: getHeight(2),
              paddingBottom: getHeight(3),
            }}
            keyExtractor={item => item.id}
            data={listData}
            renderItem={({item}) => {
              return (
                <>
                  {item?.is_archived === 0 || roleType === 'cOwner' ? (
                    <ServiceCard
                      onPress={async () => {
                        try {
                          await onSelectService(
                            item,
                            item?.is_archived === 0 ? false : true,
                          );
                        } catch (error) {
                          // Handle the error appropriately
                        }
                      }}
                      onDeletePress={() =>
                        updateArchiveRepairItem(
                          item.id,
                          item?.is_archived === 0 ? true : false,
                        )
                      }
                      titleLabel={'Repair#'}
                      isArchived={item?.is_archived === 0 ? false : true}
                      cardTitle={item?.name}
                      equipmentUnit={item?.equipment?.unit_no}
                      cardNumber={item?.repair_no}
                      archiveBtn={
                        roleType === 'cOwner' || roleType === 'dOwner'
                      }
                      equipmentName={item?.equipment?.equipment_model?.name}
                    />
                  ) : null}
                </>
              );
            }}
          />
        ) : (
          <EmptyRecord onRefreshing={() => onRefresh()} />
        )}
      </View>
      <Alert />
    </View>
  );
};

export default RepairList;
