/* eslint-disable react-hooks/exhaustive-deps */
import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CategoryList, LinkText} from '../../../components';
import styles from './styles';
import screens from '../../../navigation/screens';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import Colors from '../../../theme/Colors';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {searchModelList} from '../../../utils/CommonMethods';
const ServiceIntervalsList = ({onTabChange, search}: any) => {
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const {myServiceIntervals, archivedServiceIntervals, publicServiceIntervals} =
    useSelector((state: RootState) => state.ServiceIntervalReducer);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [myIntervals, setMyIntervals] = useState<any>([]);
  const [publicIntervals, setPublicIntervals] = useState<any>([]);
  const [archivedIntervals, setArchivedIntervals] = useState<any>([]);
  useEffect(() => {
    let myCatalogList = searchModelList(myServiceIntervals, search);
    let publicCatalog = searchModelList(publicServiceIntervals, search);
    let archivedCatalog = searchModelList(archivedServiceIntervals, search);
    setPublicIntervals(publicCatalog);
    setMyIntervals(myCatalogList);
    setArchivedIntervals(archivedCatalog);
  }, [
    search,
    myServiceIntervals,
    archivedServiceIntervals,
    publicServiceIntervals,
  ]);

  return (
    <>
      <View style={styles.addBtnContainer}>
        <LinkText
          color={Colors.btnOrange}
          onPress={() => navigation.navigate(screens.serviceIntervalForm)}
          label="+ Add new"
        />
      </View>
      <CategoryList
        onTabChange={() => onTabChange()}
        onPressItem={(
          item: any,
          mainItem: any,
          isPublic: boolean,
          isArchived: boolean,
        ) => {
          navigation.navigate(screens.serviceIntervalDetails, {
            intervalData: item,
            category: mainItem,
            isPublic: isPublic ? isPublic : false,
            isArchived,
          });
        }}
        isArraySub={true}
        isAdmin={roleType === 'sAdmin' ? true : false}
        variables={{
          categoryName: 'name',
          itemName: 'name',
          subArray: 'models',
          subSecond: 'interval_hours',
          subFirst: 'intervals',
        }}
        publicCatalog={publicIntervals}
        myCatalog={myIntervals}
        archived={archivedIntervals}
      />
    </>
  );
};

export default ServiceIntervalsList;
