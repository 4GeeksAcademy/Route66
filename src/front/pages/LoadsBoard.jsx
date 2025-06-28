import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Box, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { Header } from "../components/Header.jsx";
import logoImg from "../assets/img/Route66logo.png"
import { FilterBar } from "../components/FilterBar.jsx";

export const LoadsBoard = () => {

    // const { store, dispatch } = useGlobalReducer()


    const imageStyle = {
        height: '180px',
        width: '200px',
        objectFit: 'contain',
        position: 'relative',
        bottom: '-20px',
    }

    const titleStyle = {
        color: '#1C355E',
        fontWeight: 700,
        fontSize: '5rem'
    }

    const containerStyle = {
        px: 4,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        borderBottom: '1px solid #ddd',
        height: "120px"
    }

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

    // }, [])

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Header containerStyle={containerStyle} title="Loads Board" titleStyle={titleStyle} imgStyle={imageStyle} imgUrl={logoImg} imgAlt="Route66 logo" />
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