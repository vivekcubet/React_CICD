import {View, Text} from 'react-native';
import React from 'react';
import CommonStyles from '../../theme/CommonStyles';
import Colors from '../../theme/Colors';
import DailyCheckList from './OfflineDailyCheckList';
import {KeyboardAwareScroll} from '../../components';
import OfflineRepairList from './OfflineRepairList';
import OfflineServiceList from './OfflineServiceList';

const OfflineSync = () => {
  return (
    <View
      style={[{backgroundColor: Colors.white}, CommonStyles.containerFlex1]}>
      <KeyboardAwareScroll>
        <View style={CommonStyles.mainContainer}>
          <Text style={CommonStyles.font45bold}>UnSynced Data</Text>
          <DailyCheckList />
          <OfflineRepairList />
          <OfflineServiceList />
        </View>
      </KeyboardAwareScroll>
    </View>
  );
};

export default OfflineSync;
