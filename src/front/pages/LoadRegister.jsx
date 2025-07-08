import { useState } from "react";
import Swal from 'sweetalert2';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const LoadRegister = ({ onClose, onNewLoadCreated }) => {
	const initialForm = {
		year: "",
		make: "",
		model: "",
		pickupLocation: "",
		deliveryLocation: "",
		payment: "",
		daysToDeliver: "",
	};

	const [form, setForm] = useState(initialForm);

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	async function registerLoad(form) {
		const token = localStorage.getItem("TOKEN");

		const userData = {
			vehicle_year: form.year,
			vehicle_make: form.make,
			vehicle_model: form.model,
			pickup_location: form.pickupLocation,
			delivery_location: form.deliveryLocation,
			payment: form.payment,
			days_to_deliver: form.daysToDeliver,
			status: "Pending"
		};

		try {
			const response = await fetch(`${backendUrl}/api/load_register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(userData),
			});

			const result = await response.json();

			if (response.ok) {
				Swal.fire({
					title: 'Load Sent!',
					text: 'Your load has been submitted.',
					icon: 'success',
					confirmButtonText: 'Great',
				});
				setForm(initialForm);
				
				onNewLoadCreated(result.new_load);
				onClose();

				return;
			} else {
				Swal.fire({
					title: 'ERROR!',
					text: result.msg || "Something went wrong.",
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			}
		} catch (error) {
			console.error('Network/server error:', error);
			Swal.fire({
				title: 'ERROR!',
				text: 'Server connection failed.',
				icon: 'error',
				confirmButtonText: 'Ok',
			});
		}
	}

	return (
		<div className="container d-flex justify-content-center align-items-center">
			<div className="col-lg-10 text-light p-5 rounded-4 shadow-lg" style={{ backgroundColor: '#0E397F' }}>
				<h2 className="text-center fw-bold mb-4 border-bottom border-danger pb-2">Load Register</h2>

				<form className="row g-4">
					<div className="col-md-4">
						<label htmlFor="inputYear" className="form-label">Vehicle Year</label>
						<input type="text" className="form-control shadow-sm" id="inputYear" name="year" value={form.year} onChange={handleChange} />
					</div>
					<div className="col-md-4">
						<label htmlFor="inputMake" className="form-label">Vehicle Make</label>
						<input type="text" className="form-control shadow-sm" id="inputMake" name="make" value={form.make} onChange={handleChange} />
					</div>
					<div className="col-md-4">
						<label htmlFor="inputModel" className="form-label">Vehicle Model</label>
						<input type="text" className="form-control shadow-sm" id="inputModel" name="model" value={form.model} onChange={handleChange} />
					</div>

					<div className="col-md-6">
						<label htmlFor="inputPickup" className="form-label">Pickup Location</label>
						<input type="text" className="form-control shadow-sm" id="inputPickup" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} />
					</div>
					<div className="col-md-6">
						<label htmlFor="inputDelivery" className="form-label">Delivery Location</label>
						<input type="text" className="form-control shadow-sm" id="inputDelivery" name="deliveryLocation" value={form.deliveryLocation} onChange={handleChange} />
					</div>

					<div className="col-md-6">
						<label htmlFor="inputPayment" className="form-label">Payment ($)</label>
						<input type="text" className="form-control shadow-sm" id="inputPayment" name="payment" value={form.payment} onChange={handleChange} />
					</div>
					<div className="col-md-6">
						<label htmlFor="inputDTD" className="form-label">Days to Deliver</label>
						<input type="text" className="form-control shadow-sm" id="inputDTD" name="daysToDeliver" value={form.daysToDeliver} onChange={handleChange} />
					</div>

					<div className="col-12 text-center mt-4">
						<button
							type="button"
							className="btn btn-danger btn-lg fw-bold px-5 py-2"
							onClick={() => registerLoad(form)}
						>
							Create Load
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};