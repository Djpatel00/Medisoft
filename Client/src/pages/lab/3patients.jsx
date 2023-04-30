import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import React, { useState,useEffect } from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
 
    TablePagination,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PageLayout from './pageLayout';
import Modal from './3modal';

import Autocomplete from '@material-ui/lab/Autocomplete';
export default function App()
{

    const arr2 = ["Test Name","Normal Range","Patient Id", "Patient Name","Admit Date","Doctor ID"];
    const arr=['tname','n_range','pid','pname','createdAt','mobile','did']

   

    const fetchdata=async()=>await fetch(`http://localhost:5000/api/getlabtests`)
          .then((res) => res.json())
          .then((data) => { console.log(data); 
            setTest(data)
            })
          .catch((err) => console.error(err));

    const[test,setTest]=useState([]);
    const [dep,setDepart]=useState([]);
    useEffect(() => {
      
      setDepart( [ 'orthopedic',
      'neurologist',
      'cardiologist',
      'endocrinologist',
      'gynecologist' ]);
        fetchdata();
    },[]);

    console.log(dep);

    const [filtered,setFilter]=useState([]);
   
     const handleSearch = (newValue, property) => {
        if (newValue) {
          const t=test[value].find((e)=>e[property]===newValue);
          setFval({pid:t.pid,pname:t.pname});
          setFilter(
            test[value].filter((m) =>
              m[property].toLowerCase().includes(newValue.toLowerCase())
            )
          );
        } else {   
          setFilter([]);
          setFval({pid:'',pname:''});
        }
      };
    const [fval,setFval]=useState({pid:'',pname:''})
    const autoComp = (property, label) => (
        <Grid item xs={4}>
          <Autocomplete
            freeSolo
            options={test[value]&&test[value].map((option) => option[property])}
            onChange={(event, newValue) => handleSearch(newValue, property)}
            value={fval[property]}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Search by ${label}`}
                margin='normal'
                variant='outlined'
              />
            )}
          />
        </Grid>
      );
    
     
    //Check Tabs 
  const [value, setValue] = useState(0);
    
  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    console.log("value",value);
    setFval({pid:'',pname:''});
    setFilter([]);
  }, [value]);

  const confirmT=async(id)=>{
    await fetch(`http://localhost:5000/api/updatedetails/${id}`)
          .then((res) => res.json())
          .then((data) => { console.log(data); 
            })
          .catch((err) => console.error(err));
          fetchdata();
  }

  const resultAdd=async(id,value)=>{
    await fetch(`http://localhost:5000/api/donetest/${id}/${value}`)
    .then(res => res.json())
    .then(data =>{console.log("Updated data",data)})
    .catch(err => console.error(err));
    fetchdata();
  }
  const rowsPerPageOptions = [1, 2, 3];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const[id_,getId]=useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleOpenEditModal = (id) =>
    {
      getId(id)
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () =>
    {
        setOpenEditModal(false);
    };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    return (

        <PageLayout>
            <Card className="partition">
        <Grid container spacing={2}>
                <Grid item xs={12}>
                <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Take Patient Details" />
              <Tab label="Add Test Results" />
              <Tab label="Done" />
            </Tabs>
                <CardContent>
                
                    <Grid container spacing={2}>
                        {autoComp('pname', 'Patient Name')}
                        {autoComp('pid', 'Patient ID')}
                        <Grid item xs={12}>
                     

                            <TableContainer >
                            <Table size="small">
                                <TableHead  style={{ backgroundColor: '#1F3F49' }}>
                                    <TableRow>
                                      {arr2.map(e=>(
                                        <TableCell>
                                          {e}
                                        </TableCell>
                                      ))
                                        }
                                      
                                       {value!==2 && <TableCell>Action</TableCell>}
                                       {value===2 && <TableCell>Patient Result</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {test[value] &&(filtered.length?filtered:test[value]).map((e,index)=> (
                                      <TableRow>
                                        <TableCell>{e.tname}</TableCell>
                                          <TableCell>{e.n_range} </TableCell>
                                          <TableCell>{e.pid} </TableCell>
                                          <TableCell>{e.pname}</TableCell>
                                          <TableCell>{(new Date(e.createdAt)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                          
                                          <TableCell>{e.did}</TableCell>
                                        <TableCell>
                                          {value===0&&<Button onClick={()=>confirmT(e._id)} variant="contained" color="primary">
                                            Confirm
                                          </Button>}
                                          {
                                            value===1&&<Button onClick={() => handleOpenEditModal(e._id)} variant="contained" color="primary">
                                            Add Results
                                          </Button>
                                          }
                                          {value===2 && e.p_range}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Modal
                                        open={openEditModal}
                                        id={id_}
                                        handleClose={handleCloseEditModal}
                                        handleEdit={resultAdd}
                                     
                                    />
                            <TablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={test[value]&& test[value].length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            </TableContainer>

                        </Grid>
                    </Grid>
                    </CardContent>
                    <CardContent>
                    
                
                </CardContent>
                </Grid>
        </Grid>
        </Card>
      </PageLayout>
    
    );
}
