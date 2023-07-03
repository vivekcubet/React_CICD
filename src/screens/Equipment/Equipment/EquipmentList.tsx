/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../../../theme/Colors';
import CommonStyles from '../../../theme/CommonStyles';
import {
  CardItem,
  EmptyRecord,
  EquipmentItem,
  LinkText,
  SearchBox,
} from '../../../components';
import styles from './styles';
import screens from '../../../navigation/screens';
import {getHeight, getWidth} from '../../../theme/Constants';
import {
  useArchiveAttachment,
  useGetAttachments,
  useGetEquipments,
  useGetServiceIntervals,
} from '../../../Api/hooks';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {useFocusEffect} from '@react-navigation/native';
import {useAlert} from '../../../utils/hooks';
import {updateEquipment} from '../../../redux/reducers/GlobalReducer';
const EquipmentList = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {Alert, showAlert} = useAlert();
  const [getServiceIntervals] = useGetServiceIntervals();
  const [getEquipments] = useGetEquipments();
  const [getAttachments] = useGetAttachments();
  const {equipmentList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const {attachmentList} = useSelector(
    (state: RootState) => state.AttachmentReducer,
  );
  const [searchText, setSearch] = useState('');
  const catalogTabs = [
    {
      label: 'Equipments',
    },
    {
      label: 'Attachments',
    },
  ];
  const tabRef = useRef<any>();
  const [archiveAttachment] = useArchiveAttachment();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [equipmentListData, setEquipmentList] = useState<any>([]);
  const [attachmentListData, setAttachmentListData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const zero = 0;
  useFocusEffect(
    React.useCallback(() => {
      dispatch(updateEquipment(null));
      loadData();
    }, []),
  );
  const loadData = async () => {
    await getEquipments({isLoader: false});
    await getServiceIntervals({isLoader: false});
    getAttachments({isLoader: true});
  };
  useEffect(() => {
    tabRef?.current?.setPage(selectedTab);
  }, [selectedTab]);
  const onRefresh = React.useCallback(async () => {
    setSearch('');
    loadData();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  useEffect(() => {
    searchAttachments();
  }, [searchText, attachmentList]);

  /// Search Attachment
  const searchAttachments = () => {
    const filteredArray = attachmentList.filter((item: any) => {
      const {unit_no, make, model, is_archived} = item;
      if (is_archived === 0 || roleType === 'cOwner') {
        // Convert search string and values to lowercase for case-insensitive comparison
        const searchStringLower = searchText.toLowerCase();
        const unitNoLower = unit_no.toLowerCase();
        const makeLower = make.toLowerCase();
        const modelLower = model.toLowerCase();
        // Check if any property contains the search string
        return (
          unitNoLower.includes(searchStringLower) ||
          makeLower.includes(searchStringLower) ||
          modelLower.includes(searchStringLower)
        );
      }
    });

    setAttachmentListData(filteredArray);
  };
  useEffect(() => {
    setEquipmentList(searchEquipment);
  }, [equipmentList, attachmentList, searchText]);

  const searchEquipment = () => {
    const searchTerm = searchText.toLowerCase();
    const matchingModels: any = [];
    equipmentList.forEach(function (element: any) {
      const matchingPartsInElement = element.parts.filter(
        (part: any) =>
          (part.unit_no &&
            part.unit_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (part.unit_no &&
            part.model.toLowerCase().includes(searchTerm.toLowerCase())),
      );
      if (
        element.name &&
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        matchingPartsInElement.length > 0
      ) {
        matchingModels.push({
          ...element,
          parts: matchingPartsInElement,
        });
      } else if (matchingPartsInElement.length > 0) {
        matchingModels.push({
          ...element,
          parts: matchingPartsInElement,
        });
      }
    });
    return matchingModels;
  };

  const archiveUpdateAttachment = async (
    attachmentId: any,
    archived: number,
  ) => {
    let archiveTxt = archived === 1 ? 'unarchive' : 'archive';
    showAlert('Warning', 'Are you want to ' + archiveTxt + ' the attachment?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const response = await archiveAttachment({
            id: attachmentId,
            isArchive: archived === 1 ? false : true,
          });
          console.log(response);
        },
      },
    ]);
  };
  return (
    <ScrollView
      // scrollEnabled={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
      }>
      <>
        <View
          style={[
            {backgroundColor: Colors.white},
            CommonStyles.containerFlex1,
          ]}>
          <View style={CommonStyles.mainContainer}>
            <View style={styles.addBtnContainer}>
              <Text style={styles.titleText}>Equipment List</Text>
              {roleType === 'cOwner' ? (
                <LinkText
                  color={Colors.btnOrange}
                  onPress={() => {
                    navigation.navigate(
                      selectedTab === 0
                        ? screens.equipmentForm
                        : screens.addAttachment,
                    );
                  }}
                  label={
                    selectedTab === 0 ? '+ Add Equipment' : '+ Add Attachment'
                  }
                />
              ) : null}
            </View>
            <SearchBox
              onClear={() => setSearch('')}
              searchValue={searchText}
              onChange={(text: string) => setSearch(text)}
            />
            <View style={styles.container}>
              {catalogTabs.map((tab: any, index: number) => {
                return (
                  <TouchableOpacity
                    key={Number(index).toString()}
                    onPress={() => {
                      setSearch('');
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

            {selectedTab === 0 ? (
              <View key="1">
                {equipmentListData.length > 0 ? (
                  <FlatList
                    nestedScrollEnabled={true}
                    data={equipmentListData}
                    renderItem={({item}) => {
                      const filteredArray = item?.parts.filter(
                        (obj: any) => obj.is_archived === 0,
                      );
                      return (
                        <>
                          {filteredArray.length > 0 || roleType === 'cOwner' ? (
                            <>
                              <Text style={styles.categoryTitle}>
                                {item?.name}
                              </Text>
                              {item?.parts.map((eqItem: any) => {
                                return (
                                  <EquipmentItem
                                    key={eqItem.id}
                                    equipment={eqItem}
                                  />
                                );
                              })}
                            </>
                          ) : null}
                        </>
                      );
                    }}
                  />
                ) : (
                  <EmptyRecord />
                )}
              </View>
            ) : (
              <View key="2">
                {attachmentListData.length > 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: getHeight(15)}}
                    data={attachmentListData}
                    renderItem={({item}: any) => {
                      return (
                        <CardItem
                          archiveEnabled={roleType === 'cOwner' ? true : false}
                          isArchive={item?.is_archived === 1 ? false : true}
                          onPressBtn={() =>
                            archiveUpdateAttachment(item?.id, item?.is_archived)
                          }
                          variables={{
                            itemName: 'unit_no',
                            subSecond: 'model',
                            subFirst: 'make',
                            subThird: 'sl_no',
                          }}
                          item={item}
                          onPress={(attachment: any, data: any) => {
                            console.log(data);
                            navigation.navigate(screens.attachmentDetails, {
                              attachment: attachment,
                              isLocked: item.is_locked ? item.is_locked : false,
                              isArchived: item.is_archived
                                ? item.is_archived
                                : false,
                            });
                          }}
                        />
                      );
                    }}
                  />
                ) : (
                  <EmptyRecord />
                )}
              </View>
            )}
            {/* </PagerView> */}
          </View>
        </View>
        <Alert />
      </>
    </ScrollView>
  );
};

export default EquipmentList;
