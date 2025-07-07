import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
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

const BrokerProfileCard = () => {
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
    role: 'broker',
    avatarUrl: '',
  });
  const [initialUserData, setInitialUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef(null);
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

  const handleAvatarUpload = async (event) => {

    const file = event.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('image', file);

    try {

      const uploadResponse = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Error uploading image to your server.');
      }

      const uploadData = await uploadResponse.json();
      const newAvatarUrl = uploadData.secure_url;
      console.log(uploadData);
      


      const token = localStorage.getItem('TOKEN');
      if (!token) {
        showSnackbar('You are not authenticated. Please log in', 'error');
        setUploadingAvatar(false);
        return;
      }

      const backendUpdateResponse = await fetch(`${backendUrl}/api/profile/broker`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatarUrl: newAvatarUrl })
      });

      if (!backendUpdateResponse.ok) {
        const errorData = await backendUpdateResponse.json();
        throw new Error(errorData.msg || 'Failed to update brokers profile avatar.');
      }

      setUserData(prevData => ({ ...prevData, avatarUrl: newAvatarUrl }));
      setInitialUserData(prevData => ({ ...prevData, avatarUrl: newAvatarUrl }));
      showSnackbar('Avatar updated successfully.', 'success');

    } catch (err) {
      console.error('Error uploading or updating avatar:', err.message);
      showSnackbar(`Error uploading or updating avatar: ${err.message}`, 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    const fetchBrokerData = async () => {
      setLoading(true);
      const token = localStorage.getItem('TOKEN');

      const role = 'broker';
      if (!token) {
        console.error('No se encontró el token en localStorage.');
        showSnackbar('No estás autenticado. Por favor, inicia sesión.', 'error');
        setLoading(false);
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
          throw new Error(error.msg || 'Error al obtener datos del broker.');
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
          role: 'broker',
          avatarUrl: data.avatarUrl || '',
        });
        setInitialUserData(data);
      } catch (err) {
        console.error('Error al obtener datos del broker:', err.message);
        showSnackbar(`Error al obtener datos del broker: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBrokerData();
  }, [userId, showSnackbar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleUpdateProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('TOKEN');

    if (!token) {
      console.error('User token not found.');
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
    };
    try {
      const response = await fetch(`${backendUrl}/api/profile/broker`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al actualizar el perfil del broker.');
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
        role: 'broker',
        avatarUrl: updatedData.avatarUrl || '',
      });
      setInitialUserData(updatedData);
      setIsEditing(false);
      showSnackbar('Perfil de broker actualizado con éxito.', 'success');
    } catch (err) {
      console.error('Error al actualizar el perfil del broker:', err.message);
      showSnackbar(`Error al actualizar el perfil del broker: ${err.message}`, 'error');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '79.2vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando perfil de broker...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      padding: 4,
      backgroundColor: '#f5f5f5',
      minHeight: '79.2vh',
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
              Mi perfil (Broker)
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
                        color: blue[800],
                      }}
                      disabled={uploadingAvatar} 
                    >
                      {uploadingAvatar ? <CircularProgress size={24} sx={{ color: blue[800] }} /> : <PhotoCamera />}
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
                value="Broker"
                disabled
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
              Editar información
            </Button>
          ) : (
            <>
              <Button size="small" onClick={handleUpdateProfile} variant="contained" color="primary" disabled={loading || uploadingAvatar}>
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

export default BrokerProfileCard;