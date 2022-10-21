import React, { useState } from "react";
import { Button, Card } from "semantic-ui-react";

// INTERNAL IMPORT
import ExchangePointsModal from "../components/ExchangePointsModal";

const MyPoints = ({ programPoints }) => {
	const [openExchange, setOpenExchange] = useState(false);
	const [points, setPoints] = useState({});

	return (
		<div>
			{openExchange && (
				<ExchangePointsModal
					open={openExchange}
					setOpen={setOpenExchange}
					points={points}
					programPoints={programPoints}
				/>
			)}
			<h3>My Points</h3>
			<Card.Group>
				{programPoints.map(points => {
					return (
						<Card key={points.programAddress}>
							<Card.Content>
								<Button
									primary
									basic
									floated="right"
									onClick={() => {
										setPoints(points);
										setOpenExchange(true);
									}}
								>
									Exchange
								</Button>
								<Card.Header>{points.programName}</Card.Header>
								<Card.Meta>{points.points} points</Card.Meta>
							</Card.Content>
						</Card>
					);
				})}
			</Card.Group>
		</div>
	);
};

export default MyPoints;
