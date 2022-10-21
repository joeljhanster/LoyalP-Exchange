import ExchangeMember from "./ExchangeMember.json";
import ExchangePartner from "./ExchangePartner.json";
import LoyaltyExchange from "./LoyaltyExchange.json";
import LoyaltyProgram from "./LoyaltyProgram.json";

export const loyaltyExchangeAddress =
	"0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const loyaltyExchangeABI = LoyaltyExchange.abi;
export const loyaltyProgramABI = LoyaltyProgram.abi;
export const exchangeMemberABI = ExchangeMember.abi;
export const exchangePartnerABI = ExchangePartner.abi;

const DBS_RATE = 100;
const SB_RATE = 10;
const SIA_RATE = 1;
export const dbsItems = [
	{
		header: "$5 Jollibean Voucher",
		meta: "Voucher",
		description: "Valid until 30 December 2022",
		price: 5,
		rate: DBS_RATE
	},
	{
		header: "$10 Jollibean Voucher",
		meta: "Voucher",
		description: "Valid until 30 December 2022",
		price: 10,
		rate: DBS_RATE
	},
	{
		header: "$15 Jollibean Voucher",
		meta: "Voucher",
		description: "Valid until 30 December 2022",
		price: 15,
		rate: DBS_RATE
	}
];
export const siaItems = [
	{
		header: "Flight to Seoul",
		meta: "Flight",
		description: "Valid before 30 Novermber 2022",
		price: 1500,
		rate: SIA_RATE
	},
	{
		header: "Flight to Melbourne",
		meta: "Flight",
		description: "Valid before 30 Novermber 2022",
		price: 2000,
		rate: SIA_RATE
	},
	{
		header: "Flight to Japan",
		meta: "Flight",
		description: "Valid before 30 Novermber 2022",
		price: 1500,
		rate: SIA_RATE
	}
];
export const sbItems = [
	{
		header: "$10 Starbucks Giftcard",
		meta: "Giftcard",
		description: "Valid for 3 months from date of purchase",
		price: 10,
		rate: SB_RATE
	},
	{
		header: "$20 Starbucks Giftcard",
		meta: "Giftcard",
		description: "Valid for 3 months from date of purchase",
		price: 20,
		rate: SB_RATE
	},
	{
		header: "$30 Starbucks Giftcard",
		meta: "Giftcard",
		description: "Valid for 3 months from date of purchase",
		price: 30,
		rate: SB_RATE
	}
];

export const purchaseItems = {
	"DBS Rewards": dbsItems,
	"KrisFlyer Miles": siaItems,
	"Starbucks Rewards": sbItems
};

export const dbsOrderItems = [
	{
		memberAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
		header: "$5 Jollibean Voucher",
		meta: "Voucher",
		price: 5,
		points: 100
	},
	{
		memberAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
		header: "$15 Jollibean Voucher",
		meta: "Voucher",
		price: 15,
		points: 300
	}
];
export const siaOrderItems = [
	{
		memberAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
		header: "Flight to Melbourne",
		meta: "Flight",
		description: "Valid before 30 Novermber 2022",
		price: 2000,
		points: 20
	}
];
export const sbOrderItems = [
	{
		memberAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
		header: "$30 Starbucks Giftcard",
		meta: "Giftcard",
		description: "Valid for 3 months from date of purchase",
		price: 30,
		points: 150
	}
];
export const orderItems = {
	DBS: dbsOrderItems,
	SIA: siaOrderItems,
	SB: sbOrderItems
};
