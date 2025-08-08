import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
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
import { use } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const EditNewUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

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
        usdotNumber: '',
        numberOfTrucks: '',
        typeOfTransport: '',
        avatarUrl: ''
    });
    const [initialUserData, setInitialUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = React.useRef(null);
    const userInitial = userData.fullName
        ? userData.fullName
            .split(' ')
            .slice(0, 2)
            .map(name => name.charAt(0).toUpperCase())
            .join('')
        : '';
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
            setUserData({ ...userData, avatar_url: newAvatarUrl })

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
        const fetchUserData = async () => {
            setLoading(true);

            try {
                const response = await fetch(`${backendUrl}/api/profile/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.msg || 'Error getting carrier data.');
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
                    usdotNumber: data.usdotNumber || '',
                    mcNumber: data.mcNumber || '',
                    numberOfTrucks: data.numberOfTrucks || '',
                    typeOfTransport: data.typeOfTransport || ''
                });
                setInitialUserData(data);
            } catch (err) {
                console.error(`Error getting user data: ${err.message}`);
                showSnackbar(`Error getting user data: ${err.message}`, 'error');
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

        const dataToSend = {
            fullName: userData.fullName,
            companyName: userData.companyName,
            email: userData.email,
            role: userData.role === "" ? null : userData.role,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            zip: userData.zip,
            mcNumber: userData.mcNumber,
            usdotNumber: userData.usdotNumber,
            numberOfTrucks: userData.numberOfTrucks === "" ? null : userData.numberOfTrucks,
            typeOfTransport: userData.typeOfTransport,
        };

        try {
            const response = await fetch(`${backendUrl}/api/profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error updating profile.');
            }
            const updatedData = await response.json();

            setUserData({
                fullName: updatedData.user.full_name || '',
                companyName: updatedData.user.company_name || '',
                email: updatedData.user.email || '',
                phoneNumber: updatedData.user.phone_number || '',
                address: updatedData.user.address || '',
                city: updatedData.user.city || '',
                state: updatedData.user.state || '',
                zip: updatedData.user.zip || '',
                role: updatedData.user.role || '',
                mcNumber: updatedData.user.mc_number || '',
                usdotNumber: updatedData.user.usdot_number || '',
                numberOfTrucks: updatedData.user.number_of_trucks || '',
                typeOfTransport: updatedData.user.type_of_transport || ''
            });
            setInitialUserData(updatedData);
            setIsEditing(false);
            showSnackbar('Profile successfully updated.', 'success');
            if (updatedData.user.role) {
                localStorage.setItem("User", JSON.stringify(updatedData.user));
                localStorage.setItem("TOKEN", updatedData.access_token);
                navigate(updatedData?.user?.role === 'broker' ? '/myloads' : '/loadsboard');
            }
        } catch (err) {
            console.error('Error updating profile:', err.message);
            showSnackbar(`Error updating profile: ${err.message}`, 'error');
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
                <Typography variant="h6" sx={{ ml: 2 }}>Loading carrier profile...</Typography>
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
                            My Profile
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
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="role-select-label">Role</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    id="role-select"
                                    value={userData.role}
                                    label="Role"
                                    onChange={handleInputChange}
                                    name="role"
                                    disabled={!isEditing}
                                >
                                    <MenuItem value="broker">Broker</MenuItem>
                                    <MenuItem value="carrier">Carrier</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="MC Number"
                                variant="standard"
                                fullWidth
                                name="mcNumber"
                                value={userData.mcNumber}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="USDOT Number"
                                variant="standard"
                                fullWidth
                                name="usdotNumber"
                                value={userData.usdotNumber}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Number of Trucks"
                                variant="standard"
                                fullWidth
                                name="numberOfTrucks"
                                type="number"
                                value={userData.numberOfTrucks}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={12}>
                            <FormGroup aria-label="position" row style={{ justifyContent: 'center' }}>
                                <FormLabel component="legend">Type of transport</FormLabel>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={userData.typeOfTransport === 'open'}
                                            onChange={() => setUserData({ ...userData, typeOfTransport: 'open' })}
                                            disabled={!isEditing}
                                        />
                                    }
                                    label="Open"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={userData.typeOfTransport === 'enclose'}
                                            onChange={() => setUserData({ ...userData, typeOfTransport: 'enclose' })}
                                            disabled={!isEditing}
                                        />
                                    }
                                    label="Enclose"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={userData.typeOfTransport === 'both'}
                                            onChange={() => setUserData({ ...userData, typeOfTransport: 'both' })}
                                            disabled={!isEditing}
                                        />
                                    }
                                    label="Both"
                                />
                            </FormGroup>
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
                                disabled={loading || uploadingAvatar}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
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

export default EditNewUser;