import * as yup from 'yup';

export default yup.object().shape({
  part_id: yup.string().required('Part is required'),
  quantity: yup.string().required('Quantity is required'),
});
