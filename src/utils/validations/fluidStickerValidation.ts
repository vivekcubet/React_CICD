import * as yup from 'yup';

export default yup.object().shape({
  name: yup.string().required('Name is required'),
  interval: yup.string().required('Interval is required'),
});
