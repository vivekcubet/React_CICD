import * as yup from 'yup';

export default yup.object().shape({
  equipment_id: yup.string().required('Equipment is required'),
  repair_no: yup.string().required('Repair# is required'),
  name: yup.string().required('Repair name is required'),
  date: yup.string().required('Date is required'),
  equipment_hours: yup
    .number()
    .typeError('Equipment hour must be a number')
    .min(0, 'Equipment hour must be greater than zero')
    .max(99999999, 'Equipment hour must be less than than 99999999')
    .required('Equipment hour is required'),
});
