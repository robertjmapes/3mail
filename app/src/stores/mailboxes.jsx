import { createContext, useContext, useState, useEffect } from "react";
import { ethers, getBigInt } from "ethers";

import {  useWallet } from './wallet.jsx'

import {
    utf8ToBytes,
    generatePGPKey,
    encryptMessage,
    bytesToUtf8,
} from '../services/crypto.js'

import MailboxArtifact from '../Mailbox.json';

export function MailboxProvider({ children })
{
    const { signer, provider } = useWallet();  
    const [inbox, setInbox] = useState([]);
    const [mailboxes, setMailboxes] = useState([]);  
    const [contacts, setContacts] = useState([]);

    const queryMailbox = async (address) =>
    {
        const contract = new ethers.Contract(
            address,
            MailboxArtifact.abi,
            signer
        );
        
        try
        {
            const count = await contract.getInboxCount();
            const publicKey = await contract.key(); 
    
            return {
                inboxCount: Number(count),
                publicKey: publicKey
            };
        }
        catch (err)
        {
            console.log("Error querying mailbox:", err);
            throw err;
        }
    };

    // Helper function to add mailbox only if it's unique
    const addMailboxUnique = (mailboxesArray, newMailbox) => {
        // Check uniqueness, for example by address
        const exists = mailboxesArray.some(mailbox => mailbox.address === newMailbox.address);
        if (!exists) {
            setMailboxes([...mailboxesArray, newMailbox]);
        }
    };

    const sendMessage = async (recipientContractAddress, message) =>
    {
        if (!signer) return;
    
        try
        {
            const recipientContract = new ethers.Contract(
                recipientContractAddress,
                MailboxArtifact.abi,
                signer
            );

            let mailboxKey = await recipientContract.key();
            mailboxKey =  bytesToUtf8(mailboxKey);  

            const encryptedMessage = utf8ToBytes(await encryptMessage(mailboxKey, message));            
            const senderAddress = await signer.getAddress();
            
            const payload = senderAddress + message;
            const signature = await signer.signMessage(payload);

            const tx = await recipientContract.sendMessage(encryptedMessage, signature);
            await tx.wait();
        } catch (err) {
        }
    };
    
    const connectMailbox = async (address, privateKey) =>
    {
        if (!address || !privateKey) {
            throw new Error("Address and private key are required");
        }

        // Here you could validate the key, decrypt a test message, etc.
        let res;
        try
        {
            res = await queryMailbox(address);
            console.log(res)
        }
        catch (err) {
            console.log("Contract address is incorrect!");
            return;
        }

        let mailbox = {
            address: address,
            inboxCount: res.inboxCount,
            key: {
                private: privateKey,
                public: res.publicKey
            }               
        }

        addMailboxUnique(mailboxes, mailbox);
    };


    const getInbox = async () =>
    {
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
                let mail = {
                    sender: _mail.sender,
                    message: _mail.message,
                    timestamp: _mail.timestamp
                }
                _inbox.push(mail);
            }
        }
        console.log(_inbox);
        setInbox(_inbox);
    };

    

    const newMailbox = async () =>
    {
        if (!signer)
            return;

        const factory = new ethers.ContractFactory(
            MailboxArtifact.abi,
            MailboxArtifact.bytecode,
            signer
        );

        try
        {
            const key = await generatePGPKey();
            const publicKeyBytes = utf8ToBytes(key.publicKey);
            const contract = await factory.deploy(publicKeyBytes);
            await contract.waitForDeployment(); // wait for confirmation
            
            let res = await queryMailbox(contract.target);
            let mailbox = {
                address: contract.target,
                inboxCount: res.inboxCount,
                key: {
                    private: key.privateKey,
                    public: res.publicKey
                }               
            }
    
            addMailboxUnique(mailboxes, mailbox);
        }
        catch (err)
        {
            console.error(err);
            return;
        }


    };

    useEffect(() =>
    {
        if (mailboxes.length)
        {
            console.log(mailboxes);
        }

    }, [mailboxes]);
    

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
