import * as yup from 'yup';
export default yup.object().shape({
  unit_no: yup.string().required('Unit is required'),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  sl_no: yup.string().required('Serial number is required'),
});
