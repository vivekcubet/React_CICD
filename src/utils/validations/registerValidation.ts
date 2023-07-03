import * as yup from 'yup';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/;

export default yup.object().shape({
  name: yup.string().required('Full name is required'),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .test('is-valid-phone', 'Phone number is invalid', function (value) {
      if (!value) {
        return false;
      }
      try {
        const phoneNumber = parsePhoneNumberFromString(value);
        if (!phoneNumber || !phoneNumber.isValid()) {
          return false;
        }
        const countryCodeRegex = /^\+?([0-9]{1,3})/;
        const match = value.match(countryCodeRegex);
        if (!match) {
          return false;
        }
        const phoneNumberWithoutCountryCode = value
          .slice(match[0].length)
          .replace(/[- ]/g, '');
        return /^[0-9]+$/.test(phoneNumberWithoutCountryCode);
      } catch (err) {
        return false;
      }
    }),
  email: yup
    .string()
    .required('Email address is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email address is invalid',
    ),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      passwordRegex,
      'Password must contain at least one upper case, one lower case, one number, and one special character',
    ),
  password_confirmation: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), ''], "Confirm password doesn't match"),
  company_name: yup.string().required('Company name is required'),
});
