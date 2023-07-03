import * as yup from 'yup';
export default yup.object().shape({
  unit_no: yup.string().required('Unit is required'),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  sl_no: yup.string().required('Serial number is required'),
  category_id: yup.string().required('Model category is required'),
  model_id: yup.string().required('Equipment model is required'),
  template_id: yup.string().required('Equipment template is required'),
  current_hour: yup
    .number()
    .typeError('Hours must be a number')
    .min(0, 'Hours must be greater than zero')
    .max(99999999, 'Hours must be less than than 99999999')
    .required('Hours is required'),
});
