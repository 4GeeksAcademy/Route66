import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Box, Button, Modal, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { FilterBar } from "../components/FilterBar.jsx";
import { RequestsBoardModal } from "../components/RequestsBoardModal.jsx";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { jwtDecode } from "jwt-decode";
import { useOutletContext } from "react-router-dom";

export const BrokerLoadsBoard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    // const { token } = store
    const { loads, setLoads } = useOutletContext();
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

    const handleDeleteLoad = async (load) => {

        if (!token) {
            Swal.fire({
                title: '¡No autorizado!',
                text: 'Sign in to continue',
                icon: 'warning',
                confirmButtonText: 'Accept'
            });
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/deleteload/${load.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();
            console.log(data);
            
            if (!response.ok) {
                throw new Error(data.msg || 'Error deleting load');
            }

            setFilteredLoads((prev) => prev.filter((load) => load.id !== data.load.id))

            Swal.fire({
                title: '¡Successful!',
                text: data.msg,
                icon: 'success',
                confirmButtonText: 'Accept'
            });

        } catch (error) {
            console.error("Error loading loads", error);
            Swal.fire({
                title: '¡ERROR!',
                text: 'Error deleting load',
                icon: 'error',
                confirmButtonText: 'Accept'
            });
        }
    }


    const handleFilterChange = ({ pickup, delivery }) => {
        const filtered = loads.filter((load) => {
            const matchesPickup = pickup ? load.pickup.toLowerCase().includes(pickup.toLowerCase()) : true;
            const matchesDelivery = delivery ? load.delivery.toLowerCase().includes(delivery.toLowerCase()) : true;
            return matchesPickup && matchesDelivery;
        });
        setFilteredLoads(filtered);
    }

    useEffect(() => {
        setFilteredLoads(loads);
    }, [loads]);

    useEffect(() => {

        const loadsFetch = async () => {

            if (!token) {
                Swal.fire({
                    title: '¡Unauthorized!',
                    text: 'You are not authorized to be on this page, you will be redirected to Login',
                    icon: 'warning',
                    confirmButtonText: 'Accept'
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
                    confirmButtonText: 'Accept'
                });
                localStorage.removeItem("TOKEN");
                navigate("/login");
                return;
            }

            if (decodedToken.role !== "broker") {
                Swal.fire({
                    title: 'Access Denied',
                    text: 'Only carriers can access the Loads Board.',
                    icon: 'error',
                    confirmButtonText: 'Accept'
                });
                localStorage.removeItem("TOKEN");
                navigate("/login");
                return;
            }

            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/brokerloads`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Error loading loads');
                }

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
                    payment: `$${load.payment}`,
                    load_requests: load.load_requests || [],
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
                    confirmButtonText: 'Accept'
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
            width: 340,
            renderCell: (params) =>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteLoad(params.row)}
                    >
                        Delete Load
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOpenModal(params.row)}
                    >
                        See Requests
                    </Button>
                </Box>
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
            <RequestsBoardModal open={isModalOpen} onClose={handleCloseModal} load={selectedLoad} />
        </Box>
    );
};