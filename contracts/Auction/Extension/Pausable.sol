// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./Ownable.sol";

contract Pausable is Ownable {
    // Stores state of pause.
    bool private _paused;
    // Stores time when paused
    uint256 internal pausedAt;

    // Initializes the contract in unpaused state
    constructor(){
        _paused = false;
    }

    // Returns True if paused else False
    function paused() public view returns (bool) {
        return _paused;
    }

    // Modifiers
    // To make a function callable only when the contract is not paused.
    modifier whenNotPaused() {
        require(!paused(),"System in Paused");
        _;
    }

    // To make a function callable only when the contract is paused.
    modifier whenPaused() {
        require(paused(),"System is Not Paused");
        _;
    }

    // Trigers Stopped state
    function _pause() external whenNotPaused{
        _paused = true;
        pausedAt = block.timestamp;
        // emit Paused(owner());
    }

    // Returns to Normal state
    function _unpause() external whenPaused {
        _paused = false;
        // emit Unpaused(owner());
    }
}