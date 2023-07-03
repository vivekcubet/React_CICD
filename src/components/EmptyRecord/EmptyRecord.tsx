/* eslint-disable react-hooks/exhaustive-deps */
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {FC, useState} from 'react';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';
interface EmptyRecordInterface {
  onRefreshing?: any;
}
const EmptyRecord: FC<EmptyRecordInterface> = ({onRefreshing = null}: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    if (onRefreshing) {
      onRefreshing();
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  }, []);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
      }>
      <View style={styles.container}>
        <Text style={styles.text}>No data available</Text>
      </View>
    </ScrollView>
  );
};

export default EmptyRecord;

const styles = StyleSheet.create({
  container: {
    minHeight: getHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: Colors.placeholderColor,
    fontSize: getHeight(45),
  },
});
