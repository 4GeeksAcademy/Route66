import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Box, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { FilterBar } from "../components/FilterBar.jsx";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export const LoadsBoard = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    // const { token } = store
    const [loads, setLoads] = useState()
    const token = localStorage.getItem("TOKEN")

    useEffect(() => {

        if (!token) {
            Swal.fire({
                title: '¡Unauthorized!',
                text: 'You are not authorized to be on this page, you will be redirected to Login',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            navigate("/login")
            return
        }


        const loadsFetch = async () => {

        }




    }, [])



    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'vehicleYear', headerName: 'Vehicle year', width: 150 },
        { field: 'vehicleMake', headerName: 'Vehicle make', width: 150 },
        { field: 'vehicleModel', headerName: 'Vehicle model', width: 150 },
        { field: 'pickup', headerName: 'Pickup', width: 150 },
        { field: 'delivery', headerName: 'Delivery', width: 150 },
        { field: 'payment', headerName: 'Payment ($)', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 170,
            renderCell: () => <Button variant="contained" color="error">Request</Button>
        }
    ];

    const rows = [
        { id: 101, vehicleYear: '2025', vehicleMake: 'information', vehicleModel: 'Wagon', pickup: 'Chicago, IL', delivery: 'Phoenix, AZ', payment: 1500 },
        { id: 101, vehicleYear: '2025', vehicleMake: 'information', vehicleModel: 'Wagon', pickup: 'Chicago, IL', delivery: 'Phoenix, AZ', payment: 1500 },
        { id: 101, vehicleYear: '2025', vehicleMake: 'information', vehicleModel: 'Wagon', pickup: 'Chicago, IL', delivery: 'Phoenix, AZ', payment: 1500 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
        { id: 102, vehicleYear: '2024', vehicleMake: 'information', vehicleModel: 'Pickup Truck', pickup: 'Dallas, TX', delivery: 'Miami, FL', payment: 1200 },
    ];


    // useEffect(() => {
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MTE1NzU1NCwianRpIjoiMmMzYmRlNTctZmJmYy00NTY4LTg0MDgtNjk2N2I0NTM3YzNiIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYiLCJuYmYiOjE3NTExNTc1NTQsImNzcmYiOiJjMGExYWYzNC02YTljLTQ0MmYtYWQ0Yi01YjQxMDA0MjA1ZjciLCJleHAiOjE3NTExNTg0NTQsInJvbGUiOiJicm9rZXIifQ.aEcjbK45a5ubiYZ2n8l35jHuhL3UDIqwtCtjciZhriw"
    //         {
    //     "vehicle_year": "2025",
    //     "vehicle_make": "Toyoca",
    //     "vehicle_model": "Corolla",
    //     "pickup_location": "Chicago, IL",
    //     "delivery_location": "Phoenix, AZ",
    //     "payment": "1500",
    //     "days_to_deliver": "2"
    // }
    // }, [])

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <FilterBar />
            <Box sx={{ margin: 'auto', display: 'inline-block' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                    }}
                />
            </Box>
        </Box>
    );
};