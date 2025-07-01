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

    const HomeButtons = () => (
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
                navigate("/login");
            }}>
                Login
            </Button>
        </nav>
    )

    const SesionsButton = () => (
        <nav className="d-flex align-items-center gap-3">
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
        </Box >
    );
};
