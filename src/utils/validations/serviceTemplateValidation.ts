import * as yup from 'yup';

export default yup.object().shape({
  model_id: yup.string().required('Model is required'),
  name: yup.string().required('Name is required'),
});
