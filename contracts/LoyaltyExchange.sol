// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./ExchangeMember.sol";
import "./ExchangePartner.sol";
import "./LoyaltyProgram.sol";

contract LoyaltyExchange {
    uint256 exchangeId = 0;
    uint256 paymentId = 0;

    struct ExchangeTransaction {
        uint256 transactionId;
        address memberAddress;
        address originAddress;
        address destAddress;
        string originProgramName;
        string destProgramName;
        uint256 originPoints;
        uint256 destPoints;
    }

    struct PaymentTransaction {
        uint256 transactionId;
        address payerAddress;
        address payeeAddress;
        uint256 amountPaid;
        bool isApproved;
    }

    mapping(address => LoyaltyProgram) public loyaltyPrograms;
    mapping(address => ExchangeMember) public exchangeMembers;
    mapping(address => ExchangePartner) public exchangePartners;
    mapping(uint256 => ExchangeTransaction) public exchangeTransactions;
    mapping(uint256 => PaymentTransaction) public paymentTransactions;
    
    address[] public loyaltyProgramsAddress;
    address[] public exchangeMembersAddress;
    address[] public exchangePartnersAddress;
    uint256[] public exchangeTransactionsInfo;
    uint256[] public paymentTransactionsInfo;

    function registerPartner(
        string memory _issuerName,
        string memory _programName,
        uint256 _redemptionRate
    ) public {
        ExchangePartner exchangePartner = new ExchangePartner(_issuerName, _programName, _redemptionRate);
        exchangePartners[tx.origin] = exchangePartner;
        exchangePartnersAddress.push(tx.origin);

        createLoyaltyProgram(_issuerName, _programName, _redemptionRate);
    }

    function registerMember(string memory _firstName, string memory _lastName) public {
        // require(
        //     !exchangeMembers[tx.origin].isRegistered(),
        //     "You have already registered on the loyalty exchange."
        // );
        
        ExchangeMember exchangeMember = new ExchangeMember(_firstName, _lastName);
        exchangeMembers[tx.origin] = exchangeMember;
        exchangeMembersAddress.push(tx.origin);
    }

    function createLoyaltyProgram(
        string memory _issuerName,
        string memory _programName,
        uint256 _redemptionRate
    ) private {
        // require(
        //     !loyaltyPrograms[tx.origin].isRegistered(),
        //     "You have already created a loyalty program."
        // );

        LoyaltyProgram loyaltyProgram = new LoyaltyProgram(_issuerName, _programName, _redemptionRate);
        loyaltyPrograms[tx.origin] = loyaltyProgram;
        loyaltyProgramsAddress.push(tx.origin);
    }

    function registerLoyaltyProgram(address _issuerAddress) public {
        // require(
        //     exchangeMembers[tx.origin].isRegistered(),
        //     "Only registered exchange members can register for a program."
        // );

        ExchangeMember exchangeMember = exchangeMembers[tx.origin];
        LoyaltyProgram loyaltyProgram = loyaltyPrograms[_issuerAddress];

        exchangeMember.initPoints(_issuerAddress, loyaltyProgram.programName());
        loyaltyProgram.registerMember(exchangeMember.firstName(), exchangeMember.lastName());
    }

    function issuePoints(uint256 _points, address _memberAddress) public {
        require(
            loyaltyPrograms[tx.origin].isRegistered(),
            "You have not registered a loyalty program."
        );

        LoyaltyProgram program = loyaltyPrograms[tx.origin];
        program.issuePoints(_points, _memberAddress);

        ExchangeMember exchangeMember = exchangeMembers[_memberAddress];
        exchangeMember.addPoints(tx.origin, _points);
    }

    function redeemPoints(uint256 _points, address _issuerAddress) public {
        // require(
        //     loyaltyPrograms[_programAddress].isRegistered(),
        //     "Loyalty program is not registered."
        // );

        LoyaltyProgram program = loyaltyPrograms[_issuerAddress];
        program.redeemPoints(_points);

        ExchangeMember exchangeMember = exchangeMembers[tx.origin];
        exchangeMember.deductPoints(_issuerAddress, _points);
    }

    function exchangePoints(
        address _originAddress,
        address _destAddress,
        uint256 _originPoints
    ) public {
        // require(
        //     loyaltyPrograms[_originAddress].isRegistered() && loyaltyPrograms[_destAddress].isRegistered(),
        //     "Either the origin or destination program address is not valid."
        // );

        LoyaltyProgram originProgram = loyaltyPrograms[_originAddress];
        LoyaltyProgram destProgram = loyaltyPrograms[_destAddress];

        uint256 _destPoints = destProgram.redemptionRate() * _originPoints / originProgram.redemptionRate();
        originProgram.exchangePoints(-int(_originPoints));
        destProgram.exchangePoints(int(_destPoints));

        ExchangeMember exchangeMember = exchangeMembers[tx.origin];
        exchangeMember.addPoints(_destAddress, _destPoints);
        exchangeMember.deductPoints(_originAddress, _originPoints);

        ExchangeTransaction memory exchangeTransaction = ExchangeTransaction({
            transactionId: exchangeId,
            memberAddress: tx.origin,
            originAddress: _originAddress,
            destAddress: _destAddress,
            originProgramName: originProgram.programName(),
            destProgramName: destProgram.programName(),
            originPoints: _originPoints,
            destPoints: _destPoints
        });
        exchangeTransactions[exchangeId] = exchangeTransaction;
        exchangeTransactionsInfo.push(exchangeId);

        exchangeId += 1;

        ExchangePartner originPartner = exchangePartners[_originAddress];
        ExchangePartner destPartner = exchangePartners[_destAddress];

        originPartner.addPartner(
            _destAddress,
            destProgram.issuerName(),
            destProgram.programName()
        );

        destPartner.addPartner(
            _originAddress,
            originProgram.issuerName(),
            originProgram.programName()
        );

        originPartner.updatePartnership(_destAddress, -int(_originPoints), int(_destPoints));
        destPartner.updatePartnership(_originAddress, int(_destPoints), -int(_originPoints));
    }

    function createPaymentTransaction(address _destAddress, uint256 _amountPaid) public {
        // require(
        //     exchangePartners[tx.origin].isRegistered() && exchangePartners[_destAddress].isRegistered(),
        //     "Either you or the destination address is not registered as an exchange partner."
        // );

        PaymentTransaction memory paymentTransaction = PaymentTransaction(
            paymentId,
            tx.origin,
            _destAddress,
            _amountPaid,
            false
        );
        paymentTransactions[paymentId] = paymentTransaction;
        paymentTransactionsInfo.push(paymentId);

        paymentId += 1;
    }

    function approvePaymentTransaction(uint256 _transactionId) public {
        // require(
        //     !paymentTransactions[_transactionId].isApproved,
        //     "Payment transaction id has already been approved."
        // );

        PaymentTransaction storage paymentTransaction = paymentTransactions[_transactionId];
        paymentTransaction.isApproved = true;

        ExchangePartner payer = exchangePartners[paymentTransaction.payerAddress];
        ExchangePartner payee = exchangePartners[paymentTransaction.payeeAddress];
        int256 _amountPaid = int(paymentTransaction.amountPaid);

        payer.updatePayment(
            paymentTransaction.payeeAddress,
            payee.redemptionRate(),
            -_amountPaid
        );
        payee.updatePayment(
            paymentTransaction.payerAddress,
            payer.redemptionRate(),
            _amountPaid
        );
    }

    function loyaltyProgramsLength() public view returns(uint256) {
        return loyaltyProgramsAddress.length;
    }

    function exchangeMembersLength() public view returns(uint256) {
        return exchangeMembersAddress.length;
    }

    function exchangePartnersLength() public view returns(uint256) {
        return exchangePartnersAddress.length;
    }

    function exchangeTransactionsLength() public view returns(uint256) {
        return exchangeTransactionsInfo.length;
    }

    function paymentTransactionsLength() public view returns(uint256) {
        return paymentTransactionsInfo.length;
    }
}