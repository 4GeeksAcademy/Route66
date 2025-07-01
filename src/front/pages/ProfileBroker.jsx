import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, CardHeader, Typography, Grid, TextField, Avatar } from '@mui/material';
import { blue } from '@mui/material/colors';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const userInitial = data.fullName ? userData.fullName.charAt(0).toUpperCase() : '';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfileBroker = () => {
    const { userId } = useParams();

    const [userData, setUserData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        role: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.error('No token available');
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/api/profile/broker`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.msg || 'Error al obtener datos del usuario');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                console.error('Error al obtener datos del usuario:', err.message);
                showSnackbar(`Error al obtener datos del usuario: ${err.message}`, 'error');
            }
        };

        fetchUserData();
    }, [userId]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No se encontró el token de autenticación.');
            showSnackbar('No se encontró el token de autenticación. Por favor, inicie sesión de nuevo.', 'error');
            return;
        }

        try {

            const response = await fetch(`${backendUrl}/api/profile/broker`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error al actualizar el perfil.');
            }

            const updatedData = await response.json();
            setUserData(updatedData);
            setIsEditing(false);
            showSnackbar('Perfil actualizado con éxito.', 'success');
        } catch (err) {
            console.error('Error al actualizar el perfil:', err.message);
            showSnackbar(`Error al actualizar el perfil: ${err.message}`, 'error');
        }
    };

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

            }}>
                <CardHeader
                    title={
                        <Typography variant="h5" sx={{ fontSize: '2rem', textAlign: 'left' }}>
                            Mi perfil
                        </Typography>
                    }
                    
                    action={ 
                        <Avatar sx={{fontSize: '2rem', bgcolor: blue[800] }}> 
                            P{/* {userInitial} */}
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
                                value={userData.fullName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Company Name"
                                variant="standard"
                                fullWidth
                                name="companyName"
                                value={userData.companyName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="E-mail"
                                variant="standard"
                                fullWidth
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Phone Number"
                                variant="standard"
                                fullWidth
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Address"
                                variant="standard"
                                fullWidth
                                name="address"
                                value={userData.address}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="City"
                                variant="standard"
                                fullWidth
                                name="city"
                                value={userData.city}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="State"
                                variant="standard"
                                fullWidth
                                name="state"
                                value={userData.state}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Zip"
                                variant="standard"
                                fullWidth
                                name="zip"
                                value={userData.zip}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Role"
                                variant="standard"
                                fullWidth
                                name="role"
                                value={userData.role}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    {!isEditing ? (
                        <Button
                            size="medium"
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsEditing(true)}
                            startIcon={<EditIcon />}
                        >
                            Edit information
                        </Button>
                    ) : (
                        <>
                            <Button size="small" onClick={handleUpdateProfile} variant="contained" color="primary">
                                Save Changes
                            </Button>
                            <Button size="small" onClick={() => {
                                setIsEditing(false);
                            }}>
                                Cancel
                            </Button>
                        </>
                    )}
                </CardActions>
            </Card>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfileBroker;