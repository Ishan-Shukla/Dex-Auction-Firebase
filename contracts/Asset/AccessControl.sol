// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "hardhat/console.sol";

contract AccessControl {
    //This contract controls access control for DEX-Auction. There are 2 main role:
    //
    //    - The CEO: The CEO can reassign other roles and change the addresses of the dependent smart
    //         contracts. It is also the only role that can unpause the smart contract. It is initially
    //         set to the address that created the smart contract in the assetCore constructor.
    //
    //    - The CFO: The CFO can withdraw funds from assetCore and its auction contracts.


    // The address of the accounts that have there roles assigned.
    address public ceoAddress;
    address public cfoAddress;

    // Keeps track whether the contract is paused.
    bool public paused = false;

    constructor(){
        ceoAddress = msg.sender;
        cfoAddress = msg.sender;
    }

    // modifier for CEO-only functionality
    modifier onlyCEO() {
        require(msg.sender == ceoAddress,"Only CEO is Authorized");
        _;
    }

    // modifier for CFO-only functionality
    modifier onlyCFO() {
        require(msg.sender == cfoAddress,"Only CFO is Authorized");
        _;
    }

    // Only Chiefs can access
    modifier onlyChiefs() {
        require(
            msg.sender == ceoAddress ||
            msg.sender == cfoAddress 
        ,"Only Chiefs is Authorized");
        _;
    }

    // To allow actions only when contract is not paused
    modifier whenNotPaused() {
        require(!paused,"System is Paused");
        _;
    }

    // To allow actions only when contract is paused
    modifier whenPaused {
        require(paused,"System is Not Paused");
        _;
    }

    // Assigns a new address to act as CEO
    function setCEO(address _newCEO) internal onlyCEO {
        require(_newCEO != address(0),"Invalid CEO Address");
        ceoAddress = _newCEO;
    }

    // Assigns a new address to act as CFO
    function setCFO(address _newCFO) internal onlyCEO {
        require(_newCFO != address(0),"Invalid CFO Address");
        cfoAddress = _newCFO;
    }

    // Only called by Chiefs to pause 
    function pause() internal onlyChiefs whenNotPaused {
        paused = true;
    }

    // Only called by CEO to unpause
    function unpause() internal onlyCEO whenPaused {
        paused = false;
    }
}