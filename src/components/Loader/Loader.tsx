import {Modal, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import LottieView from 'lottie-react-native';
import animations from '../../assets/animations';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {getWidth} from '../../theme/Constants';
interface LoaderInterface {}
const Loader: FC<LoaderInterface> = () => {
  const {isLoading} = useSelector((state: RootState) => state.globalReducer);
  return (
    <Modal statusBarTranslucent transparent={true} visible={isLoading}>
      <View style={styles.container}>
        <LottieView
          resizeMode="contain"
          autoPlay
          loop
          source={animations.loader}
          style={styles.loaderStyle}
        />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loaderStyle: {
    height: getWidth(2.5),
  },
});
