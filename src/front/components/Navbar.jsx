import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light border-bottom border-primary border-4">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src="co"/>
					</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};