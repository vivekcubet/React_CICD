/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  Keyboard,
  // SafeAreaView,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';
// import {CountryPicker} from 'react-native-country-codes-picker';
import CountryPicker, {
  Country,
  CountryCode,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';
import Icon from '../Icon/Icon';
interface TextInputInterface {
  value?: string;
  PlaceHolder: string;
  isPassword?: boolean;
  keyboardType?: any;
  onChange?: any;
  error?: string;
  onBlur?: any;
  editable?: boolean;
  isClear?: boolean;
  isTextArea?: boolean;
  label: string;
  isPhone?: boolean;
  maxLength?: number;
}

const InputText: FC<TextInputInterface> = ({
  PlaceHolder = '',
  onBlur,
  onChange,
  editable = true,
  value = '',
  error,
  keyboardType = 'default',
  label = '',
  isTextArea = false,
  isPhone = false,
  maxLength = 250,
  isClear = false,
}) => {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState<CountryCode>('IN');
  const [countryCode, setCountryCode] = useState('+91 ');
  const [inputValue, setValue] = useState(value);
  const defaultPadding = 0;
  const maxHeight = !isTextArea ? getHeight(17) : getHeight(1);
  const minHeight = !isTextArea ? getHeight(20) : getHeight(8);
  const marginTop = Platform.OS === 'ios' ? getHeight(40) : getHeight(505);
  const width = isPhone ? getWidth(1.7) : isClear ? '88%' : '92%';
  useEffect(() => {
    if (isPhone === true && value === '' && !value) {
      onChange('+91 ');
    }
    if (isPhone && value) {
      let phoneData = extractCountryCodeAndPhoneNumber(value);
      console.log(phoneData, 'Code========');
      setCountryCode(
        phoneData?.countryCode ? phoneData?.countryCode + ' ' : '+91 ',
      );
      setValue(phoneData.phoneNumber);
    }
  }, []);

  function extractCountryCodeAndPhoneNumber(phoneNumber: string) {
    const countryCodeRegex = /^\+?([0-9]{1,3})/;
    const match = phoneNumber.match(countryCodeRegex);
    if (match) {
      const countryCode = '+' + match[1];
      const phoneNumberWithoutCountryCode = phoneNumber
        .slice(match[0].length)
        .replace(/[- ]/g, '');
      return {countryCode, phoneNumber: phoneNumberWithoutCountryCode};
    }
    return {countryCode: null, phoneNumber: phoneNumber.replace(/[- ]/g, '')};
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            {maxHeight: maxHeight, minHeight: minHeight},
            styles.dropdownContainer,
          ]}>
          {isPhone ? (
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={styles.countryCodeContainer}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: getHeight(55),
                  paddingRight: getHeight(219),
                }}>
                {countryCode}
              </Text>
              {show ? (
                <CountryPicker
                  theme={DEFAULT_THEME}
                  countryCode={country}
                  withFilter
                  withAlphaFilter
                  withCallingCode
                  visible={show}
                  // when picker button press you will get the country object with dial code
                  onSelect={(country: Country) => {
                    if (country.callingCode[0]) {
                      setCountry(country.cca2);
                      console.log('+' + country.callingCode[0], 'SELECTED');
                      setCountryCode('+' + country.callingCode[0] + ' ');
                      onChange('+' + country.callingCode[0] + ' ' + inputValue);
                    }

                    setShow(false);
                  }}
                  onClose={() => setShow(false)}
                />
              ) : null}
            </TouchableOpacity>
          ) : null}
          <TextInput
            maxLength={isPhone ? 21 : maxLength}
            editable={editable}
            multiline={isTextArea}
            scrollEnabled={false}
            onChangeText={text => {
              setValue(text);

              onChange(isPhone ? countryCode + text : text);
            }}
            value={isPhone ? inputValue : value}
            keyboardType={keyboardType}
            placeholderTextColor={Colors.placeholderColor}
            placeholder={PlaceHolder}
            onBlur={onBlur}
            style={[
              styles.text,
              {color: value ? Colors.black : Colors.placeholderColor},
              {
                width: width,
                marginTop: isTextArea ? marginTop : defaultPadding,
                marginBottom: isTextArea ? getWidth(70) : defaultPadding,
              },
            ]}
          />
          {isClear && editable && value.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                setValue('');
                onChange('');
                Keyboard.dismiss();
              }}
              style={styles.closeIconContainer}>
              <Icon
                size={getHeight(43)}
                color={Colors.placeholderColor}
                iconName={'closecircleo'}
                family={'AntDesign'}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {error ? (
          <Text
            style={{
              marginTop: getHeight(120),
              marginLeft: getHeight(60),
              fontSize: getHeight(65),
              color: Colors.errorColor,
            }}>
            {isPhone && !inputValue ? 'Phone number is required' : error}
          </Text>
        ) : null}
      </View>
    </>
  );
};

export default InputText;
