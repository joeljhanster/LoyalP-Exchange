import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// INTERNAL IMPORT
import {
	loyaltyExchangeAddress,
	loyaltyExchangeABI,
	loyaltyProgramABI,
	exchangeMemberABI,
	exchangePartnerABI
} from "./constants";

const fetchContract = (contractAddress, contractABI, signerOrProvider) =>
	new ethers.Contract(contractAddress, contractABI, signerOrProvider);

const TransactionType = {
	0: "Issued",
	1: "Redeemed",
	2: "Exchanged"
};

export const LoyaltyExchangeContext = React.createContext();
export const LoyaltyExchangeProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState("");
	const [error, setError] = useState("");
	const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
	const [exchangeMembers, setExchangeMembers] = useState([]);
	const [exchangePartners, setExchangePartners] = useState([]);
	const [exchangeTransactions, setExchangeTransactions] = useState([]);
	const [paymentTransactions, setPaymentTransactions] = useState([]);
	const [isRegisteredMember, setIsRegisteredMember] = useState(false);
	const [isRegisteredPartner, setIsRegisteredPartner] = useState(false);
	const [programPoints, setProgramPoints] = useState([]);

	const router = useRouter();

	useEffect(() => {
		connectWallet();
		getLoyaltyPrograms();
		getExchangeMembers();
		getExchangePartners();
		getExchangeTransactions();
		getPaymentTransactions();
	}, []);

	useEffect(() => {
		if (currentAccount) {
			checkRegisteredMember(currentAccount);
			checkRegisteredPartner(currentAccount);
		} else {
			setIsRegisteredMember(false);
			setIsRegisteredPartner(false);
		}
	}, [currentAccount]);

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on("chainChanged", () => {
				connectWallet();
				router.push("/");
			});
			window.ethereum.on("accountsChanged", () => {
				connectWallet();
				router.push("/");
			});
		}
	});

	// CONNECTING METAMASK
	const connectWallet = async () => {
		if (!window.ethereum) return setError("Please install Metamask");

		const account = await window.ethereum.request({
			method: "eth_requestAccounts"
		});

		if (account.length) {
			setCurrentAccount(account[0]);
			console.log("Wallet connected");
		} else {
			console.log("Please install Metamask");
			setError("Please install Metamask, connect & reload");
		}
	};

	// CONNECTING WITH SMART CONTRACT
	const connectContract = async (contractAddress, contractABI) => {
		try {
			console.log("Contract connected");
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = await fetchContract(
				contractAddress,
				contractABI,
				signer
			);
			return contract;
		} catch (error) {
			setError("Unable to connect to contract");
			return;
		}
	};

	// INTERACTING WITH LOYALTY EXCHANGE SMART CONTRACT
	const registerMember = async (firstName, lastName) => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const registerMemberResp = await contract.registerMember(
				firstName,
				lastName
			);
			await registerMemberResp.wait();

			console.log(registerMemberResp);
			router.reload();
		} catch (error) {
			setError("Error when registering member");
		}
	};

	const registerPartner = async (issuerName, programName, redemptionRate) => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const registerPartnerResp = await contract.registerPartner(
				issuerName,
				programName,
				redemptionRate
			);
			await registerPartnerResp.wait();

			console.log(registerPartnerResp);
			router.reload();
		} catch (error) {
			setError("Error when registering partner");
		}
	};

	const joinLoyaltyProgram = async issuerAddress => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const joinLoyaltyProgramResp = await contract.joinLoyaltyProgram(
				issuerAddress
			);
			await joinLoyaltyProgramResp.wait();

			console.log(joinLoyaltyProgramResp);
			router.reload();
		} catch (error) {
			setError("Error when joining loyalty program");
		}
	};

	const getDestPoints = async (originAddress, destAddress, originPoints) => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const getDestPointsResp = await contract.getDestPoints(
				originAddress,
				destAddress,
				originPoints
			);

			return parseInt(getDestPointsResp);
		} catch (error) {
			setError("Error when getting destination points");
		}
	};

	const issuePoints = async (points, memberAddress) => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const issuePointsResp = await contract.issuePoints(
				points,
				memberAddress
			);
			await issuePointsResp.wait();

			console.log(issuePointsResp);
		} catch (error) {
			setError("Error when issuing points");
		}
	};

	const redeemPoints = async (points, issuerAddress) => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const redeemPointsResp = await contract.redeemPoints(
				points,
				issuerAddress
			);
			await redeemPointsResp.wait();

			console.log(redeemPointsResp);
		} catch (error) {
			setError("Error when redeeming points");
		}
	};

	const exchangePoints = async (originAddress, destAddress, originPoints) => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const exchangePointsResp = await contract.exchangePoints(
				originAddress,
				destAddress,
				originPoints
			);
			await exchangePointsResp.wait();

			console.log(exchangePointsResp);
		} catch (error) {
			setError("Error when exchanging points");
		}
	};

	const createPaymentTransaction = async (destAddress, amountPaid) => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const createPaymentTransactionResp = await contract.createPaymentTransaction(
				destAddress,
				amountPaid
			);
			await createPaymentTransactionResp.wait();

			console.log(createPaymentTransactionResp);
		} catch (error) {
			setError("Error when creating payment transaction");
		}
	};

	const approvePaymentTransaction = async transactionId => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const approvePaymentTransactionResp = await contract.approvePaymentTransaction(
				transactionId
			);
			await approvePaymentTransactionResp.wait();

			console.log(approvePaymentTransactionResp);
		} catch (error) {
			setError("Error when approving payment transaction");
		}
	};

	const getPaymentTransactions = async () => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const transactionsLength = await contract.paymentTransactionsLength();

			if (parseInt(transactionsLength)) {
				const allPaymentTransactions = await Promise.all(
					[...Array(parseInt(transactionsLength)).keys()].map(
						async id => {
							const transaction = await contract.paymentTransactions(
								id
							);

							return {
								transactionId: parseInt(
									transaction.transactionId
								),
								payerAddress: transaction.payerAddress,
								payeeAddress: transaction.payeeAddress,
								amountPaid: parseInt(transaction.amountPaid),
								isApproved: transaction.isApproved
							};
						}
					)
				);
				setPaymentTransactions(allPaymentTransactions);
			} else {
				setPaymentTransactions([]);
			}
		} catch (error) {
			setError("Error when getting payment transactions");
		}
	};

	const getExchangeTransactions = async () => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const transactionsLength = await contract.exchangeTransactionsLength();

			if (parseInt(transactionsLength)) {
				const allExchangeTransactions = await Promise.all(
					[...Array(parseInt(transactionsLength)).keys()].map(
						async id => {
							const transaction = await contract.exchangeTransactions(
								id
							);

							return {
								transactionId: parseInt(
									transaction.transactionId
								),
								memberAddress: transaction.memberAddress,
								originAddress: transaction.originAddress,
								destAddress: transaction.destAddress,
								originProgramName:
									transaction.originProgramName,
								destProgramName: transaction.destProgramName,
								originPoints: parseInt(
									transaction.originPoints
								),
								destPoints: parseInt(transaction.destPoints)
							};
						}
					)
				);
				setExchangeTransactions(allExchangeTransactions);
			} else {
				setExchangeTransactions([]);
			}
		} catch (error) {
			setError("Error when getting exchange transactions");
		}
	};

	const getLoyaltyProgram = async issuerAddress => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const loyaltyProgramAddress = await contract.loyaltyPrograms(
				issuerAddress
			);

			const loyaltyProgramContract = await connectContract(
				loyaltyProgramAddress,
				loyaltyProgramABI
			);

			return loyaltyProgramContract;
		} catch (error) {
			setError("Error when getting loyalty program");
		}
	};

	const getLoyaltyPrograms = async () => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);
			const loyaltyProgramsLength = await contract.loyaltyProgramsLength();

			if (parseInt(loyaltyProgramsLength)) {
				const allLoyaltyPrograms = await Promise.all(
					[...Array(parseInt(loyaltyProgramsLength)).keys()].map(
						async id => {
							const issuerAddress = await contract.loyaltyProgramsAddress(
								id
							);

							return getLoyaltyProgram(issuerAddress);
						}
					)
				);
				setLoyaltyPrograms(allLoyaltyPrograms);
			} else {
				setLoyaltyPrograms([]);
			}
		} catch (error) {
			setError("Error when getting loyalty programs");
		}
	};

	const getExchangeMember = async memberAddress => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const exchangeMemberAddress = await contract.exchangeMembers(
				memberAddress
			);

			const exchangeMemberContract = await connectContract(
				exchangeMemberAddress,
				exchangeMemberABI
			);

			return exchangeMemberContract;
		} catch (error) {
			setError("Error when getting exchange member");
		}
	};

	const getExchangeMembers = async () => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);
			const exchangeMembersLength = await contract.exchangeMembersLength();

			if (parseInt(exchangeMembersLength)) {
				const allExchangeMembers = await Promise.all(
					[...Array(parseInt(exchangeMembersLength)).keys()].map(
						async id => {
							const memberAddress = await contract.exchangeMembersAddress(
								id
							);

							return getExchangeMember(memberAddress);
						}
					)
				);
				setExchangeMembers(allExchangeMembers);
			} else {
				setExchangeMembers([]);
			}
		} catch (error) {
			setError("Error when getting exchange members");
		}
	};

	const getExchangePartner = async partnerAddress => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);

			const exchangePartnerAddress = await contract.exchangePartners(
				partnerAddress
			);

			const exchangePartnerContract = await connectContract(
				exchangePartnerAddress,
				exchangePartnerABI
			);

			return exchangePartnerContract;
		} catch (error) {
			setError("Error when getting exchange partner");
		}
	};

	const getExchangePartners = async () => {
		try {
			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);
			const exchangePartnersLength = await contract.exchangePartnersLength();

			if (parseInt(exchangePartnersLength)) {
				const allExchangePartners = await Promise.all(
					[...Array(parseInt(exchangePartnersLength)).keys()].map(
						async id => {
							const partnerAddress = await contract.exchangePartnersAddress(
								id
							);

							return getExchangePartner(partnerAddress);
						}
					)
				);
				setExchangePartners(allExchangePartners);
			} else {
				setExchangePartners([]);
			}
		} catch (error) {
			setError("Error when getting exchange partners");
		}
	};

	const getProgramPoints = async memberAddress => {
		try {
			const exchangeMemberContract = await getExchangeMember(
				memberAddress
			);
			const programsLength = await exchangeMemberContract.programsLength();

			if (parseInt(programsLength)) {
				const allProgramPoints = await Promise.all(
					[...Array(parseInt(programsLength)).keys()].map(
						async id => {
							const programPointsAddress = await exchangeMemberContract.programPointsAddress(
								id
							);
							const programPoints = await exchangeMemberContract.programPoints(
								programPointsAddress
							);

							return {
								programAddress: programPoints.programAddress,
								programName: programPoints.programName,
								points: parseInt(programPoints.points),
								isRegistered: programPoints.isRegistered
							};
						}
					)
				);
				return allProgramPoints;
			} else {
				return [];
			}
		} catch (error) {
			setError("Error when getting program points");
		}
	};

	const checkRegisteredMember = async address => {
		try {
			let isRegistered = false;

			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);
			const registeredMember = await contract.exchangeMembers(address);
			if (parseInt(registeredMember) != 0) {
				isRegistered = true;
				const allProgramPoints = await getProgramPoints(address);
				setProgramPoints(allProgramPoints);
			} else {
				setProgramPoints([]);
			}

			setIsRegisteredMember(isRegistered);
		} catch (error) {
			setError("Error when checking registered member");
		}
	};

	const checkRegisteredPartner = async address => {
		try {
			let isRegistered = false;

			const contract = await connectContract(
				loyaltyExchangeAddress,
				loyaltyExchangeABI
			);
			const registeredPartner = await contract.exchangePartners(address);
			if (parseInt(registeredPartner) != 0) {
				isRegistered = true;
			}

			setIsRegisteredPartner(isRegistered);
		} catch (error) {
			setError("Error when checking registered partner");
		}
	};

	// INTERACTING WITH LOYALTY PROGRAM SMART CONTRACT
	const getLoyaltyProgramDetails = async program => {
		try {
			const contract = await connectContract(
				program.address,
				loyaltyProgramABI
			);

			let detail = {
				address: program.address,
				members: [],
				transactionsInfo: []
			};

			const issuerAddress = await program.issuerAddress();
			detail.issuerAddress = issuerAddress;

			const issuerName = await program.issuerName();
			detail.issuerName = issuerName;

			const programName = await program.programName();
			detail.programName = programName;

			const redemptionRate = await program.redemptionRate();
			detail.redemptionRate = parseInt(redemptionRate);

			const totalPoints = await program.totalPoints();
			detail.totalPoints = parseInt(totalPoints);

			const totalPointsIssued = await program.totalPointsIssued();
			detail.totalPointsIssued = parseInt(totalPointsIssued);

			const totalPointsRedeemed = await program.totalPointsRedeemed();
			detail.totalPointsRedeemed = parseInt(totalPointsRedeemed);

			const membersLength = await program.membersLength();
			detail.membersLength = parseInt(membersLength);

			let membersAddress = [];
			let members = [];
			if (parseInt(membersLength)) {
				membersAddress = await Promise.all(
					[...Array(parseInt(membersLength)).keys()].map(async id => {
						const membersAddress = await contract.membersAddress(
							id
						);
						const member = await contract.members(membersAddress);
						members.push({
							memberAddress: member.memberAddress,
							firstName: member.firstName,
							lastName: member.lastName,
							points: parseInt(member.points)
						});

						return membersAddress.toLowerCase();
					})
				);
			}
			detail.membersAddress = membersAddress;
			detail.members = members;

			const transactionsLength = await program.transactionsLength();
			detail.transactionsLength = parseInt(transactionsLength);

			let transactions = [];
			if (parseInt(transactionsLength)) {
				transactions = await Promise.all(
					[...Array(parseInt(transactionsLength)).keys()].map(
						async id => {
							const transaction = await contract.transactionsInfo(
								id
							);
							return {
								memberAddress: transaction.memberAddress,
								transactionType:
									TransactionType[
										transaction.transactionType
									],
								points:
									transaction.transactionType !== 1
										? parseInt(transaction.points)
										: -parseInt(transaction.points)
							};
						}
					)
				);
			}
			detail.transactions = transactions;

			return detail;
		} catch (error) {
			setError("Error when getting loyalty program details");
		}
	};

	// INTERACTING WITH EXCHANGE MEMBER SMART CONTRACT
	const getExchangeMemberDetails = async member => {
		try {
			let detail = {
				address: member.address,
				programPoints: []
			};

			const memberAddress = await member.memberAddress();
			detail.memberAddress = memberAddress;

			const firstName = await member.firstName();
			detail.firstName = firstName;

			const lastName = await member.lastName();
			detail.lastName = lastName;

			const programsLength = await member.programsLength();
			detail.programsLength = parseInt(programsLength);

			return detail;
		} catch (error) {
			setError("Error when getting exchange member details");
		}
	};

	// INTERACTING WITH EXCHANGE PARTNER SMART CONTRACT
	const getExchangePartnerDetails = async partner => {
		try {
			let detail = {
				address: partner.address,
				partnerships: []
			};

			const originAddress = await partner.originAddress();
			detail.originAddress = originAddress;

			const originPartnerName = await partner.originPartnerName();
			detail.originPartnerName = originPartnerName;

			const originProgramName = await partner.originProgramName();
			detail.originProgramName = originProgramName;

			const redemptionRate = await partner.redemptionRate();
			detail.redemptionRate = parseInt(redemptionRate);

			const partnersLength = await partner.partnersLength();
			detail.partnersLength = parseInt(partnersLength);

			if (parseInt(partnersLength)) {
				const allPartnerships = await Promise.all(
					[...Array(parseInt(partnersLength)).keys()].map(
						async id => {
							const partnerAddress = await partner.partnersAddress(
								id
							);
							const partnership = await partner.partnerships(
								partnerAddress
							);

							return {
								destAddress: partnership.destAddress,
								destPartnerName: partnership.destPartnerName,
								destProgramName: partnership.destProgramName,
								originPoints: parseInt(partnership.originPoints),
								destPoints: parseInt(partnership.destPoints),
								amountDue: parseInt(partnership.amountDue)
							};
						}
					)
				);
				detail.partnerships = allPartnerships;
			}

			return detail;
		} catch (error) {
			setError("Error when getting exchange member details");
		}
	};

	return (
		<LoyaltyExchangeContext.Provider
			value={{
				connectWallet,
				registerMember,
				registerPartner,
				joinLoyaltyProgram,
				getDestPoints,
				issuePoints,
				redeemPoints,
				exchangePoints,
				createPaymentTransaction,
				approvePaymentTransaction,
				exchangeTransactions,
				paymentTransactions,
				loyaltyPrograms,
				getLoyaltyProgramDetails,
				getLoyaltyProgram,
				getLoyaltyPrograms,
				exchangeMembers,
				getExchangeMemberDetails,
				getExchangeMember,
				getExchangeMembers,
				exchangePartners,
				getExchangePartnerDetails,
				getExchangePartner,
				getExchangePartners,
				currentAccount,
				error,
				isRegisteredMember,
				isRegisteredPartner,
				programPoints
			}}
		>
			{children}
		</LoyaltyExchangeContext.Provider>
	);
};
