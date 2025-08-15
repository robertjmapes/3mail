// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Mailbox
{
    event MailReceived(Mail mail);
    event KeyUpdated(bytes key);

    address public immutable owner;
    bytes public key;
    Mail[] private inbox;

    struct Mail
    {
        address sender;
        uint256 timestamp;
        bytes message;
        bytes signature;
    }

    constructor(bytes memory _key)
    {
        owner = msg.sender;
        key = _key;
    }

    function getMail(uint index) external view returns (Mail memory)
    {
        require(index < inbox.length, "No mail at index");
        return inbox[index];
    }

    function sendMail(bytes calldata message, bytes calldata signature) external
    {
        inbox.push(Mail({
            sender: msg.sender,
            timestamp: block.timestamp,
            message: message,
            signature: signature
        }));
    }

    function deleteMail(uint index) external onlyOwner
    {
        require(index < inbox.length, "No mail at index");
        delete inbox[index];
    }

    function getInboxCount() external view returns (uint)
    {
        return inbox.length;
    }

    function clearInbox() external onlyOwner
    {
        delete inbox;
    }

    function updateKey(bytes memory _key) external onlyOwner
    {
        key = _key;
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Only owner is allowed to call this function!");
        _;
    }
}