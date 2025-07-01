import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Box, Button, Modal, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { FilterBar } from "../components/FilterBar.jsx";
import { RequestModal } from "../components/RequestModal.jsx";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { jwtDecode } from "jwt-decode";

export const LoadsBoard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    // const { token } = store
    const [loads, setLoads] = useState([]);
    const [filteredLoads, setFilteredLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("TOKEN");
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (load) => {
        setSelectedLoad(load);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLoad(null);
    };


    const handleFilterChange = ({ pickup, delivery }) => {
        const filtered = loads.filter((load) => {
            const matchesPickup = pickup ? load.pickup.toLowerCase().includes(pickup.toLowerCase()) : true;
            const matchesDelivery = delivery ? load.delivery.toLowerCase().includes(delivery.toLowerCase()) : true;
            return matchesPickup && matchesDelivery;
        });
        setFilteredLoads(filtered);
    }


    useEffect(() => {

        const loadsFetch = async () => {

            if (!token) {
                Swal.fire({
                    title: '¡Unauthorized!',
                    text: 'You are not authorized to be on this page, you will be redirected to Login',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
                navigate("/login");
                return;
            }

            let decodedToken;
            try {
                decodedToken = jwtDecode(token);
            } catch (e) {
                Swal.fire({
                    title: '¡Error!',
                    text: 'authentication error',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                localStorage.removeItem("TOKEN");
                navigate("/login");
                return;
            }

            if (decodedToken.role !== "carrier") {
                Swal.fire({
                    title: 'Access Denied',
                    text: 'Only carriers can access the Loads Board.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                localStorage.removeItem("TOKEN");
                navigate("/login");
                return;
            }

            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/loads`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    Swal.fire({
                        title: '¡Error!',
                        text: data.msg || 'Error loading loads',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }

                const data = await response.json();

                if (!data.results || !Array.isArray(data.results)) {
                    setLoads([]);
                    return;
                }

                const transformedRows = data.results.map(load => ({
                    id: load.id,
                    vehicleYear: load.vehicle_year,
                    vehicleMake: load.vehicle_make,
                    vehicleModel: load.vehicle_model,
                    pickup: load.pickup_location,
                    delivery: load.delivery_location,
                    payment: `$${load.payment}`
                }))

                setLoads(transformedRows);
                setFilteredLoads(transformedRows);
                setLoading(false);
            } catch (error) {
                console.error("Error loading loads", error);
                Swal.fire({
                    title: '¡ERROR!',
                    text: 'Error loading loads',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }

        loadsFetch();

    }, [token, navigate])

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
            renderCell: (params) =>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenModal(params.row)}
                >
                    Request
                </Button>
        }
    ];

    return (
        <Box sx={{ minHeight: '79.2vh' }}>
            <FilterBar onFilterChange={handleFilterChange} />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ margin: 'auto', display: 'inline-block' }}>
                    <DataGrid
                        rows={filteredLoads}
                        columns={columns}
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                        }}
                    />
                </Box>
            )}
            <RequestModal open={isModalOpen} onClose={handleCloseModal} load={selectedLoad} />
        </Box>
    );
};