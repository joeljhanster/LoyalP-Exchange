import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Button } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";

const PaymentTransactions = ({ header, transactions, action = false }) => {
	const { approvePaymentTransaction } = useContext(LoyaltyExchangeContext);
	const router = useRouter();

	return (
		<div>
			<h3>
				{header} ({transactions.length})
			</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>Transaction ID</th>
						<th>Payer Address</th>
						<th>Payee Address</th>
						<th>Amount Paid (in USD)</th>
						<th>Status</th>
						{action && <th>Action</th>}
					</tr>
				</thead>
				<tbody>
					{transactions && transactions.length > 0 ? (
						transactions.map(transaction => {
							return (
								<tr key={transaction.transactionId}>
									<td>{transaction.transactionId}</td>
									<td>
										{transaction.payerAddress.slice(0, 15)}
										...
									</td>
									<td>
										{transaction.payeeAddress.slice(0, 15)}
										...
									</td>
									<td>{transaction.amountPaid}</td>
									<td>
										{transaction.isApproved
											? "Approved"
											: "Pending Approval"}
									</td>
									{action && (
										<td>
											<Button
												primary
												size="tiny"
												onClick={async () => {
													await approvePaymentTransaction(
														transaction.transactionId
													);
													router.reload();
												}}
											>
												Approve
											</Button>
										</td>
									)}
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

export default PaymentTransactions;
