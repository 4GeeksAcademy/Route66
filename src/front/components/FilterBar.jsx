import { Box, Button, TextField } from "@mui/material";

export const FilterBar = () => {


    return (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2, bgcolor: '#0E397F' }}>
            <Box sx={{mt: 7, mb: 8, display: 'flex', justifyContent: 'center', gap: 2}}>
                <TextField label="Search Pickup" variant="outlined" size="small" />
                <TextField label="Search Delivery" variant="outlined" size="small" />
                <Button variant="contained" sx={{ bgcolor: '#D32F2F' }}>
                    Apply Filters
                </Button>
            </Box>
        </Box>
    );
};