import {Text, SafeAreaView, View} from 'react-native';
import React, {useEffect} from 'react';
import CommonStyles from '../../../theme/CommonStyles';
import styles from './styles';
import {Formik} from 'formik';
import {
  BackButton,
  InputTextLogin,
  KeyboardAwareScroll,
  SubmitButton,
} from '../../../components';
import {registerValidation} from '../../../utils/validations';
import useSignUp from '../../../Api/hooks/useSignUp';
import {getHeight} from '../../../theme/Constants';
const SignUp = () => {
  const [signup, {errors: signupErrors}] = useSignUp();
  const handleRegister = async (values: any) => {
    await signup(values);
  };
  useEffect(() => {
    console.log(signupErrors);
  }, [signupErrors]);
  return (
    <Formik
      initialValues={{
        name: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
        role_id: '2',
      }}
      validationSchema={registerValidation}
      onSubmit={handleRegister}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={CommonStyles.mainContainer}>
          <SafeAreaView>
            <KeyboardAwareScroll>
              <View style={{marginTop: getHeight(55)}}>
                <BackButton />
              </View>
              <Text style={[CommonStyles.appTitle, styles.registerTitle]}>
                Register
              </Text>
              <Text style={[CommonStyles.titleText, styles.title]}>
                Service <Text style={{color: '#425e94'}}>connections</Text>
              </Text>
              <InputTextLogin
                maxLength={25}
                icon={{
                  iconName: 'user',
                  family: 'Feather',
                }}
                PlaceHolder="Full Name"
                value={values.name}
                onBlur={handleBlur('name')}
                onChange={handleChange('name')}
                error={touched.name && errors.name ? errors.name : ''}
              />
              <InputTextLogin
                maxLength={21}
                isPhone={true}
                icon={{
                  iconName: 'phone',
                  family: 'Feather',
                }}
                PlaceHolder="Phone number"
                value={values.phone_number}
                keyboardType={'number-pad'}
                onBlur={handleBlur('phone_number')}
                onChange={handleChange('phone_number')}
                error={
                  touched.phone_number && errors.phone_number
                    ? errors.phone_number
                    : ''
                }
              />
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
              <InputTextLogin
                icon={{
                  iconName: 'lock',
                  family: 'Feather',
                }}
                PlaceHolder="Confirm Password"
                isPassword={true}
                onBlur={handleBlur('password_confirmation')}
                error={
                  touched.password_confirmation && errors.password_confirmation
                    ? errors.password_confirmation
                    : ''
                }
                value={values.password_confirmation}
                onChange={handleChange('password_confirmation')}
                keyboardType={'default'}
              />
              <InputTextLogin
                maxLength={30}
                icon={{
                  iconName: 'building-o',
                  family: 'FontAwesome',
                }}
                PlaceHolder="Company name"
                value={values.company_name}
                onBlur={handleBlur('company_name')}
                onChange={handleChange('company_name')}
                error={
                  touched.company_name && errors.company_name
                    ? errors.company_name
                    : ''
                }
              />
              <SubmitButton onPress={handleSubmit} label="Register" />
              {/* <View style={styles.linkTextContainer}>
                <LinkText
                  onPress={() => navigation.navigate(screens.login)}
                  label="Login"
                />
              </View> */}
            </KeyboardAwareScroll>
          </SafeAreaView>
        </View>
      )}
    </Formik>
  );
};

export default SignUp;
