import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el ID del usuario de la URL
// Eliminamos Snackbar y MuiAlert ya que no hay funcionalidad de edición/mensajes
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// Eliminamos EditIcon y Button de CardActions ya que no hay edición
// import EditIcon from '@mui/icons-material/Edit';
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
    // Eliminamos Button y CardActions si no se usan para otros propósitos
    // Button,
    // CardActions
} from '@mui/material';
import { blue } from '@mui/material/colors';

// El componente Alert ya no es necesario si eliminamos Snackbar
// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

/**
 * Realiza una solicitud GET para obtener el perfil de un usuario específico por su ID.
 * Este fetch coincide con el endpoint Flask: GET /profile/<user_id>
 *
 * @param {string} jwtToken El token JWT del usuario autenticado que realiza la solicitud.
 * @param {number} userIdToConsult El ID del usuario cuyo perfil se desea obtener.
 * @returns {Promise<object>} Una promesa que resuelve con los datos del perfil del usuario si la solicitud es exitosa,
 * o rechaza con un objeto de error si hay un problema.
 */
async function fetchUserProfileById(jwtToken, userIdToConsult) {
    // IMPORTANTE: Ajusta esta URL base para que coincida con la dirección de tu backend Flask.
    // En un entorno de desarrollo local, podría ser "http://localhost:5000".
    // En Codespaces, podría ser la URL pública del puerto de tu backend (ej. "https://your-codespace-name-5000.app.github.dev").
    // Se recomienda usar una variable de entorno para esto.
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; 

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

// -----------------------------------------------------------------------------
// COMPONENTE REACT: UserProfileViewer (Solo Lectura)
// -----------------------------------------------------------------------------

function UserProfileViewer() {
    // Obtener el ID del usuario de los parámetros de la URL (ej. /profile/123)
    const { userId } = useParams(); 
    const userIdToConsult = parseInt(userId, 10); // Convertir a número entero

    // Estados para la gestión de datos, carga y errores
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Eliminamos el estado isEditing ya que el perfil será solo lectura
    // const [isEditing, setIsEditing] = useState(false); 
    // Eliminamos los estados de Snackbar ya que no hay mensajes de edición
    // const [snackbarOpen, setSnackbarOpen] = useState(false);
    // const [snackbarMessage, setSnackbarMessage] = useState('');
    // const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Función para obtener el token JWT (simulación, en una app real vendría de un un contexto/localStorage)
    const getJwtToken = useCallback(() => {
        // En una aplicación real, esto se obtendría de forma segura, por ejemplo:
        // return localStorage.getItem('jwt_token');
        // Para pruebas, puedes usar un token de ejemplo:
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3ODkwNTYwNywianRpIjoiZmVkMjA2OWEtYTEwNS00Mzk5LThjMjItOTYwZGM2NjgwMjEwIiwibmJmIjoxNjc4OTA1NjA3LCJzdWIiOjEsInR5cGUiOiJhY2Nlc3MiLCJleHAiOjE2Nzg5MDY1MDcsInJvbGUiOiJicm9rZXIifQ.ejmK9bL6-bB8-F6_2h-1q5Y-Y5j-7J5-7J5-7J5-7J5-7J5"; // REEMPLAZA CON UN TOKEN REAL Y SEGURO
    }, []);

    // Efecto para cargar los datos del perfil cuando el componente se monta o el userId cambia
    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            setError(null);
            setUserData(null); // Limpiar datos anteriores

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
    }, [userIdToConsult, getJwtToken]); // Dependencias: userIdToConsult y getJwtToken

    // Derivar la inicial del nombre para el Avatar
    const userInitial = userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : '';

    // Eliminamos handleInputChange y otros manejadores de edición
    // const handleInputChange = (event) => { /* ... */ };
    // const handleUpdateProfile = () => { /* ... */ };
    // const handleCancelEdit = () => { /* ... */ };
    // const handleEditClick = () => { /* ... */ };
    // const handleCloseSnackbar = (event, reason) => { /* ... */ };

    // Renderizado condicional basado en el estado de carga y error
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
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Company Name"
                                variant="standard"
                                fullWidth
                                name="companyName"
                                value={userData.companyName || ''}
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="E-mail"
                                variant="standard"
                                fullWidth
                                name="email"
                                value={userData.email || ''}
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Phone Number"
                                variant="standard"
                                fullWidth
                                name="phoneNumber"
                                value={userData.phoneNumber || ''}
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Address"
                                variant="standard"
                                fullWidth
                                name="address"
                                value={userData.address || ''}
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="City"
                                variant="standard"
                                fullWidth
                                name="city"
                                value={userData.city || ''}
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="State"
                                variant="standard"
                                fullWidth
                                name="state"
                                value={userData.state || ''}
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Zip"
                                variant="standard"
                                fullWidth
                                name="zip"
                                value={userData.zip || ''}
                                InputProps={{ readOnly: true }} // Siempre de solo lectura
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Role"
                                variant="standard"
                                fullWidth
                                name="role"
                                value={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                                InputProps={{ readOnly: true }} // El rol no debería ser editable
                            />
                        </Grid>

                        {/* Campos específicos para Carriers */}
                        {userData.role === 'carrier' && (
                            <>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        label="USDOT Number"
                                        variant="standard"
                                        fullWidth
                                        name="usdotNumber"
                                        value={userData.usdotNumber || ''}
                                        InputProps={{ readOnly: true }} // Siempre de solo lectura
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
                                        InputProps={{ readOnly: true }} // Siempre de solo lectura
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        label="Type of Transport"
                                        variant="standard"
                                        fullWidth
                                        name="typeOfTransport"
                                        value={userData.typeOfTransport || ''}
                                        InputProps={{ readOnly: true }} // Siempre de solo lectura
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={userData.isOpen || false}
                                                name="isOpen"
                                                color="primary"
                                                disabled={true} // Siempre deshabilitado
                                            />
                                        }
                                        label="Open for New Loads"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={userData.isEnclose || false}
                                                name="isEnclose"
                                                color="primary"
                                                disabled={true} // Siempre deshabilitado
                                            />
                                        }
                                        label="Enclose for New Loads"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={userData.isBoth || false}
                                                name="isBoth"
                                                color="primary"
                                                disabled={true} // Siempre deshabilitado
                                            />
                                        }
                                        label="Handles both FTL/LTL"
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>
                {/* Eliminamos CardActions ya que no hay botones de edición */}
                {/* <CardActions sx={{ justifyContent: 'flex-end', padding: 2 }}>
                    </CardActions> */}
            </Card>

            {/* Eliminamos Snackbar ya que no hay mensajes de alerta relacionados con la edición */}
            {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar> */}
        </Box>
    );
}

export default UserProfileViewer;