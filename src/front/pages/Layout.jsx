import { Outlet, useLocation } from "react-router-dom/dist"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import logoImg from "../assets/img/Route66logo.png"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const location = useLocation();

    const imageStyle = {
        height: '180px',
        width: '200px',
        objectFit: 'contain',
        position: 'relative',
        bottom: '-30px',
        cursor: 'pointer',
    }

    const titleStyle = {
        color: '#1C355E',
        fontWeight: 700,
        fontSize: '5rem',
        cursor: 'pointer',
    }

    const containerStyle = {
        px: 4,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        borderBottom: '1px solid #ddd',
        height: "120px"
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header containerStyle={containerStyle} title={location.pathname === "/loadsboard" ? "Loads Board" : location.pathname === "/myloads" ? "My loads" : "ROUTE 66"} titleStyle={titleStyle} imgStyle={imageStyle} imgUrl={logoImg} imgAlt="Route66 logo" />
            <Outlet className="flex-grow-1" />
            <Footer />
        </div>
    )
}