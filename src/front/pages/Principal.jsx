import rutaCamiones from '../assets/img/camiones.jpg'

import { Link } from 'react-router-dom';

const Principal = () => {

    return (
        <div className="bg-light text-center d-flex flex-column" style={{ minHeight: '100vh' }}>
            <main className="py-5 px-3" style={{ alignItems: 'center' }}>
                <h1 className="mb-4">Efficient Freight Shipping Solutions</h1>
                <div className="mb-4">
                    <img src={rutaCamiones} alt="Camiones de transporte" className="img-fluid rounded shadow imgCamionesPrincipal" style={{ width: '35%' }} />
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