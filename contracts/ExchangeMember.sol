// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract ExchangeMember {
    address owner;
    string public firstName;
    string public lastName;
    bool public isRegistered = true;
    
    struct ProgramPoints {
        address programAddress;
        string programName;
        uint256 points;
        bool isRegistered;
    }

    mapping(address => ProgramPoints) public programPoints;
    address[] public programPointsAddress;

    constructor(
        string memory _firstName,
        string memory _lastName
    ) {
        owner = tx.origin;
        firstName = _firstName;
        lastName = _lastName;
    }

    function initPoints(address _programAddress, string memory _programName) external {
        require(
            !programPoints[_programAddress].isRegistered,
            "Program points already initiated."
        );

        programPoints[_programAddress] = ProgramPoints(
            _programAddress,
            _programName,
            0,
            true
        );
        programPointsAddress.push(_programAddress);
    }

    function addPoints(address _programAddress, uint256 _points) external {
        require(
            programPoints[_programAddress].isRegistered,
            "Program points not initiated."
        );

        programPoints[_programAddress].points += _points;
    }

    function deductPoints(address _programAddress, uint256 _points) external {
        require(
            programPoints[_programAddress].isRegistered && programPoints[_programAddress].points >= _points,
            "Program points not initiated or not enough points to deduct."
        );

        programPoints[_programAddress].points -= _points;
    }

    function programsLength() public view returns(uint256) {
        return programPointsAddress.length;
    }
}