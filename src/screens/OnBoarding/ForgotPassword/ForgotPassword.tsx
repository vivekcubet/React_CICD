import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../../theme/CommonStyles';
import {
  BackButton,
  InputTextLogin,
  KeyboardAwareScroll,
  LinkText,
  SubmitButton,
} from '../../../components';
import {getHeight} from '../../../theme/Constants';
import {Formik} from 'formik';
import {forgotValidation} from '../../../utils/validations';
import OTPTextView from 'react-native-otp-textinput';
import Colors from '../../../theme/Colors';
import styles from './styles';
import {useSendOtp, useVerifyOtp} from '../../../Api/hooks';
import {useToast} from 'react-native-toast-notifications';
import screens from '../../../navigation/screens';
const ForgotPassword = ({navigation}: any) => {
  const [isSend, setSend] = useState(false);
  const toast = useToast();
  const [sendOtp, {errors: sendOTPErrors}] = useSendOtp();
  const [verifyOtp, {errors: verifyOTPErrors}] = useVerifyOtp();

  useEffect(() => {}, [sendOTPErrors, verifyOTPErrors]);
  const sendOtpToMail = async (values: any) => {
    console.log('Values====', values);
    toast.hideAll();
    if (!isSend) {
      let otpResponse = await sendOtp(values);
      if (otpResponse) {
        setSend(true);
      }
    } else {
      if (values.otp.length < 6) {
        toast.show('Enter valid otp');
        return;
      }

      let verifyResponse = await verifyOtp(values);
      if (verifyResponse) {
        console.log(verifyResponse, 'VerifyResponse');
        navigation.replace(screens.resetPassword, {
          email: values.email,
          token: verifyResponse.token,
        });
      }
    }
  };
  return (
    <View style={CommonStyles.mainContainer}>
      <KeyboardAwareScroll>
        <SafeAreaView>
          <View style={{marginTop: getHeight(55)}}>
            <BackButton />
          </View>
          <Formik
            initialValues={{
              email: '',
              otp: '',
            }}
            validationSchema={forgotValidation}
            onSubmit={sendOtpToMail}>
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
                  Forgot {'\n'}Password?
                </Text>
                <View style={{marginBottom: getHeight(45)}}>
                  <InputTextLogin
                    editable={!isSend}
                    icon={{
                      iconName: 'mail',
                      family: 'AntDesign',
                    }}
                    PlaceHolder={isSend ? values.email : 'Email'}
                    value={isSend ? '' : values.email}
                    onBlur={handleBlur('email')}
                    onChange={handleChange('email')}
                    error={touched.email && errors.email ? errors.email : ''}
                  />
                  {isSend ? (
                    <View style={{alignItems: 'flex-end'}}>
                      <LinkText
                        onPress={() => setSend(false)}
                        label="Change e-mail"
                      />
                    </View>
                  ) : null}
                </View>

                {!isSend ? (
                  <SubmitButton onPress={handleSubmit} label="Send OTP" />
                ) : (
                  <>
                    <Text
                      style={{color: Colors.black, fontSize: getHeight(50)}}>
                      OTP
                    </Text>
                    <OTPTextView
                      handleTextChange={handleChange('otp')}
                      containerStyle={styles.otpInputBox}
                      textInputStyle={styles.otpInput}
                      inputCount={6}
                      inputCellLength={1}
                      tintColor={Colors.lightBlue}
                      offTintColor={Colors.borderGray}
                      autoFocus={true}
                    />
                    <SubmitButton onPress={handleSubmit} label="Verify OTP" />
                  </>
                )}
              </>
            )}
          </Formik>
        </SafeAreaView>
      </KeyboardAwareScroll>
    </View>
  );
};

export default ForgotPassword;
