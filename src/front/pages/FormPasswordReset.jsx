import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const FormPasswordReset = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const { emailEncrypt, userId } = useParams();
    const [isValid, setIsValid] = useState(false);



    const envioReset = (event) => {
        event.preventDefault();

        console.log(email);


    };




    useEffect(() => {
        const fetchData = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

            try {
                const response = await fetch(`${backendUrl}/api/checkPasswordResetEmail`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, emailEncrypt })
                });

                const data = await response.json();
                if (data.email != undefined) {
                    setEmail(data.email);
                    setIsValid(true);
                }

                console.log(data)
            } catch (error) {
                console.error("Error al enviar datos:", error);
                Swal.fire("Oops!", "Error en el servidor", "error");
            }
        }
        fetchData();
    }, [])

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="mb-3 text-center">Password Reset</h3>
                {
                    isValid ?
                        <form id="brokerForm" onSubmit={envioReset}>
                            <div className="mb-3">
                                <input type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled />


                            </div>
                            <div className="mb-3">
                                <input type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setconfirmPassword(e.target.value)} />
                            </div>


                            <button type="submit" className="btn btn-primary w-100">Reset</button>
                        </form>
                        :
                        <span>Cargando Informacion..</span>
                }


                <Link to={'/principal'}>
                    ← Back to Home
                </Link>
            </div>
        </div>
    )
}

export default FormPasswordReset;