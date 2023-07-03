/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import SvgIcon from '../../assets/Icons/SvgIcon';
import {getHeight} from '../../theme/Constants';
import {MenuIcon, SearchBox} from '../../components';
import {updateSum} from '../../redux/reducers/GlobalReducer';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
// import PagerView from 'react-native-pager-view';
import {
  EquipmentModelList,
  PartsAndMaterialsList,
  ServiceIntervalsList,
  ServiceTaskList,
  ServiceTemplatesList,
} from '../../screens';
import {
  useGetEquipmentModels,
  useGetPartsAndMaterials,
  useGetServiceIntervals,
  useGetServiceTasks,
  useGetServiceTemplates,
} from '../../Api/hooks';
const TemplatesAndSetup = (props: any) => {
  const [getEquipmentModels] = useGetEquipmentModels();
  const [getPartsAndMaterials] = useGetPartsAndMaterials();
  const [getServiceIntervals] = useGetServiceIntervals();
  const [getTaskList] = useGetServiceTasks();
  const [getServicesTemplateList] = useGetServiceTemplates();
  const dispatch = useDispatch();
  const {sum} = useSelector((state: RootState) => state.globalReducer);
  const menuList = [
    {
      menu: 'Service Templates',
      Icon: SvgIcon.TemplateIcon,
    },
    {
      menu: 'Service Tasks',
      Icon: SvgIcon.TasksIcon,
    },
    {
      menu: 'Parts and Materials',
      Icon: SvgIcon.PartsIcon,
    },
    {
      menu: 'Service Intervals',
      Icon: SvgIcon.IntervalsIcon,
    },
    {
      menu: 'Equipment Models',
      Icon: SvgIcon.EquipmentIcon,
    },
  ];
  const [selectedTabIndex, setSelectedTab] = useState<number>(0);
  const [searchText, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  useEffect(() => {
    loadData(selectedTabIndex);
  }, [selectedTabIndex]);
  const loadData = async (index: number) => {
    switch (index) {
      case 0:
        await getServicesTemplateList({isLoader: true});
        break;
      case 1:
        getTaskList({isLoader: true});
        break;
      case 2:
        await getPartsAndMaterials({isLoader: true});
        break;
      case 3:
        await getServiceIntervals({isLoader: true});
        break;
      case 4:
        await getEquipmentModels({isLoader: true});
        break;
      default:
        getEquipmentModels({isLoader: true});
    }
  };
  const onRefresh = React.useCallback((indexSelected: number) => {
    console.log('ONREFRESH====', indexSelected);
    setSearch('');
    loadData(indexSelected);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => onRefresh(selectedTabIndex)}
        />
      }>
      <View
        style={[{backgroundColor: Colors.white}, CommonStyles.containerFlex1]}>
        <View style={CommonStyles.mainContainer}>
          <View>
            <FlatList
              nestedScrollEnabled={true}
              horizontal={true}
              scrollEnabled={false}
              contentContainerStyle={styles.tabMenuContainer}
              renderItem={({item, index}) => {
                return (
                  <MenuIcon
                    onPress={() => {
                      dispatch(updateSum(sum + 1));
                      setSelectedTab(index);
                      setSearch('');
                    }}
                    isSelected={selectedTabIndex === index ? true : false}
                    data={item}
                  />
                );
              }}
              data={menuList}
            />
          </View>
          <View
            style={[CommonStyles.containerFlex1, {marginTop: getHeight(65)}]}>
            <SearchBox
              onClear={() => setSearch('')}
              searchValue={searchText}
              onChange={(text: string) => setSearch(text)}
            />
            {/* <PagerView
              scrollEnabled={true}
              ref={tabRef}
              onPageSelected={e => {
                setSelectedTab(e.nativeEvent.position);
              }}
              style={CommonStyles.containerFlex1}> */}
            {selectedTabIndex === 0 ? (
              <ServiceTemplatesList
                onTabChange={() => setSearch('')}
                search={searchText}
                {...props}
                key="1"
              />
            ) : null}
            {selectedTabIndex === 1 ? (
              <ServiceTaskList
                onTabChange={() => setSearch('')}
                search={searchText}
                key="2"
              />
            ) : null}
            {selectedTabIndex === 2 ? (
              <PartsAndMaterialsList
                {...props}
                onTabChange={() => setSearch('')}
                search={searchText}
                key="3"
              />
            ) : null}
            {selectedTabIndex === 3 ? (
              <ServiceIntervalsList
                search={searchText}
                onTabChange={() => setSearch('')}
                key="4"
              />
            ) : null}
            {selectedTabIndex === 4 ? (
              <EquipmentModelList
                onTabChange={() => {
                  setSearch('');
                }}
                search={searchText}
                key="5"
              />
            ) : null}
            {/* </PagerView> */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TemplatesAndSetup;

const styles = StyleSheet.create({
  tabMenuContainer: {
    height: getHeight(8),
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  addBtnContainer: {
    width: '100%',
    alignItems: 'flex-end',
    height: getHeight(30),
    justifyContent: 'center',
  },
});
