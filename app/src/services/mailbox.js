import { ethers } from "ethers";

// get all mails from a deployed Mailbox contract
export async function fetchMailboxMails(provider, mailboxAddress, limit = 25) {
    if (!provider) throw new Error("Provider is required");

    const mailboxAbi = [
        "function getInboxCount() view returns (uint)",
        "function getMail(uint) view returns (tuple(address sender, uint256 timestamp, bytes message, bytes signature))"
    ];

    const mailboxContract = new ethers.Contract(mailboxAddress, mailboxAbi, provider);

    const count = await mailboxContract.getInboxCount();
    const mails = [];

    const max = Math.min(count, limit);

    for (let i = 0; i < max; i++) {
        const mail = await mailboxContract.getMail(i);
        mails.push({
            from: mail.sender,
            message: ethers.utils.toUtf8String(mail.message), // assuming message is utf8 bytes
            timestamp: mail.timestamp.toNumber()
        });
    }

    return mails;
}
