import { Modal, Box, Typography, Button } from "@mui/material";
import { LoadRegister } from "../pages/LoadRegister";

export const CreateLoadModal = ({ open, onClose }) => {

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom>
                    Creating Load
                </Typography>

                <LoadRegister />
            </Box>
        </Modal>
    );
};git 