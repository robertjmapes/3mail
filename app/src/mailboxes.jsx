import { createContext, useContext, useState, useEffect } from "react";
import { ethers, getBigInt } from "ethers";

import {  useWallet } from './wallet.jsx'

import {
    utf8ToBytes,
    generatePGPKey,
    encryptMessage,
    bytesToUtf8,
    decryptMessage,
} from './crypto.js'

import MailboxArtifact from './Mailbox.json';

export function MailboxProvider({ children })
{
    const { signer } = useWallet();
    const [inbox, setInbox] = useState([]);
    const [mailboxes, setMailboxes] = useState([]);  

    const queryMailbox = async (mailbox) =>
    {
        const contract = new ethers.Contract(
            mailbox.address,
            MailboxArtifact.abi,
            signer
        );

        try
        {
            mailbox.inboxCount = await contract.getInboxCount();
            mailbox.key.publicKey = await contract.key();
            mailbox.owner = await contract.owner();
        }
        catch (err)
        {
            console.log("Error querying mailbox:", err);
            throw err;
        }
    };

    const addMailbox = (mailboxesArray, newMailbox) =>
    {
        const exists = mailboxesArray.some(mailbox => mailbox.address === newMailbox.address);
        if (!exists) 
            setMailboxes([...mailboxesArray, newMailbox]);
    };

    const sendMessage = async (address, message) =>
    {
        if (!signer) return;
    
        try
        {
            const contract = new ethers.Contract(address, MailboxArtifact.abi, signer);

            let mailboxKey = await contract.key();
            mailboxKey =  bytesToUtf8(mailboxKey);  

            const encryptedMessage = utf8ToBytes(await encryptMessage(mailboxKey, message));            
            const senderAddress = await signer.getAddress();
            
            const payload = senderAddress + message;
            const signature = await signer.signMessage(payload);

            const tx = await contract.sendMessage(encryptedMessage, signature);
            await tx.wait();
        }
        catch (err)
        {
            throw Error(err);
        }
        return;
    };
    
    async function connectMailbox(address, privateKey, passphrase)
    {        
        const contract = new ethers.Contract(
            address,
            MailboxArtifact.abi,
            signer
        );

        try 
        {
            const _owner = await contract.owner();
            
            if (_owner != await signer.getAddress())
                throw Error("Signer is not owner of mailbox! Refusing connection!");

            const _inboxCount = await contract.getInboxCount();
            const _publicKey = await contract.key();

            let mailbox = {
                owner: _owner,
                address: address,
                inboxCount: _inboxCount,
                key: {
                    private: privateKey,
                    public: _publicKey
                },
                passphrase: passphrase
            }
            addMailbox(mailboxes, mailbox);
        }
        catch (err)
        { }
    };


    const getInbox = async () =>
    {
        console.log('getting inbox')
        let _inbox = [];
        for (let i=0; i < mailboxes.length; i++)
        {
            const recipientContract = new ethers.Contract(
                mailboxes[i].address,
                MailboxArtifact.abi,
                signer
            );
            const count = await recipientContract.getInboxCount();
            for (let j=0; j < count; j++)
            {
                let _mail = await recipientContract.getMail(j);
                let decryptedMessage = await decryptMessage(mailboxes[i].key.privateKey, mailboxes[i].passphrase, bytesToUtf8(_mail.message));
                
                console.log(decryptedMessage);
                let mail = {
                    sender: _mail.sender,
                    message: decryptedMessage,
                    timestamp: _mail.timestamp
                }
                _inbox.push(mail);
            }
        }
        setInbox(_inbox);
    };

    async function changeKey(mailbox, newKey, passphrase)
    {
        const contract = new ethers.Contract(mailbox.address, MailboxArtifact.abi, signer);
        mailbox.changeKey(newKey);

    }

    async function newMailbox(passphrase)
    {
        const factory = new ethers.ContractFactory(
            MailboxArtifact.abi,
            MailboxArtifact.bytecode,
            signer
        );

        try
        {
            const key = await generatePGPKey(null, null, passphrase);
            const publicKeyBytes = utf8ToBytes(key.publicKey);
            const contract = await factory.deploy(publicKeyBytes);
            await contract.waitForDeployment(); // wait for confirmation
            
            let mailbox = {
                address: contract.target,
                inboxCount: 0,
                key: {
                    privateKey: key.privateKey,
                    publicKey: key.publicKey
                },
                passphrase: passphrase
            }
            await queryMailbox(mailbox);
            addMailbox(mailboxes, mailbox);
        }
        catch (err)
        {
            return err;
        }
    };
   

    return (
        <MailboxContext.Provider value={{
            mailboxes,
            newMailbox,
            inbox,
            sendMessage,
            getInbox,
            connectMailbox,
            queryMailbox
         }}>
            {children}
        </MailboxContext.Provider>
    );
}

const MailboxContext = createContext();
export const useMailbox = () => useContext(MailboxContext);
