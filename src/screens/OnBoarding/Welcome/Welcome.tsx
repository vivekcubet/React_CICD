import {Text, ImageBackground, View, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import images from '../../../assets/images';
import styles from './styles';
import CommonStyles from '../../../theme/CommonStyles';
import SubmitButton from '../../../components/SubmitButton/SubmitButton';
import {LinkText} from '../../../components';
import screens from '../../../navigation/screens';
import {retrieveUserSession} from '../../../utils/helpers/securedStorage';
import {updateAccessToken} from '../../../redux/reducers/GlobalReducer';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../../theme/Colors';
import {RootState} from '../../../redux/store';
import useLogoutHook from '../../../Api/hooks/useLogoutHook';
const Welcome = ({navigation}: any) => {
  const logOut = useLogoutHook();
  const dispatch = useDispatch();
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
        navigation.navigate(screens.main);
      } else {
        dispatch(updateAccessToken({accessToken: session?.accessToken}));
        navigation.navigate(screens.main);
      }
    }
    console.log(session, 'TOKEN====');
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
        <View style={styles.btnContainer}>
          <SubmitButton
            isBorder={false}
            onPress={() => navigation.navigate('LOGIN')}
            label="Login"
          />
        </View>
        <LinkText
          color={Colors.white}
          onPress={() => navigation.navigate(screens.signup)}
          label="Register"
        />
      </ImageBackground>
    </>
    // </ScrollView>
  );
};

export default Welcome;
