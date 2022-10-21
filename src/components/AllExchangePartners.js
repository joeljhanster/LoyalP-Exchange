import React from "react";

const AllExchangePartners = ({ allPartnerDetails }) => {
	return (
		<div>
			<h3>All Exchange Partners ({allPartnerDetails.length})</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Partner Address</th>
						<th>Partner Name</th>
						<th>No. of Partners</th>
					</tr>
				</thead>
				<tbody>
					{allPartnerDetails && allPartnerDetails.length > 0 ? (
						allPartnerDetails.map((details, idx) => {
							return (
								<tr key={details.address}>
									<td>{idx}</td>
									<td>
										{details.originAddress.slice(0, 15)}...
									</td>
									<td>{details.originPartnerName}</td>
									<td>{details.partnersLength}</td>
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

export default AllExchangePartners;
