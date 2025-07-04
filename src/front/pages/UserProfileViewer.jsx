import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Grid,
    TextField,
    Avatar,
    FormControlLabel,
    Checkbox,
    CircularProgress,
} from '@mui/material';
import { blue } from '@mui/material/colors';

// @param { string }
// @param { number }
// @returns { Promise < object >}

async function fetchUserProfileById(jwtToken, userIdToConsult) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const url = `${backendUrl}/profile/${userIdToConsult}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`Perfil del usuario ${userIdToConsult} obtenido con éxito:`, data);
            return data;
        } else {
            console.error(`Error al obtener el perfil del usuario ${userIdToConsult}:`, data.msg || "Error desconocido");
            throw new Error(data.msg || "Error al obtener el perfil.");
        }
    } catch (error) {
        console.error("Error de red o en la solicitud fetch:", error);
        throw error;
    }
}


function UserProfileViewer() {

    const { userId } = useParams();
    const userIdToConsult = parseInt(userId, 10);

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    
    // const getJwtToken = useCallback(() => {
        
    //     return localStorage.getItem('jwt_token');
    // }, []);

    
    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            setError(null);
            setUserData(null); 

            const jwtToken = getJwtToken();

            if (!jwtToken) {
                setError("No se encontró el token JWT. Por favor, inicie sesión.");
                setLoading(false);
                return;
            }

            if (isNaN(userIdToConsult)) {
                setError("ID de usuario inválido en la URL.");
                setLoading(false);
                return;
            }

            try {
                const profile = await fetchUserProfileById(jwtToken, userIdToConsult);
                setUserData(profile);
            } catch (err) {
                setError(err.message || "Error al cargar el perfil.");
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [userIdToConsult, getJwtToken]);

    
    const userInitial = userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : '';

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Cargando perfil...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>No se encontró el perfil del usuario.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            padding: 4,
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <Card sx={{
                minWidth: 275,
                maxWidth: 800,
                width: '90%',
                boxShadow: 3,
                borderRadius: '12px' // Añadir bordes redondeados
            }}>
                <CardHeader
                    title={
                        <Typography variant="h5" sx={{ fontSize: '2rem', textAlign: 'left' }}>
                            Perfil de {userData.fullName} ({userData.role.charAt(0).toUpperCase() + userData.role.slice(1)})
                        </Typography>
                    }
                    action={
                        <Avatar sx={{ fontSize: '2rem', bgcolor: blue[800] }}>
                            {userInitial}
                        </Avatar>
                    }
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Full Name"
                                variant="standard"
                                fullWidth
                                name="fullName"
                                value={userData.fullName || ''}
                                InputProps={{ readOnly: true }} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Company Name"
                                variant="standard"
                                fullWidth
                                name="companyName"
                                value={userData.companyName || ''}
                                InputProps={{ readOnly: true }} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="E-mail"
                                variant="standard"
                                fullWidth
                                name="email"
                                value={userData.email || ''}
                                InputProps={{ readOnly: true }} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Phone Number"
                                variant="standard"
                                fullWidth
                                name="phoneNumber"
                                value={userData.phoneNumber || ''}
                                InputProps={{ readOnly: true }} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Address"
                                variant="standard"
                                fullWidth
                                name="address"
                                value={userData.address || ''}
                                InputProps={{ readOnly: true }} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="City"
                                variant="standard"
                                fullWidth
                                name="city"
                                value={userData.city || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="State"
                                variant="standard"
                                fullWidth
                                name="state"
                                value={userData.state || ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Zip"
                                variant="standard"
                                fullWidth
                                name="zip"
                                value={userData.zip || ''}
                                InputProps={{ readOnly: true }} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Role"
                                variant="standard"
                                fullWidth
                                name="role"
                                value={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                                InputProps={{ readOnly: true }} 
                            />
                        </Grid>

                        
                        {userData.role === 'carrier' && (
                            <>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        label="USDOT Number"
                                        variant="standard"
                                        fullWidth
                                        name="usdotNumber"
                                        value={userData.usdotNumber || ''}
                                        InputProps={{ readOnly: true }} 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        label="Number of Trucks"
                                        variant="standard"
                                        fullWidth
                                        name="numberOfTrucks"
                                        type="number"
                                        value={userData.numberOfTrucks || ''}
                                        InputProps={{ readOnly: true }} 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        label="Type of Transport"
                                        variant="standard"
                                        fullWidth
                                        name="typeOfTransport"
                                        value={userData.typeOfTransport || ''}
                                        InputProps={{ readOnly: true }} 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={userData.isOpen || false}
                                                name="isOpen"
                                                color="primary"
                                                disabled={true} 
                                            />
                                        }
                                        label="Open"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={userData.isEnclose || false}
                                                name="isEnclose"
                                                color="primary"
                                                disabled={true}
                                            />
                                        }
                                        label="Enclose"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={userData.isBoth || false}
                                                name="isBoth"
                                                color="primary"
                                                disabled={true} 
                                            />
                                        }
                                        label="Both"
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>

            </Card>

        </Box>
    );
}

export default UserProfileViewer;