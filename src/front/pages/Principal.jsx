import rutaLogo from '../assets/img/route66_logo_1.jpg'
import rutaCamiones from '../assets/img/camiones.jpg'

import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Principal = () => {





    return (
        <div className="bg-light text-center">
            <header className="bg-white border-bottom border-4 border-primary py-3 px-4 d-flex justify-content-between align-items-center">
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
                                <Link to={'/registroBroker'}>
                                    I'm  a Broker
                                </Link>
                            </li>
                            <li>
                                <Link to={'/registroCarrier'}>
                                    I'm  a Carrier
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <main className="py-5 px-3">
                <div className="mb-4">
                    <img src={rutaCamiones} alt="Camiones de transporte" className="img-fluid rounded shadow imgCamionesPrincipal" />
                </div>
                <h1 className="mb-4">Efficient Freight Shipping Solutions</h1>
                <div className="dropdown">
                    <button className="btn btn-danger btn-lg fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Get Started
                    </button>
                    <ul className="dropdown-menu dropdown-menu-center">
                        <li>
                            <Link to={'/registroBroker'}>
                                I'm  a Broker
                            </Link>
                        </li>
                        <li>
                            <Link to={'/registroCarrier'}>
                                I'm  a Carrier
                            </Link>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Principal;