/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../theme/CommonStyles';
import {FlatList, View} from 'react-native';
import Colors from '../../theme/Colors';
import {useLoadInitialData} from '../../Api/hooks';
import SvgIcon from '../../assets/Icons/SvgIcon';
import {MenuIcon} from '../../components';
import styles from './styles';
import icons from '../../assets/Icons/png';
import ServiceList from './Services/ServiceList';
import RepairList from './Repairs/RepairList';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {
  updateLastRefreshed,
  updatePrevCompany,
} from '../../redux/reducers/AuthReducer';
const PreventiveMaintenance = () => {
  const {userCompany, prevCompanyId, lastRefreshed} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const dispatch = useDispatch();
  const menuList = [
    {
      menu: 'Services',
      Icon: SvgIcon.TasksIcon,
    },
    {
      isImage: true,
      menu: 'Repairs',
      Icon: icons.maintenance,
    },
  ];
  const [selectedTabIndex, setSelectedTab] = useState<number>(0);
  const loadInitialSetup = useLoadInitialData();
  useEffect(() => {
    if (userCompany?.company_id) {
      loadData();
    }
  }, [userCompany]);
  const loadData = async () => {
    console.log(
      !prevCompanyId ||
        prevCompanyId?.toString() !== userCompany?.company_id.toString() ||
        !checkTimeDifference(lastRefreshed),
      'TEST REFRESH====',
      checkTimeDifference(lastRefreshed),
      prevCompanyId,
      userCompany?.company_id,
    );
    if (
      !prevCompanyId ||
      prevCompanyId?.toString() !== userCompany?.company_id.toString() ||
      !checkTimeDifference(lastRefreshed)
    ) {
      console.log('TEST REFRESH====1111');
      await loadInitialSetup();
      dispatch(updatePrevCompany(userCompany?.company_id));
      dispatch(updateLastRefreshed(new Date().toISOString()));
    }
  };
  const checkTimeDifference = (timeStr: any) => {
    const time1 = new Date();
    const time2 = timeStr ? new Date(timeStr) : new Date();

    const timeDifference =
      Math.abs(time2.getTime() - time1.getTime()) / (1000 * 60 * 60); // Calculate time difference in hours

    return timeDifference > 2 ? false : true; // Check if the difference is exactly 2 hours
  };
  return (
    <View
      style={[{backgroundColor: Colors.white}, CommonStyles.containerFlex1]}>
      <View style={CommonStyles.mainContainer}>
        <FlatList
          nestedScrollEnabled={true}
          horizontal={true}
          scrollEnabled={false}
          contentContainerStyle={styles.tabMenuContainer}
          renderItem={({item, index}: any) => {
            return (
              <MenuIcon
                isImage={item.isImage}
                onPress={() => {
                  setSelectedTab(index);
                }}
                isSelected={selectedTabIndex === index ? true : false}
                data={item}
              />
            );
          }}
          data={menuList}
        />
        {selectedTabIndex === 0 ? <ServiceList /> : null}
        {selectedTabIndex === 1 ? <RepairList /> : null}
      </View>
    </View>
  );
};

export default PreventiveMaintenance;
