import React from "react";

const ProgramSummary = ({ program }) => {
	return (
		<div>
			<h3>Program Summary</h3>
			<table className="ui celled table">
				<thead>
					<tr>
						<th>Company</th>
						<th>Program Name</th>
						<th>Redemption Rate</th>
						<th>Total Points Issued</th>
						<th>Total Points Redeemed</th>
						<th>Total Points</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{program.issuerName}</td>
						<td>{program.programName}</td>
						<td>
							{program.redemptionRate} point
							{program.redemptionRate > 1 && "(s)"} : 1 USD
						</td>
						<td>{program.totalPointsIssued}</td>
						<td>{program.totalPointsRedeemed}</td>
						<td>{program.totalPoints}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default ProgramSummary;
