import React, { useState } from "react";

export const Footer = () => {

	const [showAboutUs, setShowAboutUs] = useState(false);
	const [showContactUs, setShowContactUs] = useState(false);
	const [showTerms, setShowTerms] = useState(false);


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
						<li><a className="text-decoration-none text-white" onClick={() => setShowAboutUs(true)} style={{ cursor: "pointer" }}>About Us</a></li>
						<li><a className="text-decoration-none text-white" onClick={() => setShowContactUs(true)} style={{ cursor: "pointer" }}>Contact</a></li>
						<li><a className="text-decoration-none text-white" onClick={() => setShowTerms(true)} style={{ cursor: "pointer" }}>Terms</a></li>
					</ul>
				</div>
			</div>

			<div style={{ backgroundColor: "#d32f2f" }} className="py-2 text-center">
				<small>&copy; {new Date().getFullYear()} Route66. All rights reserved.</small>
			</div>

			<div>

				{showAboutUs && (
					<div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
						<div className="modal-dialog" role="document">
							<div className="modal-content">

								<div className="modal-header" style={{ color: "#000000" }}>
									<h5 className="modal-title">🛣️ About Us – Routu66</h5>
									<button type="button" className="close" onClick={() => setShowAboutUs(false)} aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div className="modal-body" style={{ color: "#000000" }}>

									<div className="container py-5">
										<div className="mb-4">
											<h4>Who We Are</h4>
											<p>
												We are a digital platform dedicated to optimizing freight transportation by road across the United States.
												Inspired by the legendary Route 66, we connect carriers and brokers quickly, safely, and efficiently.
											</p>
										</div>

										<div className="mb-4">
											<h4>Our Mission</h4>
											<p>
												To modernize and simplify the shipping and receiving process, providing a seamless experience for both carriers and logistics intermediaries.
											</p>
										</div>

										<div className="mb-4">
											<h4>Our Vision</h4>
											<p>
												To become the leading platform in the transportation industry, taking efficiency and transparency to the next level.
											</p>
										</div>
									</div>
								</div>

								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" onClick={() => setShowAboutUs(false)}>
										Close
									</button>
								</div>

							</div>
						</div>
					</div>
				)}
			</div>

			<div>

				{showContactUs && (
					<div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
						<div className="modal-dialog" role="document">
							<div className="modal-content">

								<div className="modal-header" style={{ color: "#000000" }}>
									<h5 className="modal-title">📬 Contact Us – Routu66</h5>
									<button type="button" className="close" onClick={() => setShowContactUs(false)} aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div className="modal-body" style={{ color: "#000000" }}>

									<div className="container py-5">
										<p className="text-center mb-5">
											We’re here to help! <br />
											Have questions, suggestions, or need support? Reach out to us anytime — our team is ready to assist you.
										</p>

										<hr className="mb-5" />

										<div className="row">
											<div className="col-md-4 mb-4">
												<h5>📞 Phone</h5>
												<p className="mb-1">+1 (800) 123-4567</p>
												<small>(Monday to Friday, 9 AM – 6 PM EST)</small>
											</div>

											<div className="col-md-4 mb-4">
												<h5>📧 Email</h5>
												<p className="mb-1">support@routu66.com</p>
												<small>For general inquiries, feedback, or technical support.</small>
											</div>

											<div className="col-md-4 mb-4">
												<h5>📍 Head Office</h5>
												<p className="mb-0">Routu66 Logistics</p>
												<p className="mb-0">123 Freight Road</p>
												<p className="mb-0">Chicago, IL 60666</p>
												<p>United States</p>
											</div>
										</div>
									</div>
								</div>

								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" onClick={() => setShowContactUs(false)}>
										Close
									</button>
								</div>

							</div>
						</div>
					</div>
				)}
			</div>

			<div>

				{showTerms && (
					<div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
						<div className="modal-dialog" role="document">
							<div className="modal-content">

								<div className="modal-header" style={{ color: "#000000" }}>
									<h5 className="modal-title">📄 Terms & Conditions – Route66</h5>
									<button type="button" className="close" onClick={() => setShowTerms(false)} aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div className="modal-body" style={{ color: "#000000" }}>


									<div className="container py-5">
										<p className="text-muted text-center mb-4">Effective Date: <strong>[Insert Date]</strong></p>

										<p>
											By accessing or using Routu66, you agree to be bound by the following terms and conditions. Please read them carefully.
										</p>

										<hr className="my-4" />

										<div className="mb-4">
											<h5>1. Use of the Platform</h5>
											<p>
												Routu66 provides a logistics platform for carriers and brokers to post, manage, and request freight loads. You agree to use the platform for lawful purposes only.
											</p>
										</div>

										<div className="mb-4">
											<h5>2. User Accounts</h5>
											<p>
												You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate and up-to-date information when registering.
											</p>
										</div>

										<div className="mb-4">
											<h5>3. Prohibited Activities</h5>
											<ul>
												<li>Misrepresent your identity or company information</li>
												<li>Post fraudulent or misleading loads</li>
												<li>Interfere with the security or functionality of the platform</li>
												<li>Use the service for illegal or unauthorized purposes</li>
											</ul>
										</div>

										<div className="mb-4">
											<h5>4. Data and Privacy</h5>
											<p>
												We respect your privacy. Your information is collected and handled in accordance with our <a href="#">Privacy Policy</a>.
											</p>
										</div>

										<div className="mb-4">
											<h5>5. Liability Disclaimer</h5>
											<p>
												Routu66 acts as a technology platform and is not responsible for the actual transport, delivery, or payment between carriers and brokers.
											</p>
										</div>

										<div className="mb-4">
											<h5>6. Modifications</h5>
											<p>
												We may update these terms at any time. Continued use of the platform after changes means you accept the updated terms.
											</p>
										</div>

										<div className="mb-4">
											<h5>7. Termination</h5>
											<p>
												We reserve the right to suspend or terminate your account if you violate these terms.
											</p>
										</div>

										<div className="mb-4">
											<h5>8. Governing Law</h5>
											<p>
												These terms are governed by the laws of the State of Florida, USA.
											</p>
										</div>

										<hr className="my-5" />

										<h5>📫 Questions?</h5>
										<p>
											If you have any questions about our Terms & Conditions, please contact us at:<br />
											<a href="mailto:legal@route66.com">legal@route66.com</a>
										</p>
									</div>
								</div>

								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" onClick={() => setShowTerms(false)}>
										Close
									</button>
								</div>

							</div>
						</div>
					</div>
				)}
			</div>
		</footer >
	);
};