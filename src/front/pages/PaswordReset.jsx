import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const PasswordReset = () => {


    const [email, setEmail] = useState('');



    const envioReset = async (event) => {
        event.preventDefault();

        console.log(email);


        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

        try {
            const response = await fetch(`${backendUrl}/api/passwordResetEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.encrypt != undefined) {
                Swal.fire({
                    title: 'Correcto!',
                    text: 'Se ha enviado un en lñace a su correo electronico para restablecer la contraseña',
                    icon: 'success',
                    confirmButtonText: 'Accept'
                })
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.msg,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }

            console.log(data)
        } catch (error) {
            console.error("Error al enviar datos:", error);
            Swal.fire("Oops!", "Error en el servidor", "error");
        }

    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="mb-3 text-center">Password Reset</h3>
                <form id="brokerForm" onSubmit={envioReset}>
                    <div className="mb-3">
                        <input type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Reset</button>
                </form>
                <Link to={'/principal'}>
                    ← Back to Home
                </Link>
            </div>
        </div>
    )
}

export default PasswordReset;