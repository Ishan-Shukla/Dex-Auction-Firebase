// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

 contract Ownable {
    address private _owner;

    // event OwnerTransfered(address owner);
    constructor() {
        _owner = msg.sender;
        // emit OwnerTransfered(_owner);
    }

    function setOwner(address newowner)
        onlyOwner
        internal
    {
        _owner = newowner;
        // emit OwnerTransfered(newowner);
    }
    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Only owner of contract can call");
        _;
    }

}
