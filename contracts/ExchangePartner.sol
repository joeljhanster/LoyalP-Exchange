// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract ExchangePartner {
    address originAddress;
    string public originPartnerName;
    string public originProgramName;
    uint256 public redemptionRate;
    uint256 public id = 0;

    struct Partnership {
        address destAddress;
        string destPartnerName;
        string destProgramName;
        int256 originPoints;    // +ve: points exchanged in; -ve: points exchanged out
        int256 destPoints;      // +ve: partner's points exchanged in; -ve: partner's points exchanged out
        int256 amountDue;       // +ve: amount to pay partner; -ve: amount to receive from partner
        bool isRegistered;
    }

    mapping(address => Partnership) public partnerships;
    address[] public partnersAddress;

    constructor(
        string memory _originPartnerName,
        string memory _originProgramName,
        uint256 _redemptionRate
    ) {
        originAddress = tx.origin;
        originPartnerName = _originPartnerName;
        originProgramName = _originProgramName;
        redemptionRate = _redemptionRate;
    }

    modifier onlyPartner(address _destAddress) {
        require(
            partnerships[_destAddress].isRegistered,
            "Partnership has not been established."
        );
        _;
    }

    function addPartner(
        address _destAddress,
        string memory _destPartnerName,
        string memory _destProgramName
    ) external {
        if (!partnerships[_destAddress].isRegistered) {
            Partnership memory partnership = Partnership(_destAddress, _destPartnerName, _destProgramName, 0, 0, 0, true);
            partnerships[_destAddress] = partnership;
            partnersAddress.push(_destAddress);
        }
    }

    function updatePartnership(
        address _destAddress,
        int256 _originPoints,
        int256 _destPoints
    ) external onlyPartner(_destAddress) {
        Partnership storage partnership = partnerships[_destAddress];
        partnership.originPoints += _originPoints;
        partnership.destPoints += _destPoints;
        partnership.amountDue = -partnership.originPoints / int(redemptionRate);
    }

    function updatePayment(
        address _destAddress,
        uint _destRedemptionRate,
        int256 _amountPaid
    ) external onlyPartner(_destAddress) {
        Partnership storage partnership = partnerships[_destAddress];
        partnership.amountDue += _amountPaid;
        partnership.originPoints = -partnership.amountDue * int(redemptionRate);
        partnership.destPoints = partnership.amountDue * int(_destRedemptionRate);
    }

    function partnersLength() public view returns(uint256) {
        return partnersAddress.length;
    }
}