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
import {useGetServiceIntervals} from '../../../Api/hooks';

const ServiceTemplatesList = ({search = '', onTabChange}: any) => {
  const [getServiceIntervals] = useGetServiceIntervals();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const {myServiceTemplates, publicServiceTemplates, archivedServiceTemplates} =
    useSelector((state: RootState) => state.ServiceTemplateReducer);
  const [myTemplates, setMyTemplates] = useState<any>([]);
  const [publicTemplates, setPublicTemplates] = useState<any>([]);
  const [archivedTemplates, setArchivedTemplates] = useState<any>([]);
  useEffect(() => {
    getServiceIntervals({isLoader: true});
    console.log(myServiceTemplates, 'TEMPLATEssss');
    setMyTemplates(searchTemplates(myServiceTemplates));
    setPublicTemplates(searchTemplates(publicServiceTemplates));
    setArchivedTemplates(searchTemplates(archivedServiceTemplates));
  }, [
    search,
    myServiceTemplates,
    publicServiceTemplates,
    archivedServiceTemplates,
  ]);

  const searchTemplates = (data: any) => {
    const matchingModels: any = [];
    data.forEach(function (element: any) {
      const matchingModelsInElement = element.templates.filter(
        (template: any) =>
          template.name &&
          template.name.toLowerCase().includes(search.toLowerCase()),
      );
      if (
        element.name &&
        element.name.toLowerCase().includes(search.toLowerCase()) &&
        matchingModelsInElement.length > 0
      ) {
        matchingModels.push({
          ...element,
          templates: matchingModelsInElement,
        });
      } else if (matchingModelsInElement.length > 0) {
        console.log('SORT');
        matchingModels.push({
          ...element,
          templates: matchingModelsInElement,
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
          onPress={() => navigation.navigate(screens.serviceTemplateForm)}
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
          navigation.navigate(screens.serviceTemplateDetails, {
            templateData: item,
            mainItem: mainItem,
            isPublic: isPublic ? isPublic : false,
            isArchived,
          });
        }}
        isAdmin={roleType === 'sAdmin' ? true : false}
        variables={{
          categoryName: 'name',
          itemName: 'name',
          subArray: 'templates',
          subSecond: 'task_count',
          // subFirst: 'name',
        }}
        isTask={true}
        publicCatalog={publicTemplates}
        myCatalog={myTemplates}
        archived={archivedTemplates}
      />
    </>
  );
};

export default ServiceTemplatesList;
