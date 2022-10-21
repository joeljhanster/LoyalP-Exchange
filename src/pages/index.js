import React, { useEffect, useState, useContext } from "react";
import { Grid } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";
import Layout from "../components/Layout";
import AllLoyaltyPrograms from "../components/AllLoyaltyPrograms";
import AllExchangeMembers from "../components/AllExchangeMembers";
import AllExchangePartners from "../components/AllExchangePartners";
import ExchangeTransactions from "../components/ExchangeTransactions";
import PaymentTransactions from "../components/PaymentTransactions";

const Home = () => {
	const {
		loyaltyPrograms,
		exchangeMembers,
		exchangePartners,
		exchangeTransactions,
		paymentTransactions,
		getLoyaltyProgramDetails,
		getExchangeMemberDetails,
		getExchangePartnerDetails
	} = useContext(LoyaltyExchangeContext);
	const [allProgramDetails, setAllProgramDetails] = useState([]);
	const [allMemberDetails, setAllMemberDetails] = useState([]);
	const [allPartnerDetails, setAllPartnerDetails] = useState([]);

	useEffect(() => {
		Promise.all(
			loyaltyPrograms.map(async program => {
				const programDetail = await getLoyaltyProgramDetails(program);
				return programDetail;
			})
		).then(programDetails => {
			setAllProgramDetails(programDetails);
		});
	}, [loyaltyPrograms]);

	useEffect(() => {
		Promise.all(
			exchangeMembers.map(async member => {
				const memberDetail = await getExchangeMemberDetails(member);
				return memberDetail;
			})
		).then(memberDetails => {
			setAllMemberDetails(memberDetails);
		});
	}, [exchangeMembers]);

	useEffect(() => {
		Promise.all(
			exchangePartners.map(async partner => {
				const partnerDetail = await getExchangePartnerDetails(partner);
				return partnerDetail;
			})
		).then(partnerDetails => {
			setAllPartnerDetails(partnerDetails);
		});
	}, [exchangePartners]);

	return (
		<Layout>
			<Grid>
				<Grid.Row columns={1}>
					<Grid.Column>
						<AllLoyaltyPrograms
							allProgramDetails={allProgramDetails}
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={2}>
					<Grid.Column>
						<AllExchangeMembers
							allMemberDetails={allMemberDetails}
						/>
					</Grid.Column>
					<Grid.Column>
						<AllExchangePartners
							allPartnerDetails={allPartnerDetails}
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={1}>
					<Grid.Column>
						<ExchangeTransactions
							transactions={exchangeTransactions}
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={1}>
					<Grid.Column>
						<PaymentTransactions
							header={"Payment Transactions"}
							transactions={paymentTransactions}
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};

export default Home;
