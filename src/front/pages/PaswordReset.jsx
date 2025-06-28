import { useState } from "react";
import { Link } from "react-router-dom";

const PasswordReset = () => {


    const [email, setEmail] = useState('');



    const envioReset = (event) => {
        event.preventDefault();




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