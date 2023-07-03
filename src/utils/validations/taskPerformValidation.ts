import * as yup from 'yup';

export default yup.object().shape({
  comment: yup.string().required('Comment is required'),
  upload: yup.object().required('file is required'),
});
