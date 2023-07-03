import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import CommonStyles from '../../../theme/CommonStyles';
import {
  BackButton,
  InputTextLogin,
  KeyboardAwareScroll,
  SubmitButton,
} from '../../../components';
import {getHeight} from '../../../theme/Constants';
import {Formik} from 'formik';
import {
  forgotResetValidation,
  resetValidation,
} from '../../../utils/validations';
import usePostApi from '../../../Api/hooks/usePostApi';
import screens from '../../../navigation/screens';
import {END_POINTS} from '../../../Api/constants';
import {useToast} from 'react-native-toast-notifications';
const ResetPassword = ({route, navigation}: any) => {
  const toast = useToast();
  const {
    email = '',
    isFromLogin = false,
    token = '',
    current_password = '',
  } = route?.params;
  const [postApi, {error}] = usePostApi();
  useEffect(() => {
    console.log('RESET_ERROR====', error);
  }, [error]);
  const resetPassword = async (values: any) => {
    if (!isFromLogin) {
      values.token = token;
      delete values?.current_password;
    }
    let resetResponse = await postApi({
      endPoint: isFromLogin
        ? END_POINTS.INITIAL_RESET_PWD
        : END_POINTS.FORGOT_RESET_OTP,
      params: values,
    });
    if (resetResponse) {
      toast.show(resetResponse.message);
      if (isFromLogin) {
        navigation.replace(screens.main);
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: screens.welcome}, {name: screens.login}],
        });
      }
    }
  };
  return (
    <View style={CommonStyles.mainContainer}>
      <KeyboardAwareScroll>
        <SafeAreaView>
          <View style={{marginTop: getHeight(55)}}>
            <BackButton onPress={() => navigation.replace(screens.main)} />
          </View>
          <Formik
            initialValues={{
              email: email,
              password: '',
              password_confirmation: '',
              current_password: current_password ? current_password : '',
            }}
            validationSchema={
              isFromLogin ? resetValidation : forgotResetValidation
            }
            onSubmit={resetPassword}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Text
                  style={[
                    {marginTop: getHeight(10)},
                    CommonStyles.titleText,
                    {fontSize: getHeight(25), marginBottom: getHeight(15)},
                  ]}>
                  Reset {'\n'}Password
                </Text>
                <View style={{marginBottom: getHeight(45)}}>
                  {isFromLogin && !current_password ? (
                    <InputTextLogin
                      icon={{
                        iconName: 'lock',
                        family: 'Feather',
                      }}
                      PlaceHolder="Current Password"
                      isPassword={true}
                      onBlur={handleBlur('current_password')}
                      error={
                        touched.current_password && errors.current_password
                          ? errors.current_password.toString()
                          : ''
                      }
                      value={values.current_password}
                      onChange={handleChange('current_password')}
                      keyboardType={'default'}
                    />
                  ) : null}
                  <InputTextLogin
                    icon={{
                      iconName: 'lock',
                      family: 'Feather',
                    }}
                    PlaceHolder="New Password"
                    isPassword={true}
                    onBlur={handleBlur('password')}
                    error={
                      touched.password && errors.password ? errors.password : ''
                    }
                    value={values.password}
                    onChange={handleChange('password')}
                    keyboardType={'default'}
                  />
                  <InputTextLogin
                    icon={{
                      iconName: 'lock',
                      family: 'Feather',
                    }}
                    PlaceHolder="Confirm Password"
                    isPassword={true}
                    onBlur={handleBlur('password_confirmation')}
                    error={
                      touched.password_confirmation &&
                      errors.password_confirmation
                        ? errors.password_confirmation
                        : ''
                    }
                    value={values.password_confirmation}
                    onChange={handleChange('password_confirmation')}
                    keyboardType={'default'}
                  />
                </View>
                <SubmitButton onPress={handleSubmit} label="Reset" />
              </>
            )}
          </Formik>
        </SafeAreaView>
      </KeyboardAwareScroll>
    </View>
  );
};

export default ResetPassword;
