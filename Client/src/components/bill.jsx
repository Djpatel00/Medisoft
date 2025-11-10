import React, { useState, useEffect, memo, useCallback } from 'react';
import {
  Grid2, Paper, Button, Dialog, Typography, CardContent,
  CircularProgress
} from '@mui/material';

import Checkbox from '@mui/material/Checkbox';
import { apis } from "../Services/commonServices";
import { handlePayment } from './razorPay';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({ billItem, open, setOpen, setBillItem, setBills, isPatient }) => {
  //To store the checked items, it will be reset every time.
  const [checkedItems, setCheckedItems] = useState({});
  const [Loading, setLoading] = useState(1);
  const [total, setTotal] = useState(0);

  //Closing the window
  const handleClose = () => {
    setBillItem(null);
    setCheckedItems({});
    setLoading(1);
    setOpen(false);
  };

  useEffect(() => {
    //Here if there is a bill item then we will set the keyvalue pairs of the checked items
    if (billItem) {

      const initialChecked = {};

      //Adding the categories like pharmacy and doctor so that we can track if all the chekboxes are
      //selected for these categories or not.
      Object.keys(billItem.bills).forEach(category => {
        initialChecked[category] = { checked: true };
      });

      //To get the toatal amount of bill
      let total_price = 0

      //Adding all the bill items' _ids to track if the user has selected them or not.
      Object.values(billItem.bills).flat().forEach(entry => {
        initialChecked[entry._id] = { price: entry.price, checked: true };
        total_price += entry.price;
      });

      //Setting the total
      setTotal(total_price);

      console.log("This is initial checking:", initialChecked)
      //Setting the checked items
      setCheckedItems(initialChecked);
      setLoading(0)
    }
  }, [billItem]);

  //Is to handle the checkbox change for the specific items
  const handleCheckboxChange = (id) => {

    setCheckedItems(prev => {

      console.log("Total :",total, "\nPrice: ", ((prev[id].price) * (prev[id].checked ? -1 : 1)),"\nPrev Id price:")
      //Setting the new price
      setTotal(total + ((prev[id].price) * (prev[id].checked ? -1 : 1)));

      //Toggling the value of the checkbox
      const newChecked = {
        ...prev, [id]: {
          ...prev[id],
          checked: !prev[id].checked
        }
      };

      // Find the category of this id
      let categoryOfId = null;
      for (const [category, entries] of Object.entries(billItem.bills)) {
        if (entries.some(entry => entry._id === id)) {
          categoryOfId = category;
          break;
        }
      }

      // We need to update the category checkbox if all the items are selected then 
      // We need to check the category checkbox if in unchecked
      // Else we need to uncheck the category checkbox if already checked.
      if (categoryOfId) {
        const entries = billItem.bills[categoryOfId];
        const allChecked = entries.every(entry => newChecked[entry._id].checked);
        newChecked[categoryOfId].checked = allChecked;
      }
      return newChecked;
    });

  };

  //Is used to handle the checkbox change of the category checkbox like doctor, lab, ...
  const handleCheckboxChange2 = (category) => {
    // Getting all the items in specific category
    const categoryEntries = billItem.bills[category] || [];

    // Checking if all are checked on not.
    const areAllChecked = categoryEntries.every(entry => checkedItems[entry._id].checked);

    // New variable to store the updated values. Currently taking the old values
    const newCheckedItems = { ...checkedItems };

    //This variable is used to track the amount that has to be deducted or added to the total
    let sum=0;
    // Toggle all entries in the category according to the areAllChecked variable.
    categoryEntries.forEach(entry => {
      console.log(entry.price);
      sum+=(entry.price * (newCheckedItems[entry._id].checked===!areAllChecked? 0: (!areAllChecked? 1:-1)))
      newCheckedItems[entry._id].checked = !areAllChecked;
    });

    // console.log(sum)
    setTotal(total+sum);

    // Also update the category checkbox itself
    newCheckedItems[category].checked = !areAllChecked;

    //Changing the checkedItems
    setCheckedItems(newCheckedItems);
  };

  //Is used to confirm the bill if paid or not on the reception.
  const handleConfirm = async() => {
    // console.log(billItem)

    // Preapring the selected _ids for the backend
    const selectedEntries = [];

    //Storing the updated version for later if the backend gives successfull response
    const updatedBills = {};

    for (const [category, entries] of Object.entries(billItem.bills)) {

      //Adding _id if selected or pushing it in the updatedBills
      entries.forEach(entry => {
        if (checkedItems[entry._id]) {
          if (!selectedEntries[category]) {
            selectedEntries[category] = [];
          }
          selectedEntries[category].push(entry._id);
        } else {
          if (!updatedBills[category]) {
            updatedBills[category] = [];
          }
          updatedBills[category].push(entry);
        }
      });
    }

    console.log("Selected Entries:", selectedEntries);

    //From here onwards the code will only execute if we receive the invoice number.


    setBillItem(null);

    setBills(prevBills =>
      Object.keys(updatedBills).length === 0
        ? prevBills.filter(
          group =>
            !(group.aid === billItem.aid && group.schedule_date === billItem.schedule_date)
        )
        : prevBills.map(group =>
          group.aid === billItem.aid && group.schedule_date === billItem.schedule_date
            ? {
              ...billItem,
              bills: updatedBills
            }
            : group
        )
    );

  };

  //Is used to pay bill and redirect patient to razorpay on patient screen
  const handlePay = async () => {
    console.log("Patient pay");
    const order = await apis.noTokenPostRequest('/bill/create-order', { total: total, receipt: billItem.aid });
    handlePayment(order,handleClose); 
  }

  return <Dialog
    fullScreen
    open={open}
    onClose={handleClose}
    slots={{
      transition: Transition,
    }}
  >
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar >
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <Typography sx={{ ml: 2, flex: 1 }} component="div">
          {billItem?.schedule_date}
        </Typography>

        <Typography sx={{ ml: 2, flex: 1 }} component="div">
          {billItem?.dname}
        </Typography>

        <Button
          sx={{
            height: '75%',
            px: 2,
            width: "20%",
          }}
          color="secondary"
          variant="contained"
          onClick={isPatient ? handlePay : handleConfirm}
        >
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {billItem && (isPatient ? "Pay ₹" : "Confirm ₹")} <strong>{total}</strong>
          </Typography>
        </Button>

      </Toolbar>
    </AppBar>
    {Loading ?
      <CircularProgress />
      :
      billItem ?

        Object.entries(billItem.bills).map(([category, entries]) => (
          <Grid2 container size={{ xs: 12 }} key={category} sx={{ p: 2 }}>
            <Grid2 size={{ xs: 0, sm: 1 }} />
            <Grid2 size={{ xs: 1 }} sx={{ background: 'lightgray' }}>
              <Checkbox
                checked={checkedItems[category].checked}
                onChange={() => handleCheckboxChange2(category)}
              />
            </Grid2>
            <Grid2 size={{ xs: 11, sm: 9 }} sx={{ background: 'lightgray', justifyContent: "center", display: "flex", alignItems: "center" }} >
              {category.toUpperCase()}
            </Grid2>


            <Grid2 size={{ xs: 12, sm: 10 }}>
              {entries.map((entry) => (
                <Grid2 container spacing={2} key={entry._id}>
                  <Grid2 size={{ xs: 1, sm: 2 }} />
                  <Grid2 size={{ xs: 1 }} >
                    <Checkbox
                      checked={checkedItems[entry._id].checked}
                      onChange={() => handleCheckboxChange(entry._id)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 3 }} pl={1} display="flex" alignItems="center" >{entry.date}</Grid2>
                  <Grid2 size={{ xs: 4 }} pl={1} display="flex" alignItems="center" >{entry.name}</Grid2>
                  <Grid2 size={{ xs: 3, sm: 2 }} pl={1} display="flex" alignItems="center" >₹{entry.price}</Grid2>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        ))
        : <Grid2 container size={{ xs: 12 }} sx={{ p: 2, mt: 10 }}>
          <Grid2 size={{ xs: 4 }} />
          <Grid2 size={{ xs: 4 }}>
            <Button color="secondary" fullWidth variant="contained" onClick="">Print Bill</Button>
          </Grid2>
          <Grid2 size={{ xs: 4 }} />
        </Grid2>

    }
  </Dialog>
}

const BillList = memo(({ bills, patient, onSelect }) => {
  // console.log(bills)
  return (
    <>
      <Grid2 container size={{ xs: 12 }} justifyContent="space-between">
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="h6"><strong>Patient:</strong> {patient.pname}</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="h6"><strong>Mobile:</strong> {patient.mobile}</Typography>
        </Grid2>
      </Grid2 >

      <Grid2 size={{ xs: 12 }}>
        <Divider sx={{ marginY: 2 }} />
      </Grid2>

      {bills && bills.length > 0 ? (
        bills.map((item, index) =>
          Object.keys(item.bills).length > 0 && (
            <Paper
              key={index}
              elevation={3}
              sx={{ padding: 2, marginY: 1, borderRadius: 2, width: '100%' }}
            >
              <Grid2 container size={{ xs: 12 }} spacing={1} alignItems="center">
                <Grid2 size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                  <Typography variant="body1">
                    <strong>Date:</strong> {item.schedule_date}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                  <Typography variant="body1">
                    <strong>Doctor:</strong> {item.dname}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Button
                    sx={{ width: '100%', p: 1, textAlign: 'center' }}
                    variant="contained"
                    color="primary"
                    onClick={() => onSelect(item)}
                  >
                    <Typography variant="body1">Select Bill</Typography>
                  </Button>
                </Grid2>
              </Grid2>
            </Paper>
          )
        )
      ) : (
        <Grid2 size={{ xs: 12 }} textAlign="center" mt="20vh">
          <Typography variant="h6" color="textSecondary">
            No Bills Pending
          </Typography>
        </Grid2>
      )
      }
    </>
  );
});

//bills are the bills that have to be paid
//patient variable has the details of the patient like name, mobile number
//setBills is used to change the bills if the bills are paid.
//isPatient is the variable to check if this component is accessed from the patient screen
export const BillComp = memo(({ bills, patient, setBills, isPatient }) => {

  // console.log("In BillComp")

  //this is used to control the modal to confirm the bill paid at reception or to pay the bill on patient panel
  const [open, setOpen] = useState(false);

  //this is used to select the bill of many bills when some specific bill is selected
  const [billItem, setBillItem] = useState(null);

  //set the bill item and open when the select button is clicked
  const selectBill = useCallback((bill) => {
    setBillItem(bill);
    setOpen(true);
  }, []);
  console.log(bills)
  return <>
    <CardContent>
      <BillList bills={bills} patient={patient} onSelect={selectBill} />
    </CardContent>
    <Modal billItem={billItem} open={open} setOpen={setOpen} setBillItem={setBillItem} setBills={setBills} isPatient={isPatient} />
  </>

})
