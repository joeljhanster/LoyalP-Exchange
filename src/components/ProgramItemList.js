import React, { useContext, useState } from "react";
import { Button, Card } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";
import { purchaseItems } from "../context/constants";
import SuccessPurchaseModal from "../components/SuccessPurchaseModal";
import RedeemPointsModal from "../components/RedeemPointsModal";

const ProgramItemList = ({ points }) => {
	const { redeemPoints } = useContext(LoyaltyExchangeContext);
	const [openSuccess, setOpenSuccess] = useState(false);
	const [openRedeem, setOpenRedeem] = useState(false);
	const [insufficient, setInsufficient] = useState(false);
	const [item, setItem] = useState({});

	return (
		<div>
			{openSuccess && (
				<SuccessPurchaseModal
					open={openSuccess}
					setOpen={setOpenSuccess}
					item={item}
				/>
			)}
			{openRedeem && (
				<RedeemPointsModal
					open={openRedeem}
					setOpen={setOpenRedeem}
					item={item}
					insufficient={insufficient}
				/>
			)}
			<h3>{points.programName}</h3>
			<Card.Group>
				{purchaseItems[points.programName].map((item, idx) => {
					return (
						<Card key={idx}>
							<Card.Content>
								<Card.Header>{item.header}</Card.Header>
								<Card.Meta>{item.meta}</Card.Meta>
								<Card.Description>
									{item.description}
								</Card.Description>
							</Card.Content>
							<Card.Content>
								<div className="ui two buttons">
									<Button
										basic
										color="blue"
										onClick={() => {
											setItem(item);
											setOpenSuccess(true);
										}}
									>
										Purchase for USD {item.price}
									</Button>
									<Button
										color="blue"
										onClick={async () => {
											await redeemPoints(
												parseInt(
													item.price * item.rate
												),
												points.programAddress
											);
											setItem(item);
											setInsufficient(
												item.price * item.rate >
													points.points
											);
											setOpenRedeem(true);
										}}
									>
										Redeem for{" "}
										{parseInt(item.price * item.rate)}{" "}
										points
									</Button>
								</div>
							</Card.Content>
						</Card>
					);
				})}
			</Card.Group>
		</div>
	);
};

export default ProgramItemList;
