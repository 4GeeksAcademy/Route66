import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CreateIcon from '@mui/icons-material/Create';
import { CreateLoadModal } from "./CreateLoadModal.jsx"
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export const Header = ({
    title = "Title",
    imgUrl,
    imgAlt = "Image",
    imgStyle = {},
    titleStyle = {},
    containerStyle = {},
    onNewLoadCreated
}) => {
    const token = localStorage.getItem("TOKEN");
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    let decodedToken
    if (token) {
        decodedToken = jwtDecode(token);
    }


    const HomeButtons = () => (
        <nav className="d-flex align-items-center gap-3">
            <Button variant="contained" endIcon={<LoginIcon />} color="error" sx={{ height: 'fit-content' }} onClick={() => {
                navigate("/login");
            }}>
                Login
            </Button>
            <div className="dropdown">
                <button className="btn btn-danger fw-bold dropdown-toggle boton" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
    )


    const LoginButton = () => (
        <nav className="d-flex align-items-center gap-3">
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
    )


    const RegisterButton = () => (
        <nav className="d-flex align-items-center gap-3">
            <Button variant="contained" endIcon={<LoginIcon />} color="error" sx={{ height: 'fit-content' }} onClick={() => {
                navigate("/login")
            }}>
                Login
            </Button>
        </nav>
    )

    const SesionsButton = () => (
        <nav className="d-flex align-items-center gap-3">
            {location.pathname === "/myloads" && (<Button variant="contained" endIcon={<CreateIcon />} color="error" sx={{ height: 'fit-content' }} onClick={() => {
                handleOpenModal();
            }}>
                Create load
            </Button>)}
            <Button variant="contained" endIcon={<AccountBoxIcon />} color="error" sx={{ height: 'fit-content' }} onClick={() => {
                navigate(`/profile/${decodedToken?.role}`);
            }}>
                Profile
            </Button>
            <Button variant="contained" endIcon={<LogoutIcon />} color="error" sx={{ height: 'fit-content' }} onClick={() => {
                localStorage.removeItem("TOKEN")
                localStorage.removeItem("User")
                navigate("/");
            }}>
                Logout
            </Button>
        </nav >
    )


    return (
        <Box sx={containerStyle}>
            <Box component="img" src={imgUrl} alt={imgAlt} sx={imgStyle} onClick={() => navigate("/")} />
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h1" sx={titleStyle} onClick={() => navigate("/")}>
                    {title}
                </Typography>

                {location.pathname === "/" ? <HomeButtons /> : location.pathname === "/login" ? <LoginButton /> : location.pathname === "/register/broker" || location.pathname === "/register/carrier" ? <RegisterButton /> : <SesionsButton />}
            </Box>
            <CreateLoadModal open={isModalOpen} onClose={handleCloseModal} onNewLoadCreated={onNewLoadCreated} />
        </Box >
    );
};
