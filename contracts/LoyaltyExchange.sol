// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./ExchangeMember.sol";
import "./ExchangePartner.sol";
import "./LoyaltyProgram.sol";

contract LoyaltyExchange {
    address public owner;
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

    event ExchangeEvent(
        uint256 indexed transactionId,
        address indexed memberAddress,
        address originAddress,
        address destAddress,
        string originProgramName,
        string destProgramName,
        uint256 originPoints,
        uint256 destPoints
    );

    event PaymentEvent(
        uint256 indexed transactionId,
        address indexed payerAddress,
        address indexed payeeAddress,
        uint256 amountPaid,
        bool isApproved
    );

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

    constructor() {
        owner = msg.sender;
    }

    modifier onlyRegisteredMember(address _memberAddress) {
        require(
            address(exchangeMembers[_memberAddress]) != address(0x0),
            "Member has not been registered on the loyalty exchange."
        );
        _;
    }

    modifier onlyRegisteredPartner(address _partnerAddress) {
        require(
            address(exchangePartners[_partnerAddress]) != address(0x0),
            "Partner has not been registered on the loyalty exchange."
        );
        _;
    }

    modifier onlyRegisteredProgram(address _issuerAddress) {
        require(
            address(loyaltyPrograms[_issuerAddress]) != address(0x0),
            "Loyalty program is not registered on the loyalty exchange"
        );
        _;
    }

    function registerPartner(
        string memory _issuerName,
        string memory _programName,
        uint256 _redemptionRate
    ) public {
        require(
            address(exchangePartners[tx.origin]) == address(0x0),
            "You have already registered as a partner on the loyalty exchange."
        );

        ExchangePartner exchangePartner = new ExchangePartner(_issuerName, _programName, _redemptionRate);
        exchangePartners[tx.origin] = exchangePartner;
        exchangePartnersAddress.push(tx.origin);

        createLoyaltyProgram(_issuerName, _programName, _redemptionRate);
    }

    function registerMember(string memory _firstName, string memory _lastName) public {
        require(
            address(exchangeMembers[tx.origin]) == address(0x0),
            "You have already registered as a member on the loyalty exchange."
        );

        ExchangeMember exchangeMember = new ExchangeMember(_firstName, _lastName);
        exchangeMembers[tx.origin] = exchangeMember;
        exchangeMembersAddress.push(tx.origin);
    }

    function createLoyaltyProgram(
        string memory _issuerName,
        string memory _programName,
        uint256 _redemptionRate
    ) private onlyRegisteredPartner(tx.origin) {
        require(
            address(loyaltyPrograms[tx.origin]) == address(0x0),
            "You have already created a loyalty program."
        );

        LoyaltyProgram loyaltyProgram = new LoyaltyProgram(_issuerName, _programName, _redemptionRate);
        loyaltyPrograms[tx.origin] = loyaltyProgram;
        loyaltyProgramsAddress.push(tx.origin);
    }

    function joinLoyaltyProgram(address _issuerAddress) 
        public onlyRegisteredMember(tx.origin) onlyRegisteredProgram(_issuerAddress) {
        ExchangeMember exchangeMember = exchangeMembers[tx.origin];
        LoyaltyProgram loyaltyProgram = loyaltyPrograms[_issuerAddress];

        exchangeMember.initPoints(_issuerAddress, loyaltyProgram.programName());
        loyaltyProgram.registerMember(exchangeMember.firstName(), exchangeMember.lastName());
    }

    function getDestPoints(address _originAddress, address _destAddress, uint256 _originPoints)
        public view onlyRegisteredProgram(_originAddress) onlyRegisteredProgram(_destAddress) returns(uint256) {
        LoyaltyProgram originProgram = loyaltyPrograms[_originAddress];
        LoyaltyProgram destProgram = loyaltyPrograms[_destAddress];

        uint256 _destPoints = destProgram.redemptionRate() * _originPoints / originProgram.redemptionRate();
        return _destPoints;
    }

    function issuePoints(uint256 _points, address _memberAddress) 
        public onlyRegisteredMember(_memberAddress) onlyRegisteredPartner(tx.origin) onlyRegisteredProgram(tx.origin) {
        LoyaltyProgram program = loyaltyPrograms[tx.origin];
        program.issuePoints(_points, _memberAddress);

        ExchangeMember exchangeMember = exchangeMembers[_memberAddress];
        exchangeMember.addPoints(tx.origin, _points);
    }

    function redeemPoints(uint256 _points, address _issuerAddress) 
        public onlyRegisteredMember(tx.origin) onlyRegisteredProgram(_issuerAddress) {
        LoyaltyProgram program = loyaltyPrograms[_issuerAddress];
        program.redeemPoints(_points);

        ExchangeMember exchangeMember = exchangeMembers[tx.origin];
        exchangeMember.deductPoints(_issuerAddress, _points);
    }

    function exchangePoints(address _originAddress, address _destAddress, uint256 _originPoints) 
        public onlyRegisteredMember(tx.origin) onlyRegisteredProgram(_originAddress) onlyRegisteredProgram(_destAddress) {
        LoyaltyProgram originProgram = loyaltyPrograms[_originAddress];
        LoyaltyProgram destProgram = loyaltyPrograms[_destAddress];

        uint256 _destPoints = getDestPoints(_originAddress, _destAddress, _originPoints);
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

        exchangeId++;

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

    function createPaymentTransaction(address _destAddress, uint256 _amountPaid) 
        public onlyRegisteredPartner(tx.origin) onlyRegisteredPartner(_destAddress) {
        PaymentTransaction memory paymentTransaction = PaymentTransaction(
            paymentId,
            tx.origin,
            _destAddress,
            _amountPaid,
            false
        );
        paymentTransactions[paymentId] = paymentTransaction;
        paymentTransactionsInfo.push(paymentId);

        paymentId++;
    }

    function approvePaymentTransaction(uint256 _transactionId) public onlyRegisteredPartner(tx.origin) {
        require(
            !paymentTransactions[_transactionId].isApproved,
            "Payment transaction has already been approved."
        );

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