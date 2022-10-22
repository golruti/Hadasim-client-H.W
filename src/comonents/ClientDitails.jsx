import React, { useEffect, useState } from 'react';
import { GetClientByIdDetails, updateClient, addClient } from "../api/Api"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AdapterJalaali from '@date-io/jalaali';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import validator from 'validator'




export default function ClientDitails({ selectedClient, closeDialog, openDialog }) {
    const [clientDetails, setClientDetails] = useState(null);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const validatePhoneNumber = (number) => {
        const isValidPhoneNumber = validator.isMobilePhone(number)
        return (isValidPhoneNumber)
    }

    useEffect(() => {

        if (selectedClient != null) {
            setClientDetails(null);
            GetClientById();
        }
    }, [selectedClient]);

    useEffect(() => {
        setClientDetails(null);
    }, []);

    const GetClientById = async () => {
        var data;
        if (selectedClient.id != 0) {
            var res = await GetClientByIdDetails(selectedClient.id);
            res = res.data;
            data = res.data;
            if (res.coronaData != null)
                data.coronaData = res.coronaData;

            else
                data.coronaData = { positiveDate: null, recoverDate: null, id: 0, clientId: selectedClient.id, coronaVaccineData: [] };
            if (res.coronaVaccineData != null && res.coronaVaccineData.length > 0)
                data.coronaData.coronaVaccineData = res.coronaVaccineData;
        }
        else {
            data = { ...selectedClient, coronaData: { client: null, positiveDate: null, recoverDate: null, id: 0, clientId: selectedClient.id, coronaVaccineData: [] } }
        }
        data.toremoveCoronaVaccineData = [];
        await setClientDetails(data);
    }

    const handleChange = (event) => {
        let copyClient = { ...clientDetails }
        copyClient[event.target.id] = event.target.value;
        setClientDetails(copyClient);
    };

    const chekPhone = async (event) => {
        let copyClient = { ...clientDetails }
        if (event.target.value != null && event.target.value != "" && !validatePhoneNumber(event.target.value)) {
            window.alert("נתוני הטלפון לא תקינים ");
            copyClient[event.target.id] = null;
            await setClientDetails(copyClient);
        }
    };


    const hanfelSave = async () => {

        try {
            if (clientDetails.id == 0) {
                await addClient(clientDetails)
            }
            else
                await updateClient(clientDetails)
            closeDialog(true)
        } catch (error) {
            console.log(error);
        }
    }

    const addCoronaVaccineData = () => {
        let copyClient = { ...clientDetails }
        if (copyClient.coronaData.coronaVaccineData == null)
            copyClient.coronaData.coronaVaccineData = [{ id: 0, dateReceiptVaccination: new Date(), vaccineManufacturer: null }];
        else
            copyClient.coronaData.coronaVaccineData = [...copyClient.coronaData.coronaVaccineData,
            { id: 0, coronaDataId: copyClient.coronaData.id, dateReceiptVaccination: null, vaccineManufacturer: null }]
        setClientDetails(copyClient);
    }

    const changeDateReceiptVaccination = (newValue, row, index) => {
        let copyClient = { ...clientDetails }
        var currentData = null;
        if (row.id != 0)

            currentData = copyClient.coronaData.coronaVaccineData.find(x => x.id == row.id);
        else
            currentData = copyClient.coronaData.coronaVaccineData[index];
        if (currentData)
            currentData.dateReceiptVaccination = newValue;
        setClientDetails(copyClient);
    }

    const changeVaccineManufacturer = (event, row, index) => {
        let copyClient = { ...clientDetails }
        var currentData = null;
        if (row.id != 0)

            currentData = copyClient.coronaData.coronaVaccineData.find(x => x.id == row.id);
        else
            currentData = copyClient.coronaData.coronaVaccineData[index];
        if (currentData)
            currentData.vaccineManufacturer = event.target.value;
        setClientDetails(copyClient);
    }
    const changeDateOfBirth = (newValue) => {
        let copyClient = { ...clientDetails }
        copyClient.dateOfBirth = newValue;
        setClientDetails(copyClient);
    }

    const changeCoronaDataDate = (newValue, field) => {
        let copyClient = { ...clientDetails }
        copyClient.coronaData[field] = newValue;
        setClientDetails(copyClient);
    }

    const deleteCoronaVaccineData = (row, index) => {
        if (window.confirm("האם בטוח שברצונך למחוק את נתונים אלו?") == true) {
            let copyClient = { ...clientDetails }
            if (row.id == 0)
                copyClient.coronaData.coronaVaccineData.splice(index, 1)
            else {
                if (copyClient.toremoveCoronaVaccineData == null)
                    copyClient.toremoveCoronaVaccineData = [row.id];
                else
                    copyClient.toremoveCoronaVaccineData = [...copyClient.toremoveCoronaVaccineData, row.id];
                copyClient.coronaData.coronaVaccineData = copyClient.coronaData.coronaVaccineData.filter(x => x.id != row.id)
            }
            setClientDetails(copyClient);
        }
    }
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>

                {selectedClient != null && clientDetails != null &&
                    <Dialog
                        maxWidth="100vw"
                        fullScreen={fullScreen}
                        open={openDialog}
                        onClose={() => closeDialog(false)}
                        aria-labelledby="responsive-dialog-title"
                        style={{ direction: "rtl" }}
                        onBackdropClick={() => closeDialog(false)}
                    >
                        <form onSubmit={hanfelSave}>
                            <DialogTitle id="responsive-dialog-title">
                                {clientDetails.id == 0 && <>הוספת לקוח חדש</>}
                                {clientDetails.id != 0 && <>עדכון פרטי לקוח</>}
                            </DialogTitle>
                            <DialogContent>
                                <div style={{ width: "800px" }}>
                                    <div>
                                        <span>פרטים כללים</span>
                                    </div>
                                    <hr />
                                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "5px" }}>
                                        <FormControl>

                                            <TextField id="tz" variant="filled" label="תעודת זהות"
                                                required={true}
                                                //  error={errorsList.tz != null && errorsList.tz == true}
                                                value={clientDetails.tz} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                                onChange={handleChange} />
                                        </FormControl>
                                        <FormControl>
                                            <TextField required={true} id="firstName" variant="filled" label="שם פרטי" value={clientDetails.firstName} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                                onChange={handleChange} />
                                        </FormControl>
                                        <FormControl>

                                            <TextField required={true} id="lastName" variant="filled" label="שם משפחה" value={clientDetails.lastName} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                                onChange={handleChange} />
                                        </FormControl>

                                        <DesktopDatePicker
                                            label="תאירך לידה"
                                            inputFormat="DD/MM/YYYY"
                                            value={clientDetails.dateOfBirth}
                                            id="dateOfBirth"
                                            onChange={changeDateOfBirth}
                                            style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                            renderInput={(params) => <TextField variant="filled" {...params} />}
                                        />
                                        <TextField id="phone" onBlur={chekPhone} variant="filled" label="טלפון" value={clientDetails.phone} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                            onChange={handleChange} />
                                        <TextField id="mobilePhone" variant="filled" label="נייד" value={clientDetails.mobilePhone} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                            onChange={handleChange} onBlur={chekPhone} />
                                        <FormControl>
                                            <TextField required={true} id="city" variant="filled" label="עיר" value={clientDetails.city} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                                onChange={handleChange} />
                                        </FormControl>
                                        <TextField id="street" variant="filled" label="רחוב" value={clientDetails.street} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                            onChange={handleChange} />
                                        <TextField id="houseNumber" type={'number'} variant="filled" label="מספר בית" value={clientDetails.houseNumber} style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <span> נתוני קורונה</span>
                                    </div>
                                    <hr />
                                    <div >
                                        <div style={{ fontWeight: "bold" }}>מועדי חיסוני קורונה</div>
                                        {(clientDetails.coronaData.coronaVaccineData == null || clientDetails.coronaData.coronaVaccineData.length == 0)
                                            && <div>לא נמצאו תאריכי חיסון</div>}
                                        {clientDetails.coronaData.coronaVaccineData != null
                                            && clientDetails.coronaData.coronaVaccineData.map((row, index) => (

                                                <div style={{ display: "flex", marginBottom: "5px", flexDirection: "row", flexWrap: "wrap", gap: "5px" }} key={index}>
                                                    <span>{index + 1} :</span>
                                                    <DesktopDatePicker
                                                        label="מועד חיסון"
                                                        inputFormat="DD/MM/YYYY"
                                                        value={row.dateReceiptVaccination}
                                                        id="dateReceiptVaccination"
                                                        onChange={(newValue) => changeDateReceiptVaccination(newValue, row, index)}
                                                        style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                                        renderInput={(params) => <TextField variant="filled" {...params} />}
                                                    />
                                                    <FormControl >
                                                        <InputLabel id="demo-simple-select-label">יצרן החיסון</InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={row.vaccineManufacturer}
                                                            label="יצרן החיסון"
                                                            onChange={(event) => changeVaccineManufacturer(event, row, index)}
                                                        >
                                                            <MenuItem value={"פייזר"}>פייזר</MenuItem>
                                                            <MenuItem value={"מודרנה"}>מודרנה</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <DeleteIcon fontSize="small" onClick={() => deleteCoronaVaccineData(row, index)} />
                                                </div>


                                            ))}
                                        {(clientDetails.coronaData.coronaVaccineData == null || clientDetails.coronaData.coronaVaccineData.length < 4)
                                            && <Button onClick={addCoronaVaccineData}>
                                                הוספת מועד חיסון
                                            </Button>
                                        }
                                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "5px" }}>
                                            <DesktopDatePicker
                                                label="מועד קבלת תוצאה חיובית"
                                                inputFormat="DD/MM/YYYY"
                                                value={clientDetails.coronaData.positiveDate}
                                                id="positiveDate"
                                                onChange={(newValue) => changeCoronaDataDate(newValue, 'positiveDate')}
                                                style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                                renderInput={(params) => <TextField variant="filled" {...params} />}
                                            />
                                            <DesktopDatePicker
                                                label="מועד החלמה"
                                                inputFormat="DD/MM/YYYY"
                                                value={clientDetails.coronaData.recoverDate}
                                                id="recoverDate"
                                                o onChange={(newValue) => changeCoronaDataDate(newValue, 'recoverDate')}
                                                style={{ display: "flex", flexDirection: "column", width: "200px" }}
                                                renderInput={(params) => <TextField variant="filled" {...params} />}
                                            /></div>
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button type="submit" >
                                    שמור
                                </Button>
                                <Button onClick={() => closeDialog(false)}>
                                    סגור
                                </Button>
                            </DialogActions></form>
                    </Dialog>}
            </LocalizationProvider>
        </>
    );
}