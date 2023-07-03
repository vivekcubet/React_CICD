import * as yup from 'yup';

export default yup.object().shape({
  equipment_id: yup.string().required('Equipment is required'),
  service_no: yup.string().required('Service# is required'),
  date: yup.string().required('Date is required'),
  interval_id: yup.string().required('Interval is required'),
  technician_id: yup.string().required('Technician is required'),
  equipment_hour: yup
    .number()
    .typeError('Equipment hour must be a number')
    .min(0, 'Equipment hour must be greater than zero')
    .max(99999999, 'Equipment hour must be less than than 99999999')
    .required('Equipment hour is required'),
});
