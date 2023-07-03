import * as yup from 'yup';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/;

export default yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .matches(
      passwordRegex,
      'Password must contain at least one upper case, one lower case, one number, and one one special character',
    ),
  password_confirmation: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), ''], "Confirm password doesn't match"),
});
