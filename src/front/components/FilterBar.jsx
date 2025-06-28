import { Box, Button, TextField } from "@mui/material";

export const FilterBar = () => {


    return (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2, bgcolor: '#0E397F' }}>
            <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center', gap: 2, alignContent: 'center' }}>
                <TextField label="Search Pickup" variant="outlined" size="small" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                <TextField label="Search Delivery" variant="outlined" size="small" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                <Button variant="contained" sx={{ bgcolor: '#D32F2F' }}>
                    Apply Filters
                </Button>
            </Box>
        </Box>
    );
};