// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EFIR
 * @dev Allows authorized police authorities to anchor an official e-FIR hash to an SOS event.
 */
contract EFIR {
    address public owner;
    mapping(address => bool) public policeAuthorities;
    mapping(uint256 => bytes32) public firHashes; // sosId => efirHash

    event PoliceAuthorityAdded(address indexed authority);
    event EFIRFiled(
        uint256 indexed sosId,
        address indexed policeAuthority,
        bytes32 efirHash
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyPolice() {
        require(policeAuthorities[msg.sender], "Only police can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addPoliceAuthority(address _authority) external onlyOwner {
        policeAuthorities[_authority] = true;
        emit PoliceAuthorityAdded(_authority);
    }

    /**
     * @dev Called by police to file an official FIR hash against an SOS event.
     * @param _sosId The ID of the SOS event from the SosAlert contract.
     * @param _efirHash The hash of the final, official E-FIR document.
     */
    function fileEFIR(uint256 _sosId, bytes32 _efirHash) external onlyPolice {
        require(firHashes[_sosId] == bytes32(0), "E-FIR already filed for this SOS ID");
        firHashes[_sosId] = _efirHash;
        emit EFIRFiled(_sosId, msg.sender, _efirHash);
    }
}