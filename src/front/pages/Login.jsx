import { useState } from "react";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const envioLogin = (event) => {
        event.preventDefault(); // evita el comportamiento por defecto del navegador :contentReference[oaicite:2]{index=2}


        if (email === 'broker@demo.com' && password === '654321') {
            alert('Login exitoso como Broker');
            window.location.href = 'dashboard.html'; // redirige al dashboard
        } else {
            alert('Credenciales inválidas. Usa: broker@demo.com / 654321');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="mb-3 text-center">Broker Login</h3>
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
                <a href="index.html" className="btn btn-link mt-3">← Back to Home</a>
            </div>
        </div>
    );
}

export default Login;