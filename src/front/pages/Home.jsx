import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	// const { store, dispatch } = useGlobalReducer()

	// const loadMessage = async () => {
	// 	try {
	// 		const backendUrl = import.meta.env.VITE_BACKEND_URL

	// 		if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

	// 		const response = await fetch(backendUrl + "/api/hello")
	// 		const data = await response.json()

	// 		if (response.ok) dispatch({ type: "set_hello", payload: data.message })

	// 		return data

	// 	} catch (error) {
	// 		if (error.message) throw new Error(
	// 			`Could not fetch the message from the backend.
	// 			Please check if the backend is running and the backend port is public.`
	// 		);
	// 	}

	// }

	// useEffect(() => {
	// 	loadMessage()
	// }, [])

	return (
		<div className="container text-center border border-secondary-subtle pt-4 mt-4 bg-light rounded-3" style={{width:"40%", height: "100vh" }}>
			<form className="row g-3">
				<div className="col-md-6">
					<label htmlhtmlFor="inputName" className="form-label fw-bold text-primary-emphasis">Full Name</label>
					<input type="text" className="form-control border border-danger" id="inputName" />
				</div>
				<div className="col-md-6">
					<label htmlhtmlFor="inputCompany" className="form-label fw-bold text-primary-emphasis">Company Name</label>
					<input type="text" className="form-control border border-danger" id="inputCompany" />
				</div>
				<div className="col-md-4">
					<label htmlhtmlFor="inputMc" className="form-label fw-bold text-primary-emphasis">MC/USDOT Number</label>
					<input type="text" className="form-control border border-danger" id="inputMc" />
				</div>
				<div className="col-md-4">
					<label htmlhtmlFor="inputEmail4" className="form-label fw-bold text-primary-emphasis">Email</label>
					<input type="email" className="form-control border border-danger" id="inputEmail4" />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputPassword4" className="form-label fw-bold text-primary-emphasis">Password</label>
					<input type="password" className="form-control border border-danger" id="inputPassword4" />
				</div>

				<div className="col-6">
					<label htmlFor="inputAddress" className="form-label fw-bold text-primary-emphasis">Address</label>
					<input type="text" className="form-control border border-danger" id="inputAddress" placeholder="1234 Main St" />
				</div>

				<div className="col-md-6">
					<label htmlFor="inputCity" className="form-label fw-bold text-primary-emphasis">City</label>
					<input type="text" className="form-control border border-danger" id="inputCity" />
				</div>
				<div className="col-md-4">
					<label htmlFor="inputState" className="form-label fw-bold text-primary-emphasis">State</label>
					<select id="inputState" className="form-select border border-danger">
						<option selected>Choose...</option>
						<option>...</option>
					</select>
				</div>
				<div className="col-md-4">
					<label htmlFor="inputZip" className="form-label fw-bold text-primary-emphasis">Zip</label>
					<input type="text" className="form-control border border-danger" id="inputZip" />
				</div>
				<div className="col-md-4">
					<label htmlhtmlFor="inputMc" className="form-label fw-bold text-primary-emphasis">Number of trucks</label>
					<input type="text" className="form-control border border-danger" id="inputMc" />
				</div>
                
				<div className="text-start" style={{width:"50%" }}>
					<div className="fs-5 fw-bold text-primary-emphasis" >
					Tipe of transport?
					</div>
				<div className="col-2">
					<div className="form-check">
						<input className="form-check-input" type="checkbox" id="gridCheck" />
						<label className="form-check-label text-primary-emphasis" htmlFor="gridCheck">
							Open
						</label>
					</div>
					<div className="form-check">
						<input className="form-check-input" type="checkbox" id="gridCheck" />
						<label className="form-check-label text-primary-emphasis" htmlFor="gridCheck">
							Enclose
						</label>
					</div>
					<div className="form-check">
						<input className="form-check-input" type="checkbox" id="gridCheck" />
						<label className="form-check-label text-primary-emphasis" htmlFor="gridCheck">
							Both
						</label>
					</div>
				</div>
				</div>
				<div className="col-12">
					<button type="submit" className="boton fs-4 rounded-3" style={{width:"150px", height: "50px" }}>Get started</button>
				</div>
			</form>
		</div>
	)
}



