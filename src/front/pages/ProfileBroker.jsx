import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProfileBroker = () => {

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token available');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/usuario`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.msg || 'Error al obtener el usuario');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err.message);
      }
    };

    fetchUserData();
  }, []);

    
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ minWidth: 275, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Full Name" variant="standard" fullWidth value={userData.fullName} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Company Name" variant="standard" fullWidth value={userData.companyName} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="E-mail" variant="standard" fullWidth value={userData.email} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Phone Number" variant="standard" fullWidth value={userData.phoneNumber} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Address" variant="standard" fullWidth value={userData.address} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="City" variant="standard" fullWidth value={userData.city} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="State" variant="standard" fullWidth value={userData.state} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Zip" variant="standard" fullWidth value={userData.zip} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Role" variant="standard" fullWidth value={userData.role} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="small">Start Load Register</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ProfileBroker;
