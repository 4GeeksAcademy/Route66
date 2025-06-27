// Import necessary components from react-router-dom and other parts of the application.
//import { Link } from "react-router-dom";
import { useState } from "react";


const backendUrl = import.meta.env.VITE_BACKEND_URL

export const LoadRegister = () => {

	const initialForm = {
		year: "",
		make: "",
		model: "",
		pickupLocation: "",
		deliveryLocation: "",
		payment: "",
		daysToDeliver: "",
		status:""
	}

	const [form, setForm] = useState(initialForm)

	function handleChange(e) {
		const { name, value } = e.target;

		setForm((prevForm) => ({
			...prevForm,
			[name]: value,
		}));
	}


	async function registerLoad(form) {
		const token = localStorage.getItem("token");

		const userData = {
			vehicle_year: form.year,
			vehicle_make: form.make,
			vehicle_model: form.model,
			pickup_location: form.pickupLocation,
			delivery_location: form.deliveryLocation,
			payment: form.payment,
			days_to_deliver: form.daysToDeliver,
			status: form.status
		};
		console.log(userData);
		try {
			const response = await fetch(`${backendUrl}/api/load_register`,{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(userData),
			});

			const result = await response.json();

			if (response.ok) {
				console.log('Registro de carga exitoso');

				setForm(initialForm);

				return result;
			} else {
				console.error('Error en el registro de carga:', result.msg);
				alert(`Error al registrar carga: ${result.msg}`);
				return null;
			}
		} catch (error) {
			console.error('Error de red o del servidor:', error);
			return null;
		}
	}


	return (
		<div>
			<div className="container text-center border-4 pt-4 mt-4 rounded-3 fs-5" id="formulario" style={{ width: "75%", height: "65%" }}>

				<div className="mb-3 fw-bold border-bottom border-danger border-3" id="titulo">
					LOAD REGISTER
				</div>

				<form className="row g-3">
					<div className="col-md-4">
						<label htmlFor="inputYear" className="form-label text-light">Vehicle Year</label>
						<input
							type="text"
							className="form-control shadow-sm"
							id="inputYear"
							name="year"
							value={form.year}
							onChange={handleChange} />
					</div>
					<div className="col-md-4">
						<label htmlFor="inputMake" className="form-label text-light">Vehicle Make</label>
						<input
							type="text"
							className="form-control shadow-sm"
							id="inputMake"
							name="make"
							value={form.make}
							onChange={handleChange} />
					</div>
					<div className="col-md-4">
						<label htmlFor="inputModel" className="form-label text-light">Vehicle Model</label>
						<input
							type="text"
							className="form-control shadow-sm"
							id="inputModel"
							name="model"
							value={form.model}
							onChange={handleChange} />
					</div>

					<div className="col-md-6">
						<label htmlFor="inputPk" className="form-label text-light">Pickup Location</label>
						<input
							type="text"
							className="form-control shadow-sm"
							id="inputPk"
							name="pickupLocation"
							value={form.pickupLocation}
							onChange={handleChange} />
					</div>
					<div className="col-md-6">
						<label htmlFor="inputDelivery" className="form-label text-light">Delivery Location</label>
						<input
							type="text"
							className="form-control shadow-sm"
							id="inputDelivery"
							name="deliveryLocation"
							value={form.deliveryLocation}
							onChange={handleChange} />
					</div>
					<div className="col-md-6">
						<label htmlFor="inputPayment" className="form-label text-light">Payment</label>
						<input
							type="text"
							className="form-control shadow-sm"
							id="inputPayment"
							name="payment"
							value={form.payment}
							onChange={handleChange} />
					</div>
					<div className="col-md-6">
						<label htmlFor="inputDtd" className="form-label text-light">Days to delivery</label>
						<input
							type="text"
							className="form-control shadow-sm"
							id="inputDtd"
							name="daysToDeliver"
							value={form.daysToDeliver}
							onChange={handleChange} />
					</div>


					<div className="col-12">
						<button
							type="button"
							className="btn btn-primary btn-lg fw-bold px-5"
							style={{ width: "200px", height: "70px" }}
							onClick={() => registerLoad(form)}>Created Order</button>
					</div>
				</form >
			</div >
		</div>
	);
};
