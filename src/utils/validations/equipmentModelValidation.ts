import * as yup from 'yup';

export default yup.object().shape({
  name: yup.string().required('Model name is required'),
  category_id: yup.string().required('Model category is required'),
  brand: yup.string().required('Brand is required'),
  model: yup.string().required('Model is required'),
});
