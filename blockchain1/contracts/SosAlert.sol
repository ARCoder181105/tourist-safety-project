// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SosAlert
 * @dev Logs SOS events from users, creating an immutable on-chain audit trail.
 */
contract SosAlert {
    uint256 public sosCounter;

    event SosTriggered(
        uint256 indexed sosId,
        address indexed tourist,
        bytes32 initialReportHash,
        uint256 timestamp
    );

    /**
     * @dev Called by a tourist's app to log an SOS event.
     * @param _initialReportHash The hash of the initially encrypted E-FIR packet.
     */
    function triggerSOS(bytes32 _initialReportHash) external {
        sosCounter++;
        emit SosTriggered(
            sosCounter,
            msg.sender,
            _initialReportHash,
            block.timestamp
        );
    }
}