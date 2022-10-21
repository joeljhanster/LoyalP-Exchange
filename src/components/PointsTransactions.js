import React from "react";

const PointsTransactions = ({ transactions }) => {
	return (
		<div>
			<h3>
				All Points Transactions{" "}
				{transactions && `(${transactions.length})`}
			</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Member Address</th>
						<th>Transaction Type</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{transactions && transactions.length > 0 ? (
						transactions.map((transaction, idx) => {
							return (
								<tr key={idx}>
									<td>{idx}</td>
									<td>
										{transaction.memberAddress.slice(0, 15)}
										...
									</td>
									<td>{transaction.transactionType}</td>
									<td>{transaction.points}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={4}>No records found</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default PointsTransactions;
