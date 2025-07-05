import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useState, useEffect, useCallback } from 'react';
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

const CarrierProfileCard = () => {
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
    role: 'carrier', 
    numberUsdot: '',
    trucks: '',
    isOpen: false,
    isEnclose: false,
    isBoth: false,
    typeOfTransport: ''
  });

  const [initialUserData, setInitialUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);

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
    const fetchCarrierData = async () => {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      

      if (!token) {
        console.error('No se encontró el token en localStorage.');
        showSnackbar('No estás autenticado. Por favor, inicia sesión.', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/profile/carrier`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.msg || 'Error al obtener datos del carrier.');
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
          role: 'carrier', 
          numberUsdot: data.numberUsdot || '',
          trucks: data.trucks || '',
          isOpen: typeof data.isOpen === 'boolean' ? data.isOpen : false,
          isEnclose: typeof data.isEnclose === 'boolean' ? data.isEnclose : false,
          isBoth: typeof data.isBoth === 'boolean' ? data.isBoth : false,
          typeOfTransport: data.typeOfTransport || ''
        });
        setInitialUserData(data);
      } catch (err) {
        console.error('Error al obtener datos del carrier:', err.message);
        showSnackbar(`Error al obtener datos del carrier: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCarrierData();
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

    if (!token) {
      console.error('No se encontró el token del usuario.');
      showSnackbar('No se encontró el token de autenticación. Por favor, inicie sesión de nuevo.', 'error');
      setLoading(false);
      return;
    }

    const dataToSend = {
      fullName: userData.fullName,
      companyName: userData.companyName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      zip: userData.zip,
      numberUsdot: userData.numberUsdot,
      trucks: userData.trucks,
      isOpen: userData.isOpen,
      isEnclose: userData.isEnclose,
      isBoth: userData.isBoth,
      typeOfTransport: userData.typeOfTransport,
    };

    try {
      const response = await fetch(`${backendUrl}/api/profile/carrier`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al actualizar el perfil del carrier.');
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
        role: 'carrier',
        numberUsdot: updatedData.numberUsdot || '',
        trucks: updatedData.trucks || '',
        isOpen: typeof updatedData.isOpen === 'boolean' ? updatedData.isOpen : false,
        isEnclose: typeof updatedData.isEnclose === 'boolean' ? updatedData.isEnclose : false,
        isBoth: typeof updatedData.isBoth === 'boolean' ? updatedData.isBoth : false,
        typeOfTransport: updatedData.typeOfTransport || ''
      });
      setInitialUserData(updatedData);
      setIsEditing(false);
      showSnackbar('Perfil de carrier actualizado con éxito.', 'success');
    } catch (err) {
      console.error('Error al actualizar el perfil del carrier:', err.message);
      showSnackbar(`Error al actualizar el perfil del carrier: ${err.message}`, 'error');
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
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando perfil de carrier...</Typography>
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
          sx={{
            backgroundColor: '#002244',
            color: 'white', 
            borderBottom: '2px solid white', 
            paddingBottom: 2,
            marginBottom: 2, 
          }}
          title={
            <Typography variant="h5" sx={{
              fontSize: '2rem',
              textAlign: 'left',
              color: 'white',
            }}>
              Mi perfil (Carrier)
            </Typography>
          }
          action={
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <Avatar
                sx={{
                  fontSize: '2rem',
                  bgcolor: blue[800], 
                  width: 80,
                  height: 80,
                }}
                src={userData.avatarUrl || undefined} 
              >
                {!userData.avatarUrl && userInitial}
              </Avatar>
              {isEditing && (
                <>
                  <input
                    accept="image/*"
                    id="avatar-upload-button"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                    ref={fileInputRef}
                  />
                  <label htmlFor="avatar-upload-button">
                    <IconButton
                      color="inherit"
                      aria-label="upload picture"
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,1)', 
                        },
                        color: '#002244', 
                      }}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? <CircularProgress size={24} sx={{ color: '#002244' }} /> : <PhotoCamera />}
                    </IconButton>
                  </label>
                </>
              )}
            </Box>
          }
        />


        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Nombre Completo"
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
                label="Nombre de la Empresa"
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
                label="Correo Electrónico"
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
                label="Número de Teléfono"
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
                label="Dirección"
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
                label="Ciudad"
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
                label="Estado"
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
                label="Código Postal"
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
                label="Rol"
                variant="standard"
                fullWidth
                name="role"
                value="Carrier"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Número USDOT"
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
                label="Número de Camiones"
                variant="standard"
                fullWidth
                name="trucks"
                type="number"
                value={userData.trucks}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Tipo de Transporte"
                variant="standard"
                fullWidth
                name="typeOfTransport"
                value={userData.typeOfTransport}
                onChange={handleInputChange}
                disabled={!isEditing}
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
                label="Open"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userData.isEnclose}
                    onChange={handleInputChange}
                    name="isEnclose"
                    color="primary"
                    disabled={!isEditing}
                  />
                }
                label="Enclose"
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
                label="Both"
              />
            </Grid>
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
              <Button
                size="small"
                onClick={handleUpdateProfile}
                variant="contained"
                color="primary"
                disabled={loading || uploadingAvatar} // Deshabilita el botón mientras se sube el avatar
              >
                {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
              </Button>
              <Button size="small" onClick={handleCancelEdit} variant="outlined" color="secondary" disabled={loading || uploadingAvatar}>
                Cancelar
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

export default CarrierProfileCard;