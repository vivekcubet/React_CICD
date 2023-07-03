/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Platform, RefreshControl} from 'react-native';
import {getHeight} from '../../theme/Constants';

const KeyboardAwareScroll = ({
  children,
  flex = 0,
  onRefreshing = null,
}: any) => {
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
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
      }
      contentContainerStyle={[{flex: flex}]}
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraHeight={getHeight(13)}
      extraScrollHeight={getHeight(13)}
      keyboardOpeningTime={Number.MAX_SAFE_INTEGER}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardAwareScroll;
