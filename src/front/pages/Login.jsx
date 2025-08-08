import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import rutaCamiones from '../assets/img/camiones.jpg';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const envioLogin = async (event) => {
        event.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");
        try {
            const response = await fetch(`${backendUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.exitoso) {
                localStorage.setItem("User", JSON.stringify(data.user));
                localStorage.setItem("TOKEN", data.access_token);
                Swal.fire({
                    title: '¡Welcome!',
                    text: data.mensaje,
                    icon: 'success',
                    confirmButtonText: 'Accept'
                }).then(() => data.user.role === 'carrier' ? navigate("/loadsboard") : navigate("/myloads"));
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.mensaje,
                    icon: 'error',
                    confirmButtonText: 'Accept'
                });
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            Swal.fire("Oops!", "Server error", error);
        }
    };

    return (
        <div className="container-fluid bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '79.2vh' }}>
            <div className="row shadow-lg bg-white rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
                <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0">
                    <img
                        src={rutaCamiones}
                        alt="Camiones"
                        className="img-fluid"
                        style={{ height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className="col-md-6 p-5">
                    <h2 className="mb-4 text-center text-primary fw-bold">Login</h2>
                    <form onSubmit={envioLogin}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-danger w-100 fw-bold mb-2">
                            Log In
                        </button>
                        <div>
                            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        const backendUrl = import.meta.env.VITE_BACKEND_URL;
                                        const token = credentialResponse.credential;
                                        const response = await fetch(`${backendUrl}/api/social-login/google`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ token })
                                        });
                                        const data = await response.json();
                                        if (data.msg === "New user created" || data.msg === "User logged in successfully, please complete your profile") {
                                            localStorage.setItem("User", JSON.stringify(data.user));
                                            Swal.fire({
                                                title: '¡Welcome!',
                                                text: data.msg,
                                                icon: 'success',
                                                confirmButtonText: 'Accept'
                                            }).then(() => navigate(`/myprofile/${data.user.id}`));
                                            return;
                                        } else if (data.msg === "User logged in successfully") {
                                            localStorage.setItem("User", JSON.stringify(data.user));
                                            localStorage.setItem("TOKEN", data.access_token);
                                            Swal.fire({
                                                title: '¡Welcome!',
                                                text: data.msg,
                                                icon: 'success',
                                                confirmButtonText: 'Accept'
                                            }).then(() => data.user.role === 'carrier' ? navigate("/loadsboard") : navigate("/myloads"));
                                        }

                                    }}
                                    onError={() => {
                                        console.log("Login Failed");
                                    }}
                                />
                            </GoogleOAuthProvider>
                        </div>
                    </form>
                    <div className="mt-4 d-flex justify-content-between">
                        <Link to="/" className="text-decoration-none text-muted">
                            ← Back to Home
                        </Link>
                        <Link to="/passwordReset" className="text-decoration-none text-muted" onClick={(e) => e.preventDefault()}>
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;