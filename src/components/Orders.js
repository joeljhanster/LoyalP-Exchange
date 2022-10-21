import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "semantic-ui-react";

// INTERNAL IMPORT
import { orderItems } from "../context/constants";
import { LoyaltyExchangeContext } from "../context/LoyalPApp";
import IssuePointsModal from "../components/IssuePointsModal";

const Orders = () => {
	const {
		currentAccount,
		getExchangePartner,
		issuePoints,
		isRegisteredPartner
	} = useContext(LoyaltyExchangeContext);
	const [openIssue, setOpenIssue] = useState(false);
	const [orders, setOrders] = useState([]);
	const [item, setItem] = useState({});

	const router = useRouter();

	useEffect(() => {
		if (currentAccount && isRegisteredPartner) {
			getExchangePartner(currentAccount).then(async partnerContract => {
				const originPartnerName = await partnerContract.originPartnerName();
				setOrders(orderItems[originPartnerName.toUpperCase()]);
			});
		} else {
			router.push("/");
		}
	}, [currentAccount]);

	return (
		<div>
			<IssuePointsModal
				open={openIssue}
				setOpen={setOpenIssue}
				item={item}
			/>
			<h3>All Orders ({orders.length})</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Member Address</th>
						<th>Item Name</th>
						<th>Type</th>
						<th>Price (in USD)</th>
						<th>Points to Issue</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{orders && orders.length > 0 ? (
						orders.map((order, idx) => {
							return (
								<tr key={idx}>
									<td>{idx}</td>
									<td>
										{order.memberAddress.slice(0, 15)}...
									</td>
									<td>{order.header}</td>
									<td>{order.meta}</td>
									<td>{order.price}</td>
									<td>{order.points}</td>
									<td>
										<Button
											primary
											onClick={async () => {
												await issuePoints(
													order.points,
													order.memberAddress
												);
												setItem(order);
												setOpenIssue(true);
											}}
										>
											Issue Points
										</Button>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={7}>No records found</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Orders;
