import rutaCamiones from '../assets/img/camiones.jpg'

import { Link } from 'react-router-dom';

const Principal = () => {

    return (
        <div className="bg-light text-center d-flex flex-column" style={{ minHeight: '79.2vh' }}>
            <main className="py-5 px-3" style={{ alignItems: 'center' }}>
                <h1 className="mb-4">Efficient Freight Shipping Solutions</h1>
                <div className="mb-4">
                    <img src={rutaCamiones} alt="Camiones de transporte" className="img-fluid rounded shadow imgCamionesPrincipal" style={{ width: '35%' }} />
                </div>

                <div className="dropdown-center">
                    <button
                        className="btn boton btn-danger fw-bold dropdown-toggle shadow"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Get Started
                    </button>
                    <ul className="dropdown-menu shadow-sm">
                        <li>
                            <Link className="dropdown-item py-2" to="/register/broker">
                                🚚 I'm a Broker
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item py-2" to="/register/carrier">
                                🛻 I'm a Carrier
                            </Link>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Principal;