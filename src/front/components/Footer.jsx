import React from "react";

export const Footer = () => {
	return (
		<footer className="mt-auto text-white" style={{ backgroundColor: "#0E397F" }}>
			<div className="container py-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
				<div className="text-center text-md-start">
					<h5 className="fw-bold mb-2" style={{ color: "#ffffff" }}>Route66 Logistics</h5>
					<p className="mb-0" style={{ color: "#ffffff" }}>
						Safe, reliable, and efficient transport solutions across the United States.
					</p>
				</div>

				<div className="text-center mt-3 mt-md-0">
					<ul className="list-unstyled d-flex justify-content-center gap-3 mb-0">
						<li><a href="/about" className="text-decoration-none text-white">About Us</a></li>
						<li><a href="/contact" className="text-decoration-none text-white">Contact</a></li>
						<li><a href="/terms" className="text-decoration-none text-white">Terms</a></li>
					</ul>
				</div>
			</div>

			<div style={{ backgroundColor: "#d32f2f" }} className="py-2 text-center">
				<small>&copy; {new Date().getFullYear()} Route66. All rights reserved.</small>
			</div>
		</footer>
	);
};