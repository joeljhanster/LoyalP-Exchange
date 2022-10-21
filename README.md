# LoyalP - A Loyalty Program Exchange

LoyalP is a loyalty program exchange that is powered by blockchain and smart contracts to facilitate the exchange of loyalty points across multiple loyalty programs. Partners on the exchange are defined as the companies who have set up their loyalty program. Members on the exchange are defined as customers of these companies who have registered on the exchange, and joined the available loyalty programs.

## Local set up

Pre-requisites:

-   Metamask (Chrome Extension) must be installed
-   Use the current Node LTS version: `nvm use --lts`
-   Install all the dependencies: `npm install`

1. Open a new terminal & initialise the hardhat node (leave it running): `npx hardhat node`
2. Take note of the private keys in the terminal & create accounts on Metamask with these private keys
3. Open another terminal and deploy the LoyaltyExchange smart contract: `npx hardhat run scripts/deploy.js --network localhost`
4. Once the LoyaltyExchange smart contract has been deployed, run the dApp: `npm run dev` or `npm start`

## Interacting with the dApp

1. Register 2 accounts as exchange partners + create loyalty programs
2. Register 1 account as a member
3. As a member, join the loyalty programs created in step 1
4. As a member, go to the shopping tab and make purchases
5. As a partner, issue points to the user who has made a purchase
6. As a member, exchange points to points from another loyalty program
7. As a member, redeem points from individual loyalty programs
8. As a partner, track partnerships & monitor amount due
9. As a partner, make a payment transaction to another partner
10. As a partner, approve a payment transaction
11. As a partner, view all completed transactions
