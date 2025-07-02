// import * as React from 'react';
// import CardActions from '@mui/material/CardActions';
// import Button from '@mui/material/Button';
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import EditIcon from '@mui/icons-material/Edit';
// import { Box, Card, CardContent, CardHeader, Typography, Grid, TextField, Avatar } from '@mui/material';
// import { blue } from '@mui/material/colors';

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// // const userInitial = data.fullName ? userData.fullName.charAt(0).toUpperCase() : '';


// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const ProfileBroker = () => {
//     const { userId } = useParams();

//     const [userData, setUserData] = useState({
//         fullName: '',
//         companyName: '',
//         email: '',
//         phoneNumber: '',
//         address: '',
//         city: '',
//         state: '',
//         zip: '',
//         role: ''
//     });

//     const [isEditing, setIsEditing] = useState(false);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('success');


//     useEffect(() => {
//         const fetchUserData = async () => {
//             const token = localStorage.getItem('access_token');
//             if (!token) {
//                 console.error('No token available');
//                 return;
//             }

//             try {
//                 const response = await fetch(`${backendUrl}/api/profile/broker`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (!response.ok) {
//                     const error = await response.json();
//                     throw new Error(error.msg || 'Error al obtener datos del usuario');
//                 }

//                 const data = await response.json();
//                 setUserData(data);
//             } catch (err) {
//                 console.error('Error al obtener datos del usuario:', err.message);
//                 showSnackbar(`Error al obtener datos del usuario: ${err.message}`, 'error');
//             }
//         };

//         fetchUserData();
//     }, [userId]);


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUserData(prevData => ({
//             ...prevData,
//             [name]: value
//         }));
//     };


//     const showSnackbar = (message, severity) => {
//         setSnackbarMessage(message);
//         setSnackbarSeverity(severity);
//         setSnackbarOpen(true);
//     };

//     const handleCloseSnackbar = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setSnackbarOpen(false);
//     };


//     const handleUpdateProfile = async () => {
//         const token = localStorage.getItem('access_token');
//         if (!token) {
//             console.error('No se encontró el token de autenticación.');
//             showSnackbar('No se encontró el token de autenticación. Por favor, inicie sesión de nuevo.', 'error');
//             return;
//         }

//         try {

//             const response = await fetch(`${backendUrl}/api/profile/broker`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify(userData)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.msg || 'Error al actualizar el perfil.');
//             }

//             const updatedData = await response.json();
//             setUserData(updatedData);
//             setIsEditing(false);
//             showSnackbar('Perfil actualizado con éxito.', 'success');
//         } catch (err) {
//             console.error('Error al actualizar el perfil:', err.message);
//             showSnackbar(`Error al actualizar el perfil: ${err.message}`, 'error');
//         }
//     };

//     return (
//         <Box sx={{
//             padding: 4,
//             backgroundColor: '#f5f5f5',
//             minHeight: '100vh',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             flexDirection: 'column'
//         }}>
//             <Card sx={{
//                 minWidth: 275,
//                 maxWidth: 800,
//                 width: '90%',
//                 boxShadow: 3,

//             }}>
//                 <CardHeader
//                     title={
//                         <Typography variant="h5" sx={{ fontSize: '2rem', textAlign: 'left' }}>
//                             Mi perfil
//                         </Typography>
//                     }
                    
//                     action={ 
//                         <Avatar sx={{fontSize: '2rem', bgcolor: blue[800] }}> 
//                             P{/* {userInitial} */}
//                         </Avatar>
//                     }
                    

//                 />
//                 <CardContent>
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="Full Name"
//                                 variant="standard"
//                                 fullWidth
//                                 name="fullName"
//                                 value={userData.fullName}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="Company Name"
//                                 variant="standard"
//                                 fullWidth
//                                 name="companyName"
//                                 value={userData.companyName}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="E-mail"
//                                 variant="standard"
//                                 fullWidth
//                                 name="email"
//                                 value={userData.email}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="Phone Number"
//                                 variant="standard"
//                                 fullWidth
//                                 name="phoneNumber"
//                                 value={userData.phoneNumber}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="Address"
//                                 variant="standard"
//                                 fullWidth
//                                 name="address"
//                                 value={userData.address}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="City"
//                                 variant="standard"
//                                 fullWidth
//                                 name="city"
//                                 value={userData.city}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="State"
//                                 variant="standard"
//                                 fullWidth
//                                 name="state"
//                                 value={userData.state}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="Zip"
//                                 variant="standard"
//                                 fullWidth
//                                 name="zip"
//                                 value={userData.zip}
//                                 onChange={handleInputChange}
//                                 disabled={!isEditing}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <TextField
//                                 label="Role"
//                                 variant="standard"
//                                 fullWidth
//                                 name="role"
//                                 value={userData.role}
//                             />
//                         </Grid>
//                     </Grid>
//                 </CardContent>
//                 <CardActions>
//                     {!isEditing ? (
//                         <Button
//                             size="medium"
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => setIsEditing(true)}
//                             startIcon={<EditIcon />}
//                         >
//                             Edit information
//                         </Button>
//                     ) : (
//                         <>
//                             <Button size="small" onClick={handleUpdateProfile} variant="contained" color="primary">
//                                 Save Changes
//                             </Button>
//                             <Button size="small" onClick={() => {
//                                 setIsEditing(false);
//                             }}>
//                                 Cancel
//                             </Button>
//                         </>
//                     )}
//                 </CardActions>
//             </Card>

//             <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//                 <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
//                     {snackbarMessage}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default ProfileBroker;



import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useState, useEffect, useCallback } from 'react'; // Importamos useCallback
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
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
  CircularProgress  
} from '@mui/material';
import { blue } from '@mui/material/colors';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserProfileCard = () => {
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
    role: '', 
    numberUsdot: '',
    trucks: '',
    isOpen: false,
    isBoth: false,
    typeOfTransport: ''
  });

  const [initialUserData, setInitialUserData] = useState({}); // Para revertir cambios al cancelar
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  
  const userInitial = userData.fullName ? userData.fullName.charAt(0).toUpperCase() : '';

  
  const showSnackbar = useCallback((message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []); 

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const role = localStorage.getItem('role'); 

      if (!token || !role) {
        console.error('No se encontró el token o el rol del usuario en localStorage.');
        showSnackbar('No estás autenticado o tu rol no se ha cargado. Por favor, inicia sesión.', 'error');
        setLoading(false);
        return;
      }

      
      const endpoint = role === 'broker' ? '/api/profile/broker' : '/api/profile/carrier';

      try {
        const response = await fetch(`${backendUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.msg || 'Error al obtener datos del usuario.');
        }

        const data = await response.json();
        
        setUserData({
            fullName: data.fullName || '',
            companyName: data.companyName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.zip || '',
            role: data.role || '',
            
            numberUsdot: data.numberUsdot || '',
            trucks: data.trucks || '',
            isOpen: typeof data.isOpen === 'boolean' ? data.isOpen : false,
            isEnclose: typeof data.isEnclose === 'boolean' ? data.Enclose : false,
            isBoth: typeof data.isBoth === 'boolean' ? data.isBoth : false,
            typeOfTransport: data.typeOfTransport || ''
        });
        setInitialUserData(data); 
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err.message);
        showSnackbar(`Error al obtener datos del usuario: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, showSnackbar]); 

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    const Role = localStorage.getItem('role');

    if (!token || !Role) {
      console.error('No se encontró el token o el rol del usuario.');
      showSnackbar('No se encontró el token de autenticación. Por favor, inicie sesión de nuevo.', 'error');
      setLoading(false);
      return;
    }

    const endpoint = Role === 'broker' ? '/api/profile/broker' : '/api/profile/carrier';

    
    const dataToSend = {
        fullName: userData.fullName,
        companyName: userData.companyName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
    };

    
    if (userRole === 'carrier') {
        dataToSend.numberUsdot = userData.numberUsdot;
        dataToSend.trucks = userData.trucks;
        dataToSend.isOpen = userData.isOpen;
        dataToSend.isBoth = userData.isBoth;
        dataToSend.typeOfTransport = userData.typeOfTransport;
    } 

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend) 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al actualizar el perfil.');
      }

      const updatedData = await response.json();
      setUserData({
            fullName: updatedData.fullName || '',
            companyName: updatedData.companyName || '',
            email: updatedData.email || '',
            phoneNumber: updatedData.phoneNumber || '',
            address: updatedData.address || '',
            city: updatedData.city || '',
            state: updatedData.state || '',
            zip: updatedData.zip || '',
            role: updatedData.role || '',
            
            numberUsdot: updatedData.numberUsdot || '',
            trucks: updatedData.trucks || '',
            isOpen: typeof updatedData.isOpen === 'boolean' ? updatedData.isOpen : false,
            isBoth: typeof updatedData.isBoth === 'boolean' ? updatedData.isBoth : false,
            typeOfTransport: updatedData.typeOfTransport || ''
      });
      setInitialUserData(updatedData); 
      setIsEditing(false);
      showSnackbar('Perfil actualizado con éxito.', 'success');
    } catch (err) {
      console.error('Error al actualizar el perfil:', err.message);
      showSnackbar(`Error al actualizar el perfil: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setUserData(initialUserData); 
    setIsEditing(false);
  };

  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando perfil...</Typography>
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
      }}>
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontSize: '2rem', textAlign: 'left' }}>
              Mi perfil ({userData.role.charAt(0).toUpperCase() + userData.role.slice(1)})
            </Typography>
          }
          action={ 
            <Avatar sx={{fontSize: '2rem', bgcolor: blue[800] }}> 
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
                value={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                
              />
            </Grid>

            
            {userData.role === 'carrier' && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="USDOT Number"
                    variant="standard"
                    fullWidth
                    name="numberUsdot"
                    value={userData.numberUsdot}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Number of Trucks"
                    variant="standard"
                    fullWidth
                    name="trucks"
                    type="number" // Asegura que solo se ingresen números
                    value={userData.trucks}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Type of Transport"
                    variant="standard"
                    fullWidth
                    name="typeOfTransport"
                    value={userData.typeOfTransport} //Esto no se edita 
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userData.isOpen}
                        onChange={handleInputChange}
                        name="isOpen"
                        color="primary"
                        disabled={!isEditing}
                      />
                    }
                    label="Open for New Loads"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userData.isOpen}
                        onChange={handleInputChange}
                        name="isEnclose"
                        color="primary"
                        disabled={!isEditing}
                      />
                    }
                    label="Enclose for New Loads"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userData.isBoth}
                        onChange={handleInputChange}
                        name="isBoth"
                        color="primary"
                        disabled={!isEditing}
                      />
                    }
                    label="Handles both FTL/LTL"
                  />
                </Grid>
              </>
            )}

          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', padding: 2 }}>
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
              <Button size="small" onClick={handleUpdateProfile} variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              <Button size="small" onClick={handleCancelEdit} variant="outlined" color="secondary" disabled={loading}>
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

export default UserProfileCard;