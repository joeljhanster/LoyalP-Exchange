// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./Events.sol";
import { TransactionType } from "./Enums.sol";

contract LoyaltyProgram {
    address public issuerAddress;
    string public issuerName;
    string public programName;
    uint256 public redemptionRate;              // Points per USD
    uint256 public totalPoints = 0;             // Net points: Issued - Redeemed
    uint256 public totalPointsIssued = 0;       // Total points issued since loyalty program started (incl. points exchanged in)
    uint256 public totalPointsRedeemed = 0;     // Total points redeemed since loyalty program started (incl. points exchanged out)

    struct Member {
        address memberAddress;
        string firstName;
        string lastName;
        uint256 points;
        bool isRegistered;
    }

    struct PointsTransaction {
        address memberAddress;
        TransactionType transactionType;
        int256 points;
    }

    mapping(address => Member) public members;

    address[] public membersAddress;
    PointsTransaction[] public transactionsInfo;

    constructor(
        string memory _issuerName,
        string memory _programName,
        uint256 _redemptionRate
    ) {
        issuerAddress = tx.origin;
        issuerName = _issuerName;
        programName = _programName;
        redemptionRate = _redemptionRate;
    }

    modifier onlyIssuer {
        require(
            tx.origin == issuerAddress,
            "Only issuer is allowed to perform this action."
        );
        _;
    }

    modifier onlyRegisteredMember {
        require(
            members[tx.origin].isRegistered,
            "Sender not registered as Member"
        );
        _;
    }

    function registerMember(string memory _firstName, string memory _lastName) external {
        require(
            !members[tx.origin].isRegistered,
            "You have already registered as a member of the program."
        );

        Member memory member = Member(tx.origin, _firstName, _lastName, 0, true);
        members[tx.origin] = member;
        membersAddress.push(tx.origin);
    }

    function issuePoints(uint256 _points, address _memberAddress) external onlyIssuer {
        uint256 fromPoints = uint(members[_memberAddress].points);
        members[_memberAddress].points += _points;
        uint256 toPoints = uint(members[_memberAddress].points);

        PointsTransaction memory pointsTransaction = PointsTransaction({
            memberAddress: _memberAddress,
            transactionType: TransactionType.Earned,
            points: int(_points)
        });
        transactionsInfo.push(pointsTransaction);

        totalPoints += _points;
        totalPointsIssued += _points;

        emit Events.PointsEvent(
            issuerAddress,
            issuerName,
            programName,
            _memberAddress,
            members[_memberAddress].firstName,
            members[_memberAddress].lastName,
            pointsTransaction.transactionType,
            pointsTransaction.points,
            fromPoints,
            toPoints
        );
    }

    function redeemPoints(uint256 _points) external onlyRegisteredMember {
        require(
            members[tx.origin].points >= _points,
            "You have insufficient points for redemption."
        );

        uint256 fromPoints = uint(members[tx.origin].points);
        members[tx.origin].points -= _points;
        uint256 toPoints = uint(members[tx.origin].points);

        PointsTransaction memory pointsTransaction = PointsTransaction({
            memberAddress: tx.origin,
            transactionType: TransactionType.Redeemed,
            points: int(_points)
        });
        transactionsInfo.push(pointsTransaction);

        totalPoints -= _points;
        totalPointsRedeemed += _points;

        emit Events.PointsEvent(
            issuerAddress,
            issuerName,
            programName,
            tx.origin,
            members[tx.origin].firstName,
            members[tx.origin].lastName,
            pointsTransaction.transactionType,
            pointsTransaction.points,
            fromPoints,
            toPoints
        );
    }

    function exchangePoints(int256 _points) external onlyRegisteredMember {
        require(
            int(members[tx.origin].points) >= -_points,
            "You have insufficient points for exchange."
        );

        uint256 fromPoints = uint(members[tx.origin].points);
        members[tx.origin].points = uint(int(members[tx.origin].points) + _points);
        uint256 toPoints = uint(members[tx.origin].points);
        
        PointsTransaction memory pointsTransaction = PointsTransaction({
            memberAddress: tx.origin,
            transactionType: TransactionType.Exchanged,
            points: _points
        });
        transactionsInfo.push(pointsTransaction);

        totalPoints = uint(int(totalPoints) + _points);

        if (_points < 0) {
            totalPointsRedeemed += uint(-_points);
        } else {
            totalPointsIssued += uint(_points);
        }

        emit Events.PointsEvent(
            issuerAddress,
            issuerName,
            programName,
            tx.origin,
            members[tx.origin].firstName,
            members[tx.origin].lastName,
            pointsTransaction.transactionType,
            pointsTransaction.points,
            fromPoints,
            toPoints
        );
    }

    function membersLength() public view returns(uint256) {
        return membersAddress.length;
    }

    function transactionsLength() public view returns(uint256) {
        return transactionsInfo.length;
    }
}