import {Text, View} from 'react-native';
import React, {useEffect} from 'react';
import CommonStyles from '../../../theme/CommonStyles';
import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../../theme/Colors';
import useLogin from '../../../Api/hooks/useLogin';
import {
  BackButton,
  InputTextLogin,
  LinkText,
  SubmitButton,
} from '../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {getHeight} from '../../../theme/Constants';
import {loginValidation} from '../../../utils/validations';
import screens from '../../../navigation/screens';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
const Login = ({navigation}: any) => {
  const [login, {errors: loginErrors}] = useLogin();
  const {user} = useSelector((state: RootState) => state.AuthReducer);
  const handleLogin = async (values: any) => {
    await login(values);
  };
  useEffect(() => {
    console.log(user, 'ERROR=====', loginErrors);
  }, [user, loginErrors]);
  return (
    <Formik
      initialValues={{
        // email: 'admin@example.com',
        // password: 'Admin@123',
        // email: 'v1@gmail.com',
        // password: '12345678',
        email: '',
        password: '',
      }}
      validationSchema={loginValidation}
      onSubmit={handleLogin}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={[CommonStyles.mainContainer]}>
          <SafeAreaView>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              enableOnAndroid={true}
              extraHeight={130}
              extraScrollHeight={130}
              contentContainerStyle={{minHeight: getHeight(1)}}>
              <BackButton />
              <Text
                style={[
                  CommonStyles.appNameTitle,
                  {textAlign: 'center', marginTop: getHeight(25)},
                ]}>
                Service Connections
              </Text>
              <Text style={[styles.loginTitle, CommonStyles.titleText]}>
                Let’s{'\n'}Get{' '}
                <Text style={{color: Colors.lightBlue}}>Started!</Text>
              </Text>
              <InputTextLogin
                icon={{
                  iconName: 'mail',
                  family: 'AntDesign',
                }}
                PlaceHolder="Email"
                value={values.email}
                onBlur={handleBlur('email')}
                onChange={handleChange('email')}
                error={touched.email && errors.email ? errors.email : ''}
              />
              <InputTextLogin
                icon={{
                  iconName: 'lock',
                  family: 'Feather',
                }}
                PlaceHolder="Password"
                isPassword={true}
                onBlur={handleBlur('password')}
                error={
                  touched.password && errors.password ? errors.password : ''
                }
                value={values.password}
                onChange={handleChange('password')}
                keyboardType={'default'}
              />
              <View style={styles.btnContainer}>
                <SubmitButton onPress={handleSubmit} label="Login" />
              </View>
              <View style={styles.linkContainer}>
                <LinkText
                  onPress={() => navigation.navigate(screens.forgotPassword)}
                  label="Forgot my password?"
                />
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </View>
      )}
    </Formik>
  );
};

export default Login;
