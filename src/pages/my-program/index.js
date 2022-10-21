import React, { useContext, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../../context/LoyalPApp";
import Layout from "../../components/layout";
import ProgramSummary from "../../components/ProgramSummary";
import Orders from "../../components/Orders";
import PointsTransactions from "../../components/PointsTransactions";
import ProgramMembers from "../../components/ProgramMembers";

const MyProgram = () => {
	const {
		currentAccount,
		getLoyaltyProgram,
		getLoyaltyProgramDetails
	} = useContext(LoyaltyExchangeContext);
	const [program, setProgram] = useState({});

	useEffect(() => {
		if (currentAccount) {
			getLoyaltyProgram(currentAccount).then(async programContract => {
				const programDetails = await getLoyaltyProgramDetails(
					programContract
				);
				setProgram(programDetails);
			});
		}
	}, [currentAccount]);

	return (
		<Layout>
			<Grid>
				<Grid.Row columns={1}>
					<Grid.Column>
						<ProgramSummary program={program} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={1}>
					<Grid.Column>
						<Orders />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={2}>
					<Grid.Column>
						<PointsTransactions
							transactions={program.transactions}
						/>
					</Grid.Column>
					<Grid.Column>
						<ProgramMembers members={program.members} />
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};

export default MyProgram;
