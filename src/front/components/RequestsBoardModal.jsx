import { Modal, Box, Typography, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

export const RequestsBoardModal = ({ open, onClose, load }) => {
    const navigate = useNavigate();

    if (!load || !load.load_requests) return null;

    const handleEmailClick = (userId) => {
        onClose();
        navigate(`/users/${userId}`);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 40 },
        { field: 'companyName', headerName: 'Company name', width: 140 },
        {
            field: 'email',
            headerName: 'Email',
            width: 180,

            renderCell: (params) => (
                <Button
                    variant="text"
                    sx={{ textTransform: 'none', padding: 0, minWidth: 0 }}
                    onClick={() => handleEmailClick(params.row.id)}
                >
                    {params.value}
                </Button>
            ),
        },
        { field: 'phoneNumber', headerName: 'Phone number', width: 120 },
        { field: 'offer', headerName: 'Offered price', width: 100 },
        // { field: 'status', headerName: 'Status', width: 100 },
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     width: 170,
        //     renderCell: (params) =>
        //         <Button
        //             variant="contained"
        //             color="error"
        //             onClick={() => handleOpenModal(params.row)}
        //         >
        //             See Requests
        //         </Button>
        // }
    ];

    const transformedRows = load.load_requests.map(load => ({
        id: load.carrier.id,
        companyName: load.carrier.company_name,
        email: load.carrier.email,
        phoneNumber: load.carrier.phone_number,
        offer: `$${load.price_offer}`,
        // status: load.status,
    }))

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
                    Load Requests for Load ID #{load.id}
                </Typography>

                <Box sx={{ margin: 'auto', display: 'inline-block' }}>
                    <DataGrid
                        rows={transformedRows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 }, // Define el tamaño de página inicial si lo deseas
                            },
                        }}
                        pageSizeOptions={[5, 10, 20]} // Opciones para el tamaño de página
                        disableRowSelectionOnClick // Opcional: Deshabilita la selección de fila al hacer clic
                        autoHeight // Ajusta automáticamente la altura según el contenido
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                            // Puedes ajustar el ancho aquí si es necesario, o dejarlo que DataGrid lo calcule
                            // width: 'auto', // O un valor fijo como 700
                        }}
                    />
                </Box>
            </Box>
        </Modal>
    );
};