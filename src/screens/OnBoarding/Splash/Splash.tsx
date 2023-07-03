import {Text, ImageBackground, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import images from '../../../assets/images';
import styles from '../Welcome/styles';
import CommonStyles from '../../../theme/CommonStyles';
import screens from '../../../navigation/screens';
import {retrieveUserSession} from '../../../utils/helpers/securedStorage';
import {updateAccessToken} from '../../../redux/reducers/GlobalReducer';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../../theme/Colors';
import useLogoutHook from '../../../Api/hooks/useLogoutHook';
import {RootState} from '../../../redux/store';

const Splash = ({navigation}: any) => {
  const dispatch = useDispatch();
  const logOut = useLogoutHook();
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  useEffect(() => {
    handleLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleLogin = async () => {
    let session = await retrieveUserSession();
    if (session?.accessToken) {
      if (!roleType) {
        logOut();
        setTimeout(() => {
          navigation.replace(screens.onBoarding);
        }, 1500);
      } else {
        dispatch(updateAccessToken({accessToken: session?.accessToken}));
        setTimeout(() => {
          navigation.replace(screens.main);
        }, 500);
      }
    } else {
      setTimeout(() => {
        navigation.replace(screens.onBoarding);
      }, 1500);
    }
  };
  return (
    // <ScrollView>
    <>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <ImageBackground
        source={images.welcome_bg}
        resizeMode="stretch"
        style={[CommonStyles.mainContainer, styles.welcomeContainer]}>
        {/* <Image
          resizeMode="stretch"
          style={styles.imageStyle}
          source={images.welcome_img}
        /> */}
        <Text style={[CommonStyles.appTitle, {color: Colors.white}]}>
          Service Connections
        </Text>
        <Text style={[CommonStyles.subTitle, {color: Colors.white}]}>
          Connect with your equipment.
        </Text>
      </ImageBackground>
    </>
    // </ScrollView>
  );
};

export default Splash;
