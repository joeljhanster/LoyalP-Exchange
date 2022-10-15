// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import { TransactionType } from "./Enums.sol";

library Events {
    event RegisteredMemberEvent(
        address indexed memberAddress,
        string firstName,
        string lastName
    );

    event RegisteredPartnerEvent(
        address indexed partnerAddress,
        string partnerName,
        string programName,
        uint256 redemptionRate
    );

    event RegisteredProgramEvent(
        address indexed issuerAddress,
        string issuerName,
        string programName,
        uint256 redemptionRate
    );

    event JoinedProgramEvent(
        address indexed memberAddress,
        string firstName,
        string lastName,
        address indexed issuerAddress,
        string issuerName,
        string programName
    );

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

    event PointsEvent(
        address indexed issuerAddress,
        string issuerName,
        string programName,
        address indexed memberAddress,
        string firstName,
        string lastName,
        TransactionType indexed transactionType,
        int256 points,
        uint256 fromPoints,
        uint256 toPoints
    );
}