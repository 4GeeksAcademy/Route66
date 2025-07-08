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
    avatar_url: '',
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

      const uploadResponse = await fetch(`${backendUrl}/api/upload`, {
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
      setUserData({...userData, avatar_url: newAvatarUrl})



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
        console.error('Token not found in localStorage.');
        showSnackbar('You are not authenticated. Please log in.', 'error');
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
          throw new Error(error.msg || 'Error getting data from broker.');
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
          avatar_url: data.avatar_url || '',
        });
        setInitialUserData(data);
      } catch (err) {
        console.error('Error getting data from broker:', err.message);
        showSnackbar(`Error getting data from broker: ${err.message}`, 'error');
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
      showSnackbar('The authentication token was not found. Please log in again.', 'error');
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
    console.log(dataToSend)
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
        throw new Error(errorData.msg || 'Error updating broker profile.');
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
        avatar_url: updatedData.avatar_url || '',
      });
      setInitialUserData(updatedData);
      setIsEditing(false);
      showSnackbar('Broker profile successfully updated.', 'success');
    } catch (err) {
      console.error('Error updating broker profile:', err.message);
      showSnackbar(`Error updating broker profile: ${err.message}`, 'error');
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
        <Typography variant="h6" sx={{ ml: 2 }}>Loading broker profile...</Typography>
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
              My profile (Broker)
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
                src={userData.avatar_url || undefined}
              >
                {!userData.avatar_url && userInitial}
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
                label="Email"
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
                label="Phone number"
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
                label="Zip code"
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
              Edit information
            </Button>
          ) : (
            <>
              <Button size="small" onClick={handleUpdateProfile} variant="contained" color="primary" disabled={loading || uploadingAvatar}>
                {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
              </Button>
              <Button size="small" onClick={handleCancelEdit} variant="outlined" color="secondary" disabled={loading || uploadingAvatar}>
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

export default BrokerProfileCard;