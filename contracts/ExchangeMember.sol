// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract ExchangeMember {
    address public memberAddress;
    string public firstName;
    string public lastName;
    
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
        memberAddress = tx.origin;
        firstName = _firstName;
        lastName = _lastName;
    }

    modifier onlyJoinedProgram(address _programAddress) {
        require(
            programPoints[_programAddress].isRegistered,
            "You have not joined the loyalty program."
        );
        _;
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

    function addPoints(address _programAddress, uint256 _points) external onlyJoinedProgram(_programAddress) {
        programPoints[_programAddress].points += _points;
    }

    function deductPoints(address _programAddress, uint256 _points) external onlyJoinedProgram(_programAddress) {
        require(
            programPoints[_programAddress].points >= _points,
            "You do not have enough points to deduct."
        );

        programPoints[_programAddress].points -= _points;
    }

    function programsLength() public view returns(uint256) {
        return programPointsAddress.length;
    }
}