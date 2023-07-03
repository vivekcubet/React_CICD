/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {Text, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import CommonStyles from '../../../../../theme/CommonStyles';
import styles from './styles';
import {useGetTemplateParts} from '../../../../../utils/LocalDBHooks';
import PartsTable from '../../../../Equipment/Equipment/EquipmentParts/PartsTable';
import {getHeight, getWidth} from '../../../../../theme/Constants';
import Colors from '../../../../../theme/Colors';

interface PartsInterface {
  equipment: any;
  intervalId?: any;
}
const ServiceParts: FC<PartsInterface> = ({
  equipment = '',
  intervalId = '',
}) => {
  const [getTemplateParts] = useGetTemplateParts();
  const [partsList, setPartsList] = useState<any>([]);
  useEffect(() => {
    getPartsList();
  }, [intervalId]);
  const getPartsList = async () => {
    let res = await getTemplateParts({
      templateId: equipment?.template_id,
      intervalId: intervalId,
    });
    console.log(res, 'equipmentPARTS++++', equipment);
    setPartsList(res);
  };
  return (
    <>
      <View>
        <Text style={[CommonStyles.font45bold, styles.titleTxt]}>
          Materials List
        </Text>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: getHeight(45),
          }}>
          {partsList.length > 0 ? (
            <View style={{width: '100%'}}>
              <PartsTable partsData={partsList} />
            </View>
          ) : (
            <Text style={{color: Colors.placeholderColor}}>
              Records not added
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

export default ServiceParts;
