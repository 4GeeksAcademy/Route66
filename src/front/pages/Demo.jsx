// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.

export const Demo = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  return (
    <div className="container text-center border border-secondary-subtle border-4 pt-4 mt-4 bg-white rounded-3" style={{width:"40%", height: "100vh" }}>
			<div className="mb-2 fw-bold" id="titulo">
        CARRIER REGISTER
      </div>
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
						<option selected>Choose</option>
						<option>Alabama</option>
						<option>Arizona</option>
						<option>Arkansas</option>
						<option>California</option>
						<option>Colorado</option>
						<option>Delawere</option>
						<option>Florida</option>
						<option>Georgia</option>
						<option>Idaho</option>
						<option>Illinois</option>
						<option>Indiana</option>
						<option>Iowa</option>
						<option>Kansas</option>
						<option>Kentuchy</option>
						<option>Maine</option>
						<option>Maryland</option>
						<option>Michigan</option>
						<option>Nevada</option>
						<option>New Hersey</option>
						<option>New México</option>
						<option>Nueva York</option>
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
 
};
