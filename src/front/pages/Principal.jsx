import rutaLogo from '../assets/img/route66_logo_1.jpg'
import rutaCamiones from '../assets/img/camiones.jpg'
import { Header } from "../components/Header.jsx";
import logoImg from "../assets/img/Route66logo.png"

import { Link } from 'react-router-dom';

const Principal = () => {

    const imageStyle = {
        height: '180px',
        width: '200px',
        objectFit: 'contain',
        position: 'relative',
        bottom: '-20px',
    }

    const titleStyle = {
        color: '#1C355E',
        fontWeight: 700,
        fontSize: '5rem'
    }

    const containerStyle = {
        px: 4,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        borderBottom: '2px solid #ddd',
        height: "120px"
    }


    return (
        <div className="bg-light text-center d-flex flex-column" style={{ minHeight: '100vh'}}>
            <Header containerStyle={containerStyle} title="ROUTE 66" titleStyle={titleStyle} imgStyle={imageStyle} imgUrl={logoImg} imgAlt="Route66 logo" />
            {/* <header className="bg-white border-bottom border-4 border-primary py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <img src={rutaLogo} alt="Route 66 Logo" className="img-fluid" style={{ width: '15%', height: '15%' }} />
                    <h2 className="mb-0">ROUTE 66</h2>
                </div>
                <nav className="d-flex align-items-center gap-3">
                    <div className="dropdown">
                        <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Log In
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">

                            <li>
                                <Link to={'/login'}>
                                    Log In
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-danger fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Started
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link to={'/register?role=broker'}>
                                    I'm a broker
                                </Link>
                            </li>
                            <li>
                                <Link to={'/register?role=carrier'}>
                                    I'm  a Carrier
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header> */}

            <main className="py-5 px-3" style={{ alignItems: 'center' }}>
                <h1 className="mb-4">Efficient Freight Shipping Solutions</h1>
                <div className="mb-4">
                    <img src={rutaCamiones} alt="Camiones de transporte" className="img-fluid rounded shadow imgCamionesPrincipal" style={{width: '35%'}} />
                </div>

                <div className="dropdown">
                    <button className="btn btn-danger btn-lg fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Get Started
                    </button>
                    <ul className="dropdown-menu dropdown-menu-center">
                        <li>
                            <Link to="/register?role=broker" className="dropdown-item text-danger fw-bold">
                                I'm a Broker
                            </Link>
                        </li>
                        <li>
                            <Link to="/register?role=carrier" className="dropdown-item text-danger fw-bold">
                                I'm a Carrier
                            </Link>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Principal;