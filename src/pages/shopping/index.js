import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../../context/LoyalPApp";
import Layout from "../../components/Layout";
import MyPoints from "../../components/MyPoints";
import ProgramItemList from "../../components/ProgramItemList";

const Shopping = () => {
	const { programPoints } = useContext(LoyaltyExchangeContext);

	return (
		<Layout>
			<Grid>
				<Grid.Row columns={1}>
					<Grid.Column>
						<MyPoints programPoints={programPoints} />
					</Grid.Column>
				</Grid.Row>
				{programPoints.map(points => {
					return (
						<Grid.Row key={points.programAddress} columns={1}>
							<Grid.Column>
								<ProgramItemList points={points} />
							</Grid.Column>
						</Grid.Row>
					);
				})}
			</Grid>
		</Layout>
	);
};

export default Shopping;
