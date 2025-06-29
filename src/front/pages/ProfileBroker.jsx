import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const ProfileBroker = () => {


    
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ minWidth: 275, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Full Name" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Company Name" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="E-mail" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Phone Number" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Address" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="City" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="State" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Zip" variant="standard" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Role" variant="standard" fullWidth />
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
