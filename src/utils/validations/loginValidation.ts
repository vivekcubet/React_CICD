import * as yup from 'yup';

export default yup.object().shape({
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email address is invalid',
    )
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});
