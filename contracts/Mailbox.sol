// SPDX-License-Identifier: MIT

/*
*  A simple implemenation of a Mailbox, 
*  should include retrevial of mail and
*  sending mail, some *base* implemenation
*  of a mailboxes needs to be standardised
*  for application creators.
*/

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
        Mail memory mail = Mail({
            sender: msg.sender,
            timestamp: block.timestamp,
            message: message,
            signature: signature
        });
        inbox.push(mail);
        emit MailReceived(mail);
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
        emit KeyUpdated(_key);
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Only owner is allowed to call this function!");
        _;
    }
}