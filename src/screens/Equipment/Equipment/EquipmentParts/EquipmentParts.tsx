/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import Colors from '../../../../theme/Colors';
import {BackButton, SearchBox} from '../../../../components';
import {getHeight} from '../../../../theme/Constants';
import {useGetTemplateParts} from '../../../../utils/LocalDBHooks';
import PartsTable from './PartsTable';
const EquipmentParts = ({route}: any) => {
  const {equipment} = route?.params;
  const [getTemplateParts] = useGetTemplateParts();
  const [partsList, setPartsList] = useState<any>([]);
  const [searchText, setSearch] = useState('');
  useEffect(() => {
    getEquipmentParts();
  }, [searchText]);
  const getEquipmentParts = async () => {
    let res = await getTemplateParts({templateId: equipment?.template_id});
    let filteredList = filterArray(res, searchText);
    setPartsList(filteredList);
  };

  /*
    search an Parts local search
   */
  const filterArray = (arr: any, searchElement: any) => {
    const matchingParts: any = [];
    arr.forEach(function (element: any) {
      console.log(element?.category, 'ELEMENT=======');
      const matchingPartsInElement = element.parts.filter(
        (partItem: any) =>
          (partItem.description &&
            partItem.description
              .toLowerCase()
              .includes(searchElement.toLowerCase())) ||
          (partItem.part_no &&
            partItem.part_no
              .toLowerCase()
              .includes(searchElement.toLowerCase())),
      );
      if (
        element.category &&
        element.category.toLowerCase().includes(searchElement.toLowerCase()) &&
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
    <View
      style={[{backgroundColor: Colors.white}, CommonStyles.containerFlex1]}>
      <View style={CommonStyles.mainContainer}>
        <BackButton />
        <View style={{marginTop: getHeight(45)}}>
          <SearchBox onChange={(text: any) => setSearch(text)} />
        </View>
        <Text
          style={[
            CommonStyles.font45bold,
            {marginTop: getHeight(45), marginBottom: getHeight(45)},
          ]}>
          Parts & Materials List
        </Text>
        <PartsTable partsData={partsList} />
      </View>
    </View>
  );
};

export default EquipmentParts;
