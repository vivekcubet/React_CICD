/* eslint-disable react-hooks/exhaustive-deps */
import {View, TextInput, TouchableOpacity, Text, Platform} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import Icon, {IconInterface} from '../Icon/Icon';
import {getHeight, getWidth} from '../../theme/Constants';
import Colors from '../../theme/Colors';
import CountryPicker, {
  Country,
  CountryCode,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';
interface InputTextLoginInterface {
  value?: string;
  PlaceHolder: string;
  icon?: IconInterface;
  isPassword?: boolean;
  keyboardType?: any;
  onChange?: any;
  error?: string;
  onBlur?: any;
  editable?: boolean;
  isTextArea?: boolean;
  endIcon?: IconInterface;
  isPhone?: boolean;
  isDisabled?: boolean;
  maxLength?: number;
}
const InputTextLogin: FC<InputTextLoginInterface> = ({
  PlaceHolder,
  icon,
  isPassword = false,
  onBlur,
  onChange,
  editable = true,
  value = '',
  error,
  keyboardType = 'default',
  isTextArea = false,
  endIcon,
  isPhone = false,
  maxLength,
}) => {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState<CountryCode>('IN');
  const [countryCode, setCountryCode] = useState('+91 ');
  const [inputValue, setValue] = useState(value);
  const defaultPadding = 0;
  const maxHeight = !isTextArea ? getHeight(17) : getHeight(1);
  const marginTop = Platform.OS === 'ios' ? getHeight(18) : getHeight(505);
  const [secured, setSecured] = useState(true);
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
    <View style={styles.container}>
      <View style={[{maxHeight: maxHeight}, styles.inputContainer]}>
        {icon ? (
          <View style={styles.iconContainer}>
            <Icon
              size={getHeight(43)}
              color={Colors.placeholderColor}
              iconName={icon.iconName}
              family={icon.family}
            />
          </View>
        ) : null}
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
          multiline={isTextArea}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={isPhone ? inputValue : value}
          scrollEnabled={false}
          onBlur={onBlur}
          editable={editable}
          onChangeText={text => {
            setValue(text);
            onChange(isPhone ? countryCode + text : text);
          }}
          secureTextEntry={isPassword ? secured : false}
          placeholderTextColor={Colors.placeholderColor}
          style={[
            styles.textInput,
            {
              marginTop: isTextArea ? marginTop : defaultPadding,
              marginBottom: isTextArea ? getWidth(40) : defaultPadding,
              marginLeft: icon ? defaultPadding : getWidth(40),
              marginRight: isPassword ? defaultPadding : getWidth(40),
              color: editable ? Colors.black : Colors.placeholderColor,
            },
          ]}
          placeholder={PlaceHolder}
        />
        <>
          {isPassword ? (
            <TouchableOpacity
              onPress={() => {
                setSecured(!secured);
              }}
              style={styles.iconContainer}>
              <Icon
                size={getHeight(43)}
                color={Colors.placeholderColor}
                iconName={secured ? 'eye-off' : 'eye'}
                family={'Feather'}
              />
            </TouchableOpacity>
          ) : null}
        </>
        {endIcon ? (
          <Icon
            size={getHeight(43)}
            color={Colors.placeholderColor}
            iconName={endIcon.iconName}
            family={endIcon.family}
          />
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText}>
          {isPhone && !inputValue ? 'Phone number is required' : error}
        </Text>
      ) : null}
    </View>
  );
};

export default InputTextLogin;
