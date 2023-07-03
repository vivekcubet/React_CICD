import {View, Text, FlatList} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import CommonStyles from '../../../../theme/CommonStyles';
import {getHeight} from '../../../../theme/Constants';
import Colors from '../../../../theme/Colors';
interface PartsInterface {
  partsData: any[];
}
const PartsTable: FC<PartsInterface> = ({partsData}) => {
  return (
    <>
      <View
        style={[
          CommonStyles.flexRowContainer,
          {
            height: getHeight(22),

            backgroundColor: Colors.backgroundGray,
          },
        ]}>
        <View style={styles.tableHeadContainer}>
          <Text style={styles.tableTxt}>Description</Text>
        </View>
        <View style={[styles.tableHeadContainer, CommonStyles.containerFlex1]}>
          <Text style={styles.tableTxt}>Part #</Text>
        </View>
        <View style={[styles.tableHeadContainer, CommonStyles.containerFlex1]}>
          <Text style={styles.tableTxt}>QTY</Text>
        </View>
      </View>
      <FlatList
        data={partsData}
        renderItem={({item}: any) => {
          return (
            <>
              <Text style={styles.categoryText}>{item?.category}</Text>
              {item.parts && item.parts.length > 0 ? (
                <>
                  {item.parts.map((part: any) => {
                    return (
                      <View
                        key={part.parts_id.toString()}
                        style={[
                          CommonStyles.flexRowContainer,
                          styles.tableContainer,
                        ]}>
                        <View style={styles.tableHeadContainer}>
                          <Text
                            style={[
                              styles.tableTxt,
                              {fontSize: getHeight(55)},
                            ]}>
                            {part?.description}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableHeadContainer,
                            CommonStyles.containerFlex1,
                          ]}>
                          <Text
                            style={[
                              styles.tableTxt,
                              {fontSize: getHeight(55)},
                            ]}>
                            {part?.part_no}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableHeadContainer,
                            CommonStyles.containerFlex1,
                          ]}>
                          <Text
                            style={[
                              styles.tableTxt,
                              {fontSize: getHeight(55)},
                            ]}>
                            {part?.quantity + part?.measurement_type}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : null}
            </>
          );
        }}
      />
    </>
  );
};

export default PartsTable;
