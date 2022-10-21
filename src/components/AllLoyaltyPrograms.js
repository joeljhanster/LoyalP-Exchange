import React, { useContext } from "react";
import { Button } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";

const AllLoyaltyPrograms = ({ allProgramDetails }) => {
	const {
		currentAccount,
		isRegisteredMember,
		joinLoyaltyProgram
	} = useContext(LoyaltyExchangeContext);

	return (
		<div>
			<h3>All Loyalty Programs ({allProgramDetails.length})</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Contract Address</th>
						<th>Company Name</th>
						<th>Program Name</th>
						<th>Redemption Rate (points/USD)</th>
						<th>No. of Members</th>
						<th>No. of Transactions</th>
						{isRegisteredMember ? <th>Action</th> : null}
					</tr>
				</thead>
				<tbody>
					{allProgramDetails && allProgramDetails.length > 0 ? (
						allProgramDetails.map((details, idx) => {
							return (
								<tr key={details.address}>
									<td>{idx}</td>
									<td>{details.address.slice(0, 15)}...</td>
									<td>{details.issuerName}</td>
									<td>{details.programName}</td>
									<td>{details.redemptionRate}</td>
									<td>{details.membersLength}</td>
									<td>{details.transactionsLength}</td>
									{isRegisteredMember ? (
										<td>
											{details.membersAddress.includes(
												currentAccount.toLowerCase()
											) ? (
												<Button secondary disabled>
													Joined
												</Button>
											) : (
												<Button
													primary
													onClick={() =>
														joinLoyaltyProgram(
															details.issuerAddress
														)
													}
												>
													Join
												</Button>
											)}
										</td>
									) : null}
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={8}>No records found</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AllLoyaltyPrograms;
