import { useState } from "react";
import { useSearchParams } from "react-router-dom";

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
      <div className="fs-5 text-light">Type of transport?</div>
      <div className="col-2">
        {['Open', 'Enclose', 'Both'].map(type => (
          <div className="form-check" key={type}>
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
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role") || "carrier";
  const [role, setRole] = useState(roleFromUrl);

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

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormulario(prev => ({ ...prev, [name]: newValue }));
  }

  async function registerCarrier(data) {
    const transportType = data.isBoth ? "both" : data.isOpen ? "open" : data.isEnclose ? "enclose" : null;
    const userData = {
      email: data.email,
      password: data.password,
      company_name: data.companyName,
      full_name: data.fullName,
      mc_number: data.mcNumber,
      usdot_number: data.usdotNumber,
      phone_number: data.phoneNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      type_of_transport: transportType,
      role: role
    };

    try {
      const res = await fetch(`${backendUrl}/api/signup/carrier`, {
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
        console.log('Registro exitoso');
        setFormulario(initialFormState);
        return result;
      } else {
        alert(`Error al registrar: ${result.msg}`);
        return null;
      }
    } catch (err) {
      console.error('Error de red o servidor:', err);
      return null;
    }
  }

  async function registerBroker(data) {
  const userData = {
    email: data.email,
    password: data.password,
    company_name: data.companyName,
    full_name: data.fullName,
    mc_number: data.numberMc,
    phone_number: data.phoneNumber,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    role: role
  };

  try {
    const res = await fetch(`${backendUrl}/api/signup/broker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    if (res.ok) {
      console.log('Registro de broker exitoso');
      setFormulario(initialFormState);
      return result;
    } else {
      alert(`Error al registrar broker: ${result.msg}`);
      return null;
    }
  } catch (err) {
    console.error('Error de red o servidor (broker):', err);
    return null;
  }
}


  return (
    <div id="formulario" className="container border border-2 rounded-4 p-4 mt-5" style={{ width: "40%", height: "70%" }} >
      <div className="mb-2 fw-bold border-bottom border-danger border-3" id="titulo">REGISTER</div>
      <form className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor="inputName" className="form-label text-light">Full Name</label>
          <input type="text" className="form-control shadow-sm" id="inputName" name="fullName" value={formulario.fullName} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputCompany" className="form-label text-light">Company Name</label>
          <input type="text" className="form-control shadow-sm" id="inputCompany" name="companyName" value={formulario.companyName} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputPhoneNumber" className="form-label text-light">Phone Number</label>
          <input type="text" className="form-control shadow-sm" id="inputPhoneNumber" name="phoneNumber" value={formulario.phoneNumber} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputMc" className="form-label text-light">MC</label>
          <input type="text" className="form-control shadow-sm" id="inputMc" name="numberMc" value={formulario.numberMc} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputEmail4" className="form-label text-light">Email</label>
          <input type="email" className="form-control shadow-sm" id="inputEmail4" name="email" value={formulario.email} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputPassword4" className="form-label text-light">Password</label>
          <input type="password" className="form-control shadow-sm" id="inputPassword4" name="password" value={formulario.password} onChange={handleChange} />
        </div>
        <div className="col-4">
          <label htmlFor="inputAddress" className="form-label text-light">Address</label>
          <input type="text" className="form-control shadow-sm" id="inputAddress" name="address" value={formulario.address} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputCity" className="form-label text-light">City</label>
          <input type="text" className="form-control shadow-sm" id="inputCity" name="city" value={formulario.city} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputState" className="form-label text-light">State</label>
          <select id="inputState" className="form-control shadow-sm" name="state" value={formulario.state} onChange={handleChange}>
            <option>Choose</option>
            {['Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Delaware', 'Florida', 'Georgia', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Maine', 'Maryland', 'Michigan', 'Nevada', 'New Jersey', 'New Mexico', 'New York', 'Ohio', 'Oklahoma', 'Pennsilvanya', 'South Carolina', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Washington'].map(state => (
              <option key={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="inputZip" className="form-label text-light">Zip</label>
          <input type="text" className="form-control shadow-sm" id="inputZip" name="zip" value={formulario.zip} onChange={handleChange} />
        </div>

        {role === "carrier" && <InputsSoloParaCarriers formulario={formulario} handleChange={handleChange} />}

        <div className="col-12">
          <button type="button" className="btn btn-primary btn-lg fw-bold px-5" onClick={() => {
            if (role === "carrier") {
              registerCarrier(formulario);
            } else {
              registerBroker(formulario);
            }
          }}
          >
            Get Started
          </button>
        </div>
      </form>
    </div>
  );
};
