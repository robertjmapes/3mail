// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Mailbox
{
    address public immutable owner;
    Mail[] private inbox;

    struct Mail
    {
        address sender;
        uint256 timestamp;
        bytes message;
        bytes signature;
    }

    constructor()
    {
        owner = msg.sender;
    }

    function sendMessage(bytes calldata message, bytes calldata signature) external
    {
        inbox.push(Mail({
            sender: msg.sender,
            timestamp: block.timestamp,
            message: message,
            signature: signature
        }));
    }

    function getMail(uint index) external view returns (Mail memory)
    {
        require(index < inbox.length, "No mail at index");
        return inbox[index];
    }

    function getInboxCount() external view returns (uint)
    {
        return inbox.length;
    }

    function clearInbox() external onlyOwner
    {
        delete inbox;
    }
    
    function clearMessage(uint index) external onlyOwner
    {
        require(index < inbox.length, "No mail at index");
        delete inbox[index];
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Only owner is allowed to call this function!");
        _;
    }
}