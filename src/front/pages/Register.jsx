import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import rutaCamiones from '../assets/img/camiones.jpg';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const InputsSoloParaCarriers = ({ formulario, handleChange }) => (
  <>
    <div className="col-md-4">
      <label htmlFor="inputUsdot" className="form-label text-light">USDOT Number</label>
      <input
        type="text"
        className="form-control shadow-sm"
        id="inputUsdot"
        name="numberUsdot"
        value={formulario.numberUsdot}
        onChange={handleChange}
      />
    </div>
    <div className="col-md-4">
      <label htmlFor="inputTrucks" className="form-label text-light">Number of trucks</label>
      <input
        type="text"
        className="form-control shadow-sm"
        id="inputTrucks"
        name="trucks"
        value={formulario.trucks}
        onChange={handleChange}
      />
    </div>
    <div className="text-start" style={{ width: "50%" }}>
      <div className="fs-5 text-light border-bottom border-danger border-3 ">Type of transport?</div>
      <div className="col-2 d-flex inline-block" style={{ width: "150px" }}>
        {['Open', 'Enclose', 'Both'].map(type => (
          <div className="form-check ms-3 mt-3" key={type}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`gridCheck${type}`}
              name={`is${type}`}
              onChange={handleChange}
              checked={formulario[`is${type}`]}
            />
            <label className="form-check-label text-light" htmlFor={`gridCheck${type}`}>
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  </>
);

export const Register = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const initialFormState = {
    fullName: "",
    companyName: "",
    phoneNumber: "",
    numberMc: "",
    numberUsdot: "",
    email: "",
    password: "",
    address: "",
    city: "",
    zip: "",
    trucks: "",
    state: "",
    isOpen: false,
    isEnclose: false,
    isBoth: false,
  };

  const [formulario, setFormulario] = useState(initialFormState);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormulario(prev => ({ ...prev, [name]: newValue }));
  }

  async function handleRegister() {
    setLoading(true);
    const transportType = formulario.isBoth ? "both" : formulario.isOpen ? "open" : formulario.isEnclose ? "enclose" : null;
    const userData = {
      email: formulario.email,
      password: formulario.password,
      company_name: formulario.companyName,
      full_name: formulario.fullName,
      mc_number: formulario.numberMc,
      phone_number: formulario.phoneNumber,
      address: formulario.address,
      city: formulario.city,
      state: formulario.state,
      zip: formulario.zip,
      role: role
    };
    if (role === "carrier") {
      userData.usdot_number = formulario.numberUsdot;
      userData.type_of_transport = transportType;
    }

    try {
      const res = await fetch(`${backendUrl}/api/signup/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = { msg: "Error inesperado del servidor" };
      }
      if (res.ok) {
        setAlerta({ mensaje: `Registro de ${role} exitoso`, tipo: "success" });
        setFormulario(initialFormState);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setAlerta({ mensaje: `Error al registrar: ${result.msg}`, tipo: "danger" });
      }
    } catch (err) {
      setAlerta({ mensaje: "Error de red o servidor. Inténtalo más tarde.", tipo: "danger" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '79.2vh' }}>
      <div className="row shadow-lg bg-white rounded-4 overflow-hidden" style={{ maxWidth: '1200px', width: '100%' }}>
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0">
          <img
            src={rutaCamiones}
            alt="Camiones"
            className="img-fluid"
            style={{ height: '100%', objectFit: 'fill' }}
          />
        </div>

        <div className="col-md-6 p-4 bg-light text-white">
          {alerta.mensaje && (
            <div className={`alert alert-${alerta.tipo} fw-bold`} role="alert">
              {alerta.mensaje}
            </div>
          )}

          <div className="border border-2 rounded-4 p-4" style={{ background: '#0f2e43' }}>
            <div className="mb-2 fw-bold text-light border-bottom border-danger border-3 fs-4">Register</div>
            <form className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="inputName" className="form-label text-light">Full Name</label>
                <input type="text" className="form-control shadow-sm" id="inputName" name="fullName" value={formulario.fullName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputCompany" className="form-label text-light">Company Name</label>
                <input type="text" className="form-control shadow-sm" id="inputCompany" name="companyName" value={formulario.companyName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputPhoneNumber" className="form-label text-light">Phone Number</label>
                <input type="text" className="form-control shadow-sm" id="inputPhoneNumber" name="phoneNumber" value={formulario.phoneNumber} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputMc" className="form-label text-light">MC</label>
                <input type="text" className="form-control shadow-sm" id="inputMc" name="numberMc" value={formulario.numberMc} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputEmail4" className="form-label text-light">Email</label>
                <input type="email" className="form-control shadow-sm" id="inputEmail4" name="email" value={formulario.email} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputPassword4" className="form-label text-light">Password</label>
                <input type="password" className="form-control shadow-sm" id="inputPassword4" name="password" value={formulario.password} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputAddress" className="form-label text-light">Address</label>
                <input type="text" className="form-control shadow-sm" id="inputAddress" name="address" value={formulario.address} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputCity" className="form-label text-light">City</label>
                <input type="text" className="form-control shadow-sm" id="inputCity" name="city" value={formulario.city} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputState" className="form-label text-light">State</label>
                <select id="inputState" className="form-control shadow-sm" name="state" value={formulario.state} onChange={handleChange}>
                  <option>Choose</option>
                  {["Alabama", "Arizona", "Arkansas", "California", "Colorado", "Delaware", "Florida", "Georgia", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Maine", "Maryland", "Michigan", "Nevada", "New Jersey", "New Mexico", "New York", "Ohio", "Oklahoma", "Pennsilvanya", "South Carolina", "Tennessee", "Texas", "Utah", "Virginia", "Washington"].map(state => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="inputZip" className="form-label text-light">Zip</label>
                <input type="text" className="form-control shadow-sm" id="inputZip" name="zip" value={formulario.zip} onChange={handleChange} />
              </div>

              {role === "carrier" && <InputsSoloParaCarriers formulario={formulario} handleChange={handleChange} />}

              <div className="col-12 text-center mt-3">
                <button
                  type="button"
                  className="btn btn-danger btn-lg fw-bold px-5"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Get Started'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
