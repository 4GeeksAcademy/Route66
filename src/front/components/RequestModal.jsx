import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import Swal from 'sweetalert2';

export const RequestModal = ({ open, onClose, load }) => {
    const [offer, setOffer] = useState("");
    const token = localStorage.getItem("TOKEN");

    const handleSubmit = async () => {
        const requestData = {
            load_id: load.id,
            price_offer: offer.trim() !== "" ? offer : load.payment
        }
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}api/requestload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData),
            });
            const data = await response.json();

            if (response.status === 201) {
                Swal.fire({
                    title: 'Request Sent!',
                    text: 'Your load request has been submitted.',
                    icon: 'success',
                    confirmButtonText: 'Great'
                });
                onClose();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.msg || 'Unexpected error occurred.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                onClose();
            }
            
            console.log(data);
        } catch (error) {
            console.error("Error al cargar los usuarios", error);
            Swal.fire({
                title: 'Server Error!',
                text: 'Unable to send request at the moment.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }




    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                width: 400
            }}>
                <Typography variant="h6" gutterBottom>
                    Request Load #{load?.id}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Vehicle: {load?.vehicleYear} {load?.vehicleMake} {load?.vehicleModel}
                </Typography>
                <TextField
                    label="Offer (optional)"
                    placeholder={`Suggested: $${load?.payment}`}
                    variant="outlined"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button onClick={onClose} variant="contained" sx={{ background: '#0E397F' }}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="error">Send Request</Button>
                </Box>
            </Box>
        </Modal>
    );
};
