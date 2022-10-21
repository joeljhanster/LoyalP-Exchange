import React, { useContext, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";
import PaymentModal from "../components/PaymentModal";

const Partnerships = () => {
	const {
		currentAccount,
		getExchangePartner,
		getExchangePartnerDetails
	} = useContext(LoyaltyExchangeContext);
	const [partnerships, setPartnerships] = useState([]);
	const [partnership, setPartnership] = useState({});
	const [originProgramName, setOriginProgramName] = useState("");
	const [openPayment, setOpenPayment] = useState(false);

	useEffect(() => {
		getExchangePartner(currentAccount)
			.then(partner => {
				partner
					.originProgramName()
					.then(name => setOriginProgramName(name));
				getExchangePartnerDetails(partner).then(details => {
					setPartnerships(details.partnerships);
				});
			})
			.catch(error => console.log(error));
	}, [currentAccount]);

	return (
		<div>
			{openPayment && (
				<PaymentModal
					open={openPayment}
					setOpen={setOpenPayment}
					partnership={partnership}
				/>
			)}
			<h3>My Partnerships</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Partner Address</th>
						<th>Partner Name</th>
						<th>Origin Points Issued</th>
						<th>Destination Points Issued</th>
						<th>Amount Due (in USD)</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{partnerships && partnerships.length > 0 ? (
						partnerships.map((partnership, idx) => {
							return (
								<tr key={partnership.destAddress}>
									<td>{idx}</td>
									<td>
										{partnership.destAddress.slice(0, 15)}
										...
									</td>
									<td>{partnership.destPartnerName}</td>
									<td>
										{partnership.originPoints}{" "}
										{originProgramName}
									</td>
									<td>
										{partnership.destPoints}{" "}
										{partnership.destProgramName}
									</td>
									<td>{partnership.amountDue}</td>
									<td>
										{partnership.amountDue > 0 && (
											<Button
												primary
												size="tiny"
												onClick={() => {
													setPartnership(partnership);
													setOpenPayment(true);
												}}
											>
												Make payment
											</Button>
										)}
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={6}>No records found</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Partnerships;
