import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const envioLogin = (event) => {
        event.preventDefault(); // evita el comportamiento por defecto del navegador :contentReference[oaicite:2]{index=2}



        const backendUrl = import.meta.env.VITE_BACKEND_URL
        if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

        console.log(backendUrl);

        let urlService = backendUrl + 'api/login';

        fetch(urlService, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.exitoso) {
                    //Inicio sesion con exito

                    localStorage.setItem("TOKEN", data.token);

                    Swal.fire({
                        title: '¡Bienvenido!',
                        text: data.mensaje,
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: data.mensaje,
                        icon: 'warning',
                        confirmButtonText: 'Aceptar'
                    });

                }

            })
            .catch(error => console.error('Error al enviar datos:', error));


    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="mb-3 text-center">Login</h3>
                <form id="brokerForm" onSubmit={envioLogin}>
                    <div className="mb-3">
                        <input type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Log In</button>
                </form>
                <Link to={'/principal'}>
                    ← Back to Home
                </Link>
                <Link to={'/passwordReset'}>
                    Forgot Paswrod
                </Link>
            </div>
        </div>
    );
}

export default Login;