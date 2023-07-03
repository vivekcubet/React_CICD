import * as yup from 'yup';

export default yup.object().shape({
  hours: yup
    .number()
    .typeError('Equipment hour must be a number')
    .min(0, 'Equipment hour must be greater than zero')
    .max(99999999, 'Equipment hour must be less than than 99999999')
    .required('Equipment hour is required'),
  comment: yup.string().required('Comment is required'),
});
