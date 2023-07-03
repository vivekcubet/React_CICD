import {View, Text} from 'react-native';
import React, {FC} from 'react';
import CommonStyles from '../../theme/CommonStyles';
import Colors from '../../theme/Colors';
import tableStyles from '../../theme/tableStyles';
import {getHeight} from '../../theme/Constants';
interface TableItemInterface {
  values: string[];
}
interface TableInterface {
  titles: string[];
  tableContents: TableItemInterface[];
}
const TableComponent: FC<TableInterface> = ({
  titles = [],
  tableContents = [],
}) => {
  return (
    <View style={{marginBottom: getHeight(45)}}>
      <View
        style={[
          CommonStyles.flexRowContainer,
          {backgroundColor: Colors.white},
        ]}>
        {titles.map((item: any) => {
          return (
            <View key={item} style={tableStyles.tableRowContainer}>
              <Text style={tableStyles.tableText}>{item}</Text>
            </View>
          );
        })}
      </View>

      {tableContents.length > 0 ? (
        <>
          {tableContents.map((item: any) => {
            return (
              <>
                {item?.values.length > 0 ? (
                  <View
                    key={item?.values.toString()}
                    style={CommonStyles.flexRowContainer}>
                    {item.values.map((content: any) => {
                      return (
                        <View
                          key={content?.toString()}
                          style={tableStyles.tableRowContainer}>
                          <Text style={tableStyles.tableText}>{content}</Text>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </>
            );
          })}
        </>
      ) : null}
    </View>
  );
};

export default TableComponent;
