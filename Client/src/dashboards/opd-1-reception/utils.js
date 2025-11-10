export const sidebar_utils = [
  { label: 'Registration', path: '/registermember', icon: 'AddBox' },
  { label: 'Appointments', path: '/bookappointment', icon: 'TableChart' },
  // {label:'Patients',path:'/testpatients',icon:'AccountBox'},
]

//Values for the patient form.
export const patientForm = ['fname', 'middlename', 'lname', 'dob', 'gender', 'mobile', 'email', 'address', 'city', 'pincode', 'allergy', 'conditions', 'others'];

//Labels for the patient form.
export const patLabels = ["First Name", "Middle name", "Last Name", "Birth date", "Gender", "Mobile", "Email", "Address", "City ", "Pincode", "allergy", "conditions", "Others"];

//values for Employee form.
export const empLabels = ["First Name", "Middle name", "Last Name", "Birth date", "Gender", "Mobile", "Email", "Address", "City ", "Pincode", "Degree Name", "College Name", "Certificate"];

//values for Employee form.
export const empForm = ['fname', 'middlename', 'lname', 'dob', 'gender', 'mobile', 'email', 'address', 'city', 'pincode', 'degree', 'college', 'certificate', 'dep','role'];

export const initialPatientState = patientForm.reduce((obj, key) => {
  let defaultValue = '';

  // Assign 'none' to specific fields
  if (['allergy', 'conditions', 'others'].includes(key)) {
    defaultValue = 'none';
  }
  obj[key] = defaultValue;
  return obj;
}, {
  type: 'patient' // Extra field not in patientForm
});
export const initialEmpState = empForm.reduce((obj, key) => {
  let defaultValue = '';
  obj[key] = defaultValue;
  return obj;
}, {
  type: 'employee' // Extra field not in Employee
});


