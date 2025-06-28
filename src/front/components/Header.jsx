import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

export const Header = ({
    title = "Title",
    imgUrl,
    imgAlt = "Image",
    imgStyle = {},
    titleStyle = {},
    containerStyle = {}
}) => {

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Box sx={containerStyle}>
            <Box component="img" src={imgUrl} alt={imgAlt} sx={imgStyle} />
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h1" sx={titleStyle}>
                    {title}
                </Typography>

                {location.pathname === "/" ? (
                    <nav className="d-flex align-items-center gap-3">
                        <Button variant="contained" endIcon={<LoginIcon />} color="error" sx={{ height: 'fit-content' }} onClick={() => {
                            navigate("/login");
                        }}>
                            Login
                        </Button>
                        <div className="dropdown">
                            <button className="btn btn-danger fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Started
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link to="/register/broker">I'm a Broker</Link>
                                </li>
                                <li>
                                    <Link to="/register/carrier">I'm a Carrier</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                ) : <Button variant="contained" endIcon={<LogoutIcon />} color="error" sx={{ height: 'fit-content' }} onClick={() => {
                    navigate("/");
                }}>
                    Logout
                </Button>}
            </Box>
        </Box>
    );
};
