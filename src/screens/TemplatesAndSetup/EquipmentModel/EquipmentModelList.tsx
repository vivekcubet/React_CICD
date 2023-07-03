/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import CategoryList from '../../../components/CategoryList/CategoryList';
import {View} from 'react-native';
import styles from './styles';
import screens from '../../../navigation/screens';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LinkText} from '../../../components';
import Colors from '../../../theme/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

const EquipmentModelList = ({search = '', onTabChange}: any) => {
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {myEquipmentModels, publicEquipmentModels, archivedEquipmentModels} =
    useSelector((state: RootState) => state.EquipmentModelReducer);
  const [myModels, setMyModel] = useState<any>([]);
  const [publicModels, setPublicModel] = useState<any>([]);
  const [archivedModels, setArchivedModel] = useState<any>([]);

  useEffect(() => {
    setShowList();
  }, [myEquipmentModels, publicEquipmentModels, archivedEquipmentModels]);
  const setShowList = () => {
    const myModelList = myEquipmentModels.filter(
      item => item.models.length > 0,
    );
    const publicModelList = publicEquipmentModels.filter(
      item => item.models.length > 0,
    );
    const archivedModelList = archivedEquipmentModels.filter(
      item => item.models.length > 0,
    );
    setArchivedModel(archivedModelList);
    setPublicModel(publicModelList);
    setMyModel(myModelList);
  };
  /*
  set Search Data
  */
  useEffect(() => {
    let myCatalogList = filterArray(myEquipmentModels, search);
    let publicCatalog = filterArray(publicEquipmentModels, search);
    let archivedCatalog = filterArray(archivedEquipmentModels, search);
    setPublicModel(publicCatalog);
    setMyModel(myCatalogList);
    setArchivedModel(archivedCatalog);
  }, [search]);

  /*
    search an Equipment models local search
   */
  const filterArray = (arr: any, searchElement: any) => {
    const matchingModels: any = [];
    arr.forEach(function (element: any) {
      const matchingModelsInElement = element.models.filter(
        (model: any) =>
          model.name &&
          model.name.toLowerCase().includes(searchElement.toLowerCase()),
      );
      if (
        element.name &&
        element.name.toLowerCase().includes(searchElement.toLowerCase()) &&
        matchingModelsInElement.length > 0
      ) {
        matchingModels.push({
          ...element,
          models: matchingModelsInElement,
        });
      } else if (matchingModelsInElement.length > 0) {
        console.log('SORT');
        matchingModels.push({
          ...element,
          models: matchingModelsInElement,
        });
      }
    });
    return matchingModels;
  };

  return (
    <>
      <View style={styles.addBtnContainer}>
        <LinkText
          color={Colors.btnOrange}
          onPress={() =>
            navigation.navigate(screens.equipmentModelForm as never)
          }
          label="+ Add new"
        />
      </View>
      <CategoryList
        onTabChange={() => onTabChange()}
        archived={archivedModels}
        variables={{
          categoryName: 'name',
          itemName: 'name',
          subArray: 'models',
          subSecond: 'model',
          subFirst: 'brand',
        }}
        onPressItem={(
          item: any,
          mainItem: any,
          isPublic: boolean,
          isArchived: boolean,
        ) =>
          navigation.navigate(screens.equipmentModelDetails, {
            equipment: item,
            category: mainItem,
            isPublic: isPublic ? isPublic : false,
            isArchived: isArchived ? isArchived : false,
          })
        }
        isAdmin={roleType === 'sAdmin' ? true : false}
        publicCatalog={publicModels}
        myCatalog={myModels}
      />
    </>
  );
};

export default EquipmentModelList;
