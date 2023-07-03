import * as yup from 'yup';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
export default yup.object().shape({
  // company: yup.string().required('Company is required'),
  name: yup.string().required('Name is required'),
  address: yup
    .string()
    .required('Address is required')
    .max(250, 'Address must be at most 250 characters'),
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
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email address is invalid',
    )
    .required('Email is required'),
});
