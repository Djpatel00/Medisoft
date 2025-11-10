import Tabs from '@mui/material//Tabs';
import Tab from '@mui/material//Tab';
import React, { useState } from 'react';
import Grid from '@mui/material//Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import Button from '@mui/material//Button';
import { SideBar } from '../../components/sidebar';
import { side_bar } from './utils';
import { BillComp } from '../../components/bill';
import { PatientAutocomplete } from '../../components/patientAutoComp';
import { toast } from 'react-toastify';
import { apis } from '../../Services/commonServices';

export default function App() {

  //Check Tabs 
  const [value, setValue] = useState(0);

  //State 1
  // const [patient1, setPatient1] = useState(null);
  const [patient1, setPatient1] = useState({
    "mobile": "9876543210",
    "pid": "P000000B",
    "pname": "Sayan Kandoi"
  }
  );

  // const [bills1, setBills] = useState(null)
  const [bills1, setBills] = useState([
    {
      "schedule_date": "07 April 2025",
      "dname": "Ajay Parekh",
      "aid": "67eeca25f82ccb47a78da963",
      "bills": {
        "doctor": [
          {
            "_id": "67eeca25fa78da968",
            "date": "07 April 2025",
            "name": "Doctor Fees",
            "price": 700
          }
        ],
        "pharmacy": [
          {
            "_id": "6782ccb47a78da995",
            "date": "07 April 2025",
            "name": "Testing 400",
            "price": 2030,
            "id": "67eeccf8f82ccb47a78da993"
          },
          {
            "_id": "67ccb47a78da99a",
            "date": "07 April 2025",
            "name": "Testing 4 500mg",
            "price": 400,
            "id": "67ee7a78da998"
          }
        ]
      }
    },
    {
      "schedule_date": "03 April 2025",
      "dname": "Rajesh Sharma",
      "aid": "67eeca25f82ccb47a78da963",
      "bills": {
        "doctor": [
          {
            "_id": "67eeca25f82ccb47a78da968",
            "date": "03 April 2025",
            "name": "Doctor Fees",
            "price": 700
          }
        ],
        "lab": [
          {
            "_id": "67eeccf8f82ccb47a78da99e",
            "date": "03 April 2025",
            "name": "Abc",
            "price": 300,
            "id": "67eeccf8f82ccb47a78da99d"
          }
        ],
        "pharmacy": [
          {
            "_id": "67eeccf8f82ccb47a78da995",
            "date": "03 April 2025",
            "name": "Medicine 15",
            "price": 0,
            "id": "67eeccf8f82ccb47a78da993"
          },
          {
            "_id": "67eeccf8f82ccb47a78da99a",
            "date": "03 April 2025",
            "name": "Paracetamol 500mg",
            "price": 400,
            "id": "67eeccf8f82ccb47a78da998"
          }
        ]
      }
    },
  ])

  const [next1, setNext1] = useState(1);

  const handleNext = async () => {

    if (!next1 && !patient1) {
      toast.error("Please select the Patient");
      return
    }

    if (!next1) {
      const pid = patient1.pid;
      // console.log(patient1);
      try {
        const response = await apis.noTokenPostRequest(`/appointment/bill`, { pid, status: "true" });
        // console.log("Response", response);
        // console.log(response)
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bill:', error);
      }
    }
    setNext1(!next1);
  }

  return (

    <SideBar arr={side_bar} title="Bill Desk">

      <Grid justifyContent="center" container spacing={2} >
        <Card className="partition" sx={{ position: "relative", width: { xl:"50%",lg:"60%",md: "70%",sm:"80%", xs: "100%" }, height: "82vh" }}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, n) => setValue(n)}
            aria-label="disabled tabs example"
          >
            <Tab label="Pending Bills" />
            <Tab label="Done" />

          </Tabs>

          {!next1 ?

            <CardContent>

              <Grid container size={{ xs: 12 }} spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <PatientAutocomplete
                    index={1}
                    setPatient={setPatient1}
                    patient={patient1}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <PatientAutocomplete
                    index={2}
                    setPatient={setPatient1}
                    patient={patient1}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <PatientAutocomplete
                    index={3}
                    setPatient={setPatient1}
                    patient={patient1}
                  />
                </Grid>
              </Grid>

            </CardContent>
            :
            <BillComp bills={bills1} patient={patient1} setBills={setBills} isPatient={true}/>

          }
          <Grid size={{ xs: 12 }} sx={{ position: "absolute", bottom: "4px", p: 2 }}>
            <Button variant="contained" fullWidth color="primary" onClick={handleNext}
              sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {!next1 ? "Next" : "Back"}
            </Button>
          </Grid>
        </Card>
      </Grid>
    </SideBar >

  );
}
