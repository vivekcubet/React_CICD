import * as yup from 'yup';

export default yup.object().shape({
  name: yup.string().required('Name is required'),
  // description: yup.string().required('Description is required'),
});
