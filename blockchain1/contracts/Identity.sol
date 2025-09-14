// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Identity
 * @dev Maps a user's wallet address to a hash of their encrypted off-chain credentials.
 */
contract Identity {
    mapping(address => bytes32) public credentialHashes;
    event UserRegistered(address indexed user, bytes32 credentialHash);

    function registerUser(bytes32 _credentialHash) external {
        credentialHashes[msg.sender] = _credentialHash;
        emit UserRegistered(msg.sender, _credentialHash);
    }
}