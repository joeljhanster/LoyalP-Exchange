const hre = require("hardhat");

async function main() {
	const LoyaltyExchange = await hre.ethers.getContractFactory(
		"LoyaltyExchange"
	);
	const loyaltyExchange = await LoyaltyExchange.deploy();

	await loyaltyExchange.deployed();

	console.log(`LoyaltyExchange deployed to: ${loyaltyExchange.address}`);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
