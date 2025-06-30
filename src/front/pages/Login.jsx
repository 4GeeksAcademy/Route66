import { useState } from "react";
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from "react-router-dom"; 

const Login = () => {
    const navigate = useNavigate(); // 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const envioLogin = async (event) => { 
        event.preventDefault(); 

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) {
            console.error("VITE_BACKEND_URL is not defined in .env file");
            Swal.fire({
                title: 'Error de Configuración',
                text: 'La URL del backend no está definida. Por favor, contacta al administrador.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        console.log("URL del Backend:", backendUrl);

        let urlService = backendUrl + '/api/login';

        try { 
            const response = await fetch(urlService, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            let data;
            try {
                data = await response.json(); 
            } catch (jsonError) {
                console.error("Error al parsear JSON de la respuesta:", jsonError);
                Swal.fire({
                    title: 'Error de Servidor',
                    text: 'Respuesta inválida del servidor. Inténtalo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            console.log("Datos de respuesta del Backend:", data);

            if (response.ok && data.exitoso) { 
                localStorage.setItem("access_token", data.token);

                try {
                    const decodedToken = jwtDecode(data.token); 
                    const userRole = decodedToken.role; 
                    const userId = decodedToken.user_id || decodedToken.sub; 

                    console.log("Token decodificado (payload):", decodedToken);
                    console.log("Rol extraído:", userRole);
                    console.log("ID extraído:", userId);

                    Swal.fire({
                        title: '¡Bienvenido!',
                        text: data.mensaje || 'Inicio de sesión exitoso.',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false 
                    });

                    if (userRole === "broker") {
                        console.log(`Redirigiendo a /profile/broker/${userId}`);
                        navigate(`/profile/broker/${userId}`);
                    } else if (userRole === "carrier") {
                        console.log(`Redirigiendo a /profile/carrier/${userId}`);
                        navigate(`/profile/carrier/${userId}`);
                    } else {
                        
                        console.log("Rol desconocido, redirigiendo a /dashboard");
                        Swal.fire({
                            title: 'Rol Desconocido',
                            text: 'Tu rol de usuario no se reconoce para redireccionamiento específico.',
                            icon: 'info',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        navigate('/dashboard');
                    }
                    

                } catch (decodeError) {
                    console.error('Error al decodificar el token JWT o al extraer datos:', decodeError);
                    Swal.fire({
                        title: 'Error de Autenticación',
                        text: 'Ha ocurrido un problema al procesar tu sesión. Por favor, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }

            } else {
                
                Swal.fire({
                    title: 'Error de Login',
                    text: data.mensaje || 'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            
            console.error('Error al intentar iniciar sesión:', error);
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o intenta más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
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
                    <button type="submit" className="btn btn-primary w-100">
                        Log In
                    </button>
                </form>
                <div className="d-flex justify-content-between mt-3">
                    <Link to={'/principal'}>
                        ← Back to Home
                    </Link>
                    <Link to={'/passwordReset'}>
                        Forgot Password
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;