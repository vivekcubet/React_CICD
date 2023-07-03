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

const ServiceTaskList = ({search = '', onTabChange}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const {myServiceTasks, publicServiceTasks, archivedServiceTasks} =
    useSelector((state: RootState) => state.ServiceTaskReducer);
  const [myTasks, setMyTasks] = useState<any>([]);
  const [publicTasks, setPublicTasks] = useState<any>([]);
  const [archivedTasks, setArchivedTasks] = useState<any>([]);
  useEffect(() => {
    console.log(myServiceTasks, 'TASTyui');
  }, [myServiceTasks]);
  /*
  set Search Data
  */
  useEffect(() => {
    let myCatalogList = searchModelList(myServiceTasks, search);
    let publicCatalog = searchModelList(publicServiceTasks, search);
    let archivedCatalog = searchModelList(archivedServiceTasks, search);
    console.log(archivedServiceTasks, 'ARRAY=======ARCH');
    setPublicTasks(publicCatalog);
    setMyTasks(myCatalogList);
    setArchivedTasks(archivedCatalog);
  }, [search, myServiceTasks, publicServiceTasks, archivedServiceTasks]);

  return (
    <>
      <View style={styles.addBtnContainer}>
        <LinkText
          color={Colors.btnOrange}
          onPress={() => navigation.navigate(screens.serviceTaskForm)}
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
          navigation.navigate(screens.serviceTaskDetails, {
            screen: screens.serviceTaskDetails,
            params: {
              taskData: item,
              category: mainItem,
              isPublic: isPublic ? isPublic : false,
              isArchived,
            },
          });
        }}
        isAdmin={roleType === 'sAdmin' ? true : false}
        variables={{
          categoryName: 'name',
          itemName: 'name',
          subArray: 'models',
          // subSecond: 'task_count',
          subFirst: 'task_count',
        }}
        isTask={true}
        publicCatalog={publicTasks}
        myCatalog={myTasks}
        archived={archivedTasks}
      />
    </>
  );
};

export default ServiceTaskList;
