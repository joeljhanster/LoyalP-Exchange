import React from "react";

const AllExchangeMembers = ({ allMemberDetails }) => {
	return (
		<div>
			<h3>All Exchange Members ({allMemberDetails.length})</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Member Address</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>No. of Programs Joined</th>
					</tr>
				</thead>
				<tbody>
					{allMemberDetails && allMemberDetails.length > 0 ? (
						allMemberDetails.map((details, idx) => {
							return (
								<tr key={details.address}>
									<td>{idx}</td>
									<td>
										{details.memberAddress.slice(0, 15)}...
									</td>
									<td>{details.firstName}</td>
									<td>{details.lastName}</td>
									<td>{details.programsLength}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={5}>No records found</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AllExchangeMembers;
