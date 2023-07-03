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
// import {useGetMeasurementTypes} from '../../../Api/hooks';

const PartsAndMaterialsList = ({search = '', onTabChange}: any) => {
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const {archivedPartsList, myPartsAndMeterial, publicPartsAndMeterial} =
    useSelector((state: RootState) => state.PartsAndMaterialReducer);
  // const [getPartsMeasurements] = useGetMeasurementTypes();
  const [myParts, setMyParts] = useState<any>([]);
  const [publicParts, setPublicParts] = useState<any>([]);
  const [archivedParts, setArchivedParts] = useState<any>([]);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    // getPartsMeasurements();
  }, []);
  useEffect(() => {
    setShowList();
  }, [archivedPartsList, publicPartsAndMeterial, myPartsAndMeterial]);
  const setShowList = () => {
    const myPartsList = myPartsAndMeterial?.filter(
      (item: any) => item.parts.length > 0,
    );
    const publicPartsList = publicPartsAndMeterial?.filter(
      (item: any) => item.parts.length > 0,
    );
    const archivedPartsData = archivedPartsList?.filter(
      (item: any) => item.parts.length > 0,
    );
    setPublicParts(publicPartsList);
    setArchivedParts(archivedPartsData);
    setMyParts(myPartsList);
  };
  useEffect(() => {
    let myCatalogList = filterArray(myPartsAndMeterial, search);
    let publicCatalog = filterArray(publicPartsAndMeterial, search);
    let archivedCatalog = filterArray(archivedPartsList, search);
    setPublicParts(publicCatalog);
    setMyParts(myCatalogList);
    setArchivedParts(archivedCatalog);
  }, [search]);
  /*
    search an Parts local search
   */
  const filterArray = (arr: any, searchElement: any) => {
    const matchingParts: any = [];
    arr.forEach(function (element: any) {
      const matchingPartsInElement = element.parts.filter(
        (partItem: any) =>
          partItem.description &&
          partItem.description
            .toLowerCase()
            .includes(searchElement.toLowerCase()),
      );
      if (
        element.name &&
        element.name.toLowerCase().includes(searchElement.toLowerCase()) &&
        matchingPartsInElement.length > 0
      ) {
        matchingParts.push({
          ...element,
          parts: matchingPartsInElement,
        });
      } else if (matchingPartsInElement.length > 0) {
        console.log(matchingPartsInElement);
        matchingParts.push({
          ...element,
          parts: matchingPartsInElement,
        });
      }
    });
    return matchingParts;
  };
  return (
    <>
      <View style={styles.addBtnContainer}>
        <LinkText
          color={Colors.btnOrange}
          onPress={() => navigation.navigate(screens.partsForm)}
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
          console.log('ITEm', item);
          navigation.navigate(screens.partsDetails, {
            partsData: item,
            category: mainItem,
            isPublic: isPublic ? isPublic : false,
            isArchived: isArchived ? isArchived : false,
          });
        }}
        isAdmin={roleType === 'sAdmin' ? true : false}
        publicCatalog={publicParts}
        myCatalog={myParts}
        archived={archivedParts}
        variables={{
          categoryName: 'name',
          itemName: 'description',
          subArray: 'parts',
          subFirst: 'part_no',
          subSecond: 'measurementType_name',
        }}
      />
    </>
  );
};

export default PartsAndMaterialsList;
