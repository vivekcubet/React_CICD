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
import styles from './styles';
import Colors from '../../../theme/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {
  useGetServiceList,
  useArchiveService,
  useUnArchiveService,
} from '../../../Api/hooks';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../navigation/screens';
import {useGetEquipmentIntervals} from '../../../utils/LocalDBHooks';
import {useAlert} from '../../../utils/hooks';
const ServiceList = () => {
  const {Alert, showAlert} = useAlert();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {activeServices, finishedServices, completedServices} = useSelector(
    (state: RootState) => state.ServiceReducer,
  );
  const {roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );

  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const [getServiceList] = useGetServiceList();
  const [archiveService] = useArchiveService();
  const [unArchiveService] = useUnArchiveService();
  const catalogTabs = [
    {
      label: 'Active ',
    },
    {
      label: 'Finished',
    },
    {
      label: 'Completed',
    },
  ];

  const [searchText, setSearch] = useState<string>('');
  const [getEqIntervals] = useGetEquipmentIntervals();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [listData, setListData] = useState<any>([]);
  const zero = 0;
  useEffect(() => {
    getServiceList({isLoader: true});
  }, [userCompany]);
  useEffect(() => {
    console.log(activeServices, 'LIST=========');
  }, [activeServices]);
  const onRefresh = React.useCallback(async () => {
    setSearch('');
    await getServiceList({isLoader: true});
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  //   const serviceOptions = [
  //     activeServices,
  //     finishedServices,
  //     completedServices,
  //   ];
  //   const data = serviceOptions[selectedTab] || completedServices;

  //   setListData(data);
  // }, [
  //   selectedTab,
  //   activeServices,
  //   finishedServices,
  //   completedServices,
  //   equipmentList,
  // ]);
  useEffect(() => {
    let data = [];

    switch (selectedTab) {
      case 0:
        data = activeServices;
        break;
      case 1:
        data = finishedServices;
        break;
      default:
        data = completedServices;
        break;
    }
    setListData(searchText ? searchList(data) : data);
  }, [
    searchText,
    selectedTab,
    activeServices,
    finishedServices,
    completedServices,
    equipmentList,
  ]);
  const searchList = (selectedData: any) => {
    const filteredArray = selectedData.filter((item: any) => {
      if (item?.is_archived === 0 || roleType === 'cOwner') {
        const serviceNo = item?.service_no?.toString().toLowerCase();
        const unitNo = item?.equipment?.unit_no.toString().toLowerCase();
        const slNo = item?.equipment?.sl_no.toString().toLowerCase();
        const intervalHours = item?.interval?.interval_hours
          .toString()
          .toLowerCase();
        return (
          serviceNo?.includes(searchText.toLowerCase()) ||
          unitNo?.includes(searchText.toLowerCase()) ||
          slNo?.includes(searchText.toLowerCase()) ||
          intervalHours?.includes(searchText.toLowerCase())
        );
      }
    });
    return filteredArray;
  };
  const onSelectService = async (service: any, isArchived: boolean) => {
    let intervals = await getEqIntervals({equipment: service?.equipment});
    const statusLookup: any = {
      0: 'active',
      1: 'finished',
    };
    let status = statusLookup[selectedTab] || 'completed';
    navigation.navigate(screens.addService, {
      isFromList: true,
      isView: true,
      equipment: service?.equipment,
      intervalList: intervals,
      service: service,
      status,
      isArchived: isArchived,
    });
  };
  const archiveServiceItem = (serviceId: any) => {
    showAlert('Warning', 'Are you want to archive the service?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await archiveService({
            id: serviceId,
          });
          if (res) {
            console.log('Success');
          }
        },
      },
    ]);
  };
  const unArchiveServiceItem = (serviceId: any) => {
    showAlert('Warning', 'Are you want to unarchive the service?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let res = await unArchiveService({
            id: serviceId,
          });
          if (res) {
            console.log('Success');
          }
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
              navigation.navigate(screens.addService, {
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
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: getHeight(5),
              marginBottom: getHeight(5),
            }}
            onRefresh={() => onRefresh()}
            refreshing={refreshing}
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
                        item?.is_archived === 0
                          ? archiveServiceItem(item.id)
                          : unArchiveServiceItem(item.id)
                      }
                      titleLabel={'Service#'}
                      isArchived={item?.is_archived === 0 ? false : true}
                      cardTitle={item?.interval?.interval_hours + ' Hours'}
                      equipmentUnit={item?.equipment?.unit_no}
                      cardNumber={item?.service_no}
                      equipmentName={item?.equipment?.equipment_model?.name}
                      archiveBtn={
                        (selectedTab === 0 && roleType === 'cOwner') ||
                        (selectedTab === 0 && roleType === 'dOwner')
                      }
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

export default ServiceList;
