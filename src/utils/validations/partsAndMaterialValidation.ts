import * as yup from 'yup';
export default yup.object().shape({
  part_no: yup.string().required('Part id is required'),
  measurement_type_id: yup.string().required('Measurement type is required'),
  parts_category_id: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
});
