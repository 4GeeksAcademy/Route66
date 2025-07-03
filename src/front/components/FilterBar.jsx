import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

export const FilterBar = (props) => {
    const [pickup, setPickup] = useState("");
    const [delivery, setDelivery] = useState("");

    const handleFilter = () => {
        props.onFilterChange({ pickup, delivery });
    }
    const handleClearFilter = () => {
        setPickup("");
        setDelivery("");
        props.onFilterChange({ pickup: "", delivery: "" });
    }

    return (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2, bgcolor: '#0E397F' }}>
            <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center', gap: 2, alignContent: 'center' }}>
                <TextField label="Search Pickup" variant="outlined" size="small" sx={{ bgcolor: 'white', borderRadius: 1 }} onChange={(e) => setPickup(e.target.value)} value={pickup} />
                <TextField label="Search Delivery" variant="outlined" size="small" sx={{ bgcolor: 'white', borderRadius: 1 }} onChange={(e) => setDelivery(e.target.value)} value={delivery} />
                <Button variant="contained" sx={{ bgcolor: '#D32F2F' }} onClick={handleFilter}>
                    Apply Filters
                </Button>
                {(pickup !== "" || delivery !== "") && <Button variant="contained" sx={{ bgcolor: '#D32F2F' }} onClick={handleClearFilter}>
                    Clear filters
                </Button>}
            </Box>
        </Box>
    );
};