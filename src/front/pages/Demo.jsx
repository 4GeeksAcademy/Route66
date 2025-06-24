// Import necessary components from react-router-dom and other parts of the application.
// import { Link } from "react-router-dom";
import { useState } from "react";


export const Demo = () => {
	// Access the global state and dispatch function using the useGlobalReducer hook.
	const [formulario, setFormulario] = useState({
		fullName: "",
		companyName: "",
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
	})

	function handleChange(e) {
		const { name, type, value, checked } = e.target;

		const newValue = type === "checkbox" ? checked : value
		setFormulario({
			...formulario,
			[name]: newValue,
		});
	}

	async function registerCarrier(formulario) {
	const transportType = formulario.isBoth
		? "both"
		: formulario.isOpen
		? "open"
		: formulario.isEnclose
		? "enclose"
		: null;

	const userData = {
		email: formulario.email,
		password: formulario.password,
		company_name: formulario.companyName,
		full_name: formulario.fullName,
		mc_number: formulario.numberMc,
		Usdot_number: formulario.numberUsdot,
		phone_number: formulario.phoneNumber,
		address: formulario.address,
		city: formulario.city,
		state: formulario.state,
		zip: formulario.zip,
		type_of_transport: transportType,
	};

	const url = 'https://potential-space-waddle-q749vqv57jr4hx7qg-3001.app.github.dev/signUp/register_carrier';

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		});

		const result = await response.json();

		if (response.ok) {
			console.log('Registro exitoso');
			return result;
		} else {
			console.error('Error en el registro:', result.msg);
			alert(`Error al registrar: ${result.msg}`);
			return null;
		}
	} catch (error) {
		console.error('Error de red o del servidor:', error);
		return null;
	}
}
console.log(registerCarrier(formulario))


	return (
		<div className="container text-center border border-secondary-subtle border-4 pt-4 mt-4 bg-white rounded-3" style={{ width: "40%", height: "100vh" }}>
			<div className="mb-2 fw-bold" id="titulo">
				CARRIER REGISTER
			</div>
			<form className="row g-3">
				<div className="col-md-6">
					<label htmlFor="inputName" className="form-label fw-bold text-primary-emphasis">Full Name</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputName"
						name="fullName"
						value={formulario.fullName}
						onChange={handleChange} />
				</div>
				<div className="col-md-6">
					<label htmlFor="inputCompany" className="form-label fw-bold text-primary-emphasis">Company Name</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputCompany"
						name="companyName"
						value={formulario.companyName}
						onChange={handleChange} />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputMc" className="form-label fw-bold text-primary-emphasis">MC</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputMc"
						name="numberMc"
						value={formulario.numberMc}
						onChange={handleChange} />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputUsdot" className="form-label fw-bold text-primary-emphasis">USDOT Number</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputUsdot"
						name="numberUsdot"
						value={formulario.numberUsdot}
						onChange={handleChange} />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputEmail4" className="form-label fw-bold text-primary-emphasis">Email</label>
					<input
						type="email"
						className="form-control border border-danger"
						id="inputEmail4"
						name="email"
						value={formulario.email}
						onChange={handleChange} />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputPassword4" className="form-label fw-bold text-primary-emphasis">Password</label>
					<input
						type="password"
						className="form-control border border-danger"
						id="inputPassword4"
						name="password"
						value={formulario.password}
						onChange={handleChange} />
				</div>

				<div className="col-4">
					<label htmlFor="inputAddress" className="form-label fw-bold text-primary-emphasis">Address</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputAddress"
						name="address"
						value={formulario.address}
						onChange={handleChange} />
				</div>

				<div className="col-md-4">
					<label htmlFor="inputCity" className="form-label fw-bold text-primary-emphasis">City</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputCity"
						name="city"
						value={formulario.city}
						onChange={handleChange} />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputState" className="form-label fw-bold text-primary-emphasis">State</label>
					<select
						id="inputState"
						className="form-select border border-danger"
						name="state"
						onChange={handleChange}
						value={formulario.state}>
						<option>Choose</option>
						<option>Alabama</option>
						<option>Arizona</option>
						<option>Arkansas</option>
						<option>California</option>
						<option>Colorado</option>
						<option>Delaware</option>
						<option>Florida</option>
						<option>Georgia</option>
						<option>Idaho</option>
						<option>Illinois</option>
						<option>Indiana</option>
						<option>Iowa</option>
						<option>Kansas</option>
						<option>Kentucky</option>
						<option>Maine</option>
						<option>Maryland</option>
						<option>Michigan</option>
						<option>Nevada</option>
						<option>New Jersey</option>
						<option>New Mexico</option>
						<option>New York</option>
						<option>Ohio</option>
						<option>Oklahoma</option>
						<option>Pennsilvanya</option>
						<option>South Carolina</option>
						<option>Tennessee</option>
						<option>Texas</option>
						<option>Utah</option>
						<option>Virginia</option>
						<option>Washington</option>
					</select>
				</div>
				<div className="col-md-4">
					<label htmlFor="inputZip" className="form-label fw-bold text-primary-emphasis">Zip</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputZip"
						name="zip"
						value={formulario.zip}
						onChange={handleChange} />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputTrucks" className="form-label fw-bold text-primary-emphasis">Number of trucks</label>
					<input
						type="text"
						className="form-control border border-danger"
						id="inputTrucks"
						name="trucks"
						value={formulario.trucks}
						onChange={handleChange} />
				</div>

				<div className="text-start" style={{ width: "50%" }}>
					<div className="fs-5 fw-bold text-primary-emphasis" >
						Tipe of transport?
					</div>
					<div className="col-2">
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								id="gridCheckOpen"
								name="isOpen"
								onChange={handleChange}
								checked={formulario.isOpen} />
							<label className="form-check-label text-primary-emphasis" htmlFor="gridCheckOpen">
								Open
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								id="gridCheckEnclose"
								name="isEnclose"
								onChange={handleChange}
								checked={formulario.isEnclose} />
							<label className="form-check-label text-primary-emphasis" htmlFor="gridCheckEnclose">
								Enclose
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								id="gridCheckBoth"
								name="isBoth"
								onChange={handleChange}
								checked={formulario.isBoth} />
							<label className="form-check-label text-primary-emphasis" htmlFor="gridCheckBoth">
								Both
							</label>
						</div>
					</div>
				</div>
				<div className="col-12">
					<button
						type="button"
						className="boton fs-4 rounded-3"
						style={{ width: "150px", height: "50px" }}
						onClick={() => registerCarrier(formulario)}> Get started</button>
				</div>
			</form >
		</div >
	)

};
