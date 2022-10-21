import React from "react";

const ExchangeTransactions = ({ transactions }) => {
	return (
		<div>
			<h3>Exchange Transactions ({transactions.length})</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>Transaction ID</th>
						<th>Member Address</th>
						<th>Origin Address</th>
						<th>Destination Address</th>
						<th>Origin Points</th>
						<th>Destination Points</th>
					</tr>
				</thead>
				<tbody>
					{transactions && transactions.length > 0 ? (
						transactions.map(transaction => {
							return (
								<tr key={transaction.transactionId}>
									<td>{transaction.transactionId}</td>
									<td>
										{transaction.memberAddress.slice(0, 15)}
										...
									</td>
									<td>
										{transaction.originAddress.slice(0, 15)}
										...
									</td>
									<td>
										{transaction.destAddress.slice(0, 15)}
										...
									</td>
									<td>
										{transaction.originPoints}{" "}
										{transaction.originProgramName}
									</td>
									<td>
										{transaction.destPoints}{" "}
										{transaction.destProgramName}
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

export default ExchangeTransactions;
