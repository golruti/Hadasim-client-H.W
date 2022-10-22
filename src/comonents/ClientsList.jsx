import React, { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetClients, DeleteClient } from "../api/Api"
import ClientDitails from './ClientDitails';

export default function ClientsList() {
    const [clientDataList, setClientDataList] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);
    const selectRow = (row) => {
        setSelectedClient(row);
    }

    useEffect(() => {
        GetClientsList();
    }, []);

    const GetClientsList = async () => {
        var res = await GetClients();
        setClientDataList(res.data);
    }

    const closeDialog = (isUpdate) => {
            GetClientsList();
        setSelectedClient(null);
    }

    const addClient = () => {
        setSelectedClient({ id: 0, tz: null, firstName: null, lastName: null });
    }

    const deleteClient = async (e, row) => {
        e.stopPropagation()
        if (window.confirm("האם בטוח שברצונך למחוק את נתונים אלו?") == true) {
            var res = await DeleteClient(row.id);
            GetClientsList();
        }
    }

    return (
        <>
            <Button onClick={addClient}>
                הוסף לקוח חדש
            </Button>
            <div style={{textAlign:"center"}}>רשימת חברי הקופה</div>
            <div style={{ margin: "auto", width: "75%", direction: "rtl" }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">תעודת זהות</TableCell>
                                <TableCell align="right">שם פרטי</TableCell>
                                <TableCell align="right">שם משפחה</TableCell>
                                <TableCell align="right"> </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientDataList.map((row) => (
                                <TableRow hover
                                    onClick={() => selectRow(row)}
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="right" component="th" scope="row">
                                        {row.tz}
                                    </TableCell>
                                    <TableCell align="right">{row.firstName}</TableCell>
                                    <TableCell align="right">{row.lastName}</TableCell>
                                    <TableCell align="right" onClick={(e) => { e.stopPropagation(); }}>  <DeleteIcon fontSize="small" onClick={(e) => deleteClient(e, row)} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {setSelectedClient != null && <ClientDitails selectedClient={selectedClient} closeDialog={closeDialog} openDialog={true} ></ClientDitails>}
        </>
    );
}