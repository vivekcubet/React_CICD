import * as yup from 'yup';

export default yup.object().shape({
  model_id: yup.string().required('Model is required'),
  interval_id: yup.string().required('Interval is required'),
  name: yup.string().required('Task name is required'),
});
