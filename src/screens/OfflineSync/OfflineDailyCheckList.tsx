import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {LinkText} from '../../components';
import {getHeight} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import moment from 'moment';
import {usePostSyncDailyChecklist} from '../../Api/hooks';

const OfflineDailyCheckList = () => {
  const [postSyncChecklist] = usePostSyncDailyChecklist();
  const {dailyCheckList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const syncAllChecklist = async () => {
    const res = postSyncChecklist({data: dailyCheckList});
    console.log(res);
  };
  return (
    <>
      {dailyCheckList.length > 0 ? (
        <>
          <View
            style={[
              CommonStyles.flexRowContainer,
              {marginTop: getHeight(45), marginBottom: getHeight(45)},
            ]}>
            <View style={styles.titleTextContainer}>
              <Text
                style={{
                  fontSize: getHeight(45),
                  color: Colors.black,
                }}>
                Daily checklist
              </Text>
            </View>
            <View style={styles.linkContainer}>
              <LinkText
                onPress={() => syncAllChecklist()}
                color={Colors.btnOrange}
                label="Sync all"
              />
            </View>
          </View>
          {dailyCheckList.map((item: any) => {
            console.log(item, 'DAILY ITEM====');

            return (
              <View style={[styles.itemContainer, CommonStyles.shadow]}>
                <Text style={styles.cardText}>
                  Unit# {item?.equipment?.unit_no}
                </Text>
                <Text style={[styles.cardText, {marginBottom: getHeight(0)}]}>
                  {moment(item?.date).format('YYYY-MM-DD') +
                    '  •  ' +
                    'Equipment Hour : ' +
                    item?.hours +
                    ' hrs'}
                </Text>
              </View>
            );
          })}
        </>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  titleTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  itemContainer: {
    width: '95%',
    minHeight: getHeight(10),
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: getHeight(45),
    padding: 12,
  },
  cardText: {
    fontSize: getHeight(55),
    fontWeight: '500',
    marginBottom: getHeight(65),
  },
  linkContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default OfflineDailyCheckList;
