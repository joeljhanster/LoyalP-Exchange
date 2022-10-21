import React, { useContext, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../../context/LoyalPApp";
import Layout from "../../components/Layout";
import Partnerships from "../../components/Partnerships";
import PaymentTransactions from "../../components/PaymentTransactions";

const Transactions = () => {
	const { currentAccount, paymentTransactions } = useContext(
		LoyaltyExchangeContext
	);
	const [myPayments, setMyPayments] = useState([]);
	const [pendingApprovals, setPendingApprovals] = useState([]);
	const [completedTransactions, setCompletedTrnsactions] = useState([]);

	useEffect(() => {
		setMyPayments(
			paymentTransactions.filter(
				transaction =>
					transaction.payerAddress.toLowerCase() ===
						currentAccount.toLowerCase() && !transaction.isApproved
			)
		);

		setPendingApprovals(
			paymentTransactions.filter(
				transaction =>
					transaction.payeeAddress.toLowerCase() ===
						currentAccount.toLowerCase() && !transaction.isApproved
			)
		);

		setCompletedTrnsactions(
			paymentTransactions.filter(
				transaction =>
					(transaction.payerAddress.toLowerCase() ===
						currentAccount.toLowerCase() ||
						transaction.payeeAddress.toLowerCase() ===
							currentAccount.toLowerCase()) &&
					transaction.isApproved
			)
		);
	}, [currentAccount, paymentTransactions]);

	return (
		<Layout>
			<Grid>
				<Grid.Row>
					<Grid.Column>
						<Partnerships />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<PaymentTransactions
							header={"My Payments"}
							transactions={myPayments}
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<PaymentTransactions
							header={"Pending My Approvals"}
							transactions={pendingApprovals}
							action={true}
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<PaymentTransactions
							header={"Completed Transactions"}
							transactions={completedTransactions}
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};

export default Transactions;
