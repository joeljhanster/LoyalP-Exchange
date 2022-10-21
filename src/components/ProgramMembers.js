import React from "react";

const ProgramMembers = ({ members }) => {
	return (
		<div>
			<h3>All Members {members && `(${members.length})`}</h3>
			<table className="ui selectable celled table">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Member Address</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{members && members.length > 0 ? (
						members.map((member, idx) => {
							return (
								<tr key={idx}>
									<td>{idx}</td>
									<td>
										{member.memberAddress.slice(0, 15)}...
									</td>
									<td>{member.firstName}</td>
									<td>{member.lastName}</td>
									<td>{member.points}</td>
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

export default ProgramMembers;
