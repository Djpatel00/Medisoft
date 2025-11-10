import React from 'react';
import { SideBar } from "../../components/sidebar.jsx";
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControlLabel, Select, MenuItem, Radio, RadioGroup } from '@mui/material/';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { sidebar_utils, initialPatientState, initialEmpState, patientForm, patLabels, empForm, empLabels } from './utils.js';
import { apis } from '../../Services/commonServices.js';
import Autocomplete from '@mui/material/Autocomplete';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectRefresh } from '../../redux/slices/refreshSlice';

const CAutocomp = React.memo(({ index, formValues, setFormValues, options }) => {
  const isRole = index === 13;
  const label = isRole ? "Role" : "Department";
  const name = isRole ? "role" : "dep";

  return (
    <Autocomplete
      options={options || []}
      fullWidth
      getOptionLabel={(option) => option?.label || option} // customize this based on your data shape
      value={options.find(option => option === formValues[name]) || null}
      onChange={(event, newValue) => {
        setFormValues(prev => ({
          ...prev,
          [name]: newValue
        }));
      }}
      renderInput={(params) => (
        <TextField required {...params} label={label} variant="outlined" />
      )}
    />
  );
});


export default function App() {
  const referesh = useSelector(selectRefresh);

  const [patValues, setPatValues] = useState(initialPatientState);

  const handlePatChange = (event) => {
    const { name, value } = event.target;
    setPatValues({ ...patValues, [name]: value });
  };
  const fetchData = async () => {
    const data = await apis.noTokengetRequest('/member/rolesDeps/all');
    console.log(data);
    setRolesDeps(data);
  }
  useEffect(() => {
    fetchData();
  }, [referesh])
  
  const [empValues, setEmp] = useState(initialEmpState);

  const handleEmpChange = (event) => {
    const { name, value } = event.target;
    setEmp({ ...empValues, [name]: value });
  };
  const [rolesDeps, setRolesDeps] = useState([]);
  

  //----------------------------------Form Operations -------------------------------
  const clearValues = (valf) => {
    valf === 1 ? setPatValues(initialPatientState) : setEmp(initialEmpState);
  };

  const handleFormSubmit = async (event, tracker, formValues) => {
    event.preventDefault();

    alert(JSON.stringify(formValues));

    const link = '/member';

    //sending data
    const id = await apis.noTokenPostRequest(link, formValues);
    if (id) {
      alert(`Please note the id:\n ${formValues.fname}:${id.id}`);
      clearValues(tracker, setPatValues, setEmp, formValues)
    } else {
      toast.error('Error Entering Details.')
    }
  };

  // Patient and Employee Form UI
  function formCard(components, labels, handleInputChange, formValues, handleSubmit, tracker) {
    return (
      <CardContent >
        <form onSubmit={(event) => handleSubmit(event, tracker, formValues)} autoComplete="off">
          <Grid container spacing={2}>
            {components.map((fieldName, index) => (
              [13, 14].includes(index) ?
                <Grid size={{ sm: 4 }} key={fieldName}>
                  <CAutocomp
                    index={index}
                    setFormValues={setEmp}
                    formValues={formValues}
                    options={rolesDeps?.[index % 13]}
                  />

                </Grid>
                :

                index !== 4 ? <Grid size={{ sm: 4 }} key={fieldName}>
                  <TextField
                    fullWidth
                    key={fieldName}
                    name={fieldName}
                    id={fieldName}
                    label={labels[index]}
                    variant="outlined"
                    type={index === 3 ? 'date' : [5, 9].includes(index) ? 'number' : 'text'}
                    slotProps={index === 3 && { inputLabel: { shrink: true } }}
                    value={formValues[fieldName]}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                  :
                  <Grid size={{ sm: 4 }} key={fieldName}>
                    <label>{labels[index]} </label>
                    <RadioGroup name={fieldName} value={formValues[fieldName]} onChange={handleInputChange}>
                      <Grid container>
                        <Grid><FormControlLabel value="M" control={<Radio required />} label="Male" /></Grid>
                        <Grid><FormControlLabel value="F" control={<Radio required />} label="Female" /></Grid>
                      </Grid>

                    </RadioGroup>
                  </Grid>
            ))
            }
            <Grid size={{ sm: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Register {tracker === 1 ? "Patient" : "Employee"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    )
  }

  //Check Tabs 
  const [value, setValue] = useState(0);

  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <SideBar arr={sidebar_utils}>
      <Grid container justifyContent="center" spacing={2} >


        <Card className="partition" style={{ width: '85%', height: 600 }}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Register Patient" />
            <Tab label="Register Employee" />
          </Tabs>
          {value !== 1
            ? formCard(patientForm, patLabels, handlePatChange, patValues, handleFormSubmit, 1)
            : formCard(empForm, empLabels, handleEmpChange, empValues, handleFormSubmit, 2)}

        </Card>


      </Grid>
    </SideBar>

  );
}
