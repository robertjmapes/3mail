import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import * as openpgp from 'openpgp';

import {  useWallet } from './wallet.jsx'

import MailboxArtifact from '../Mailbox.json'

const MailboxContext = createContext();

export function MailboxProvider({ children }) {
    const { signer, provider } = useWallet();  

    const [inbox, setInbox] = useState([]);
    const [mailboxes, setMailboxes] = useState([]);


    
    const sendMessage = async (mailboxAddress, message) => {
        try {
            // 1. Get the mailbox contract instance
            const contract = new ethers.Contract(mailboxAddress, MailboxArtifact.abi, signer);
    
            // 2. Fetch recipient's stored PGP public key from the contract
            const publicKeyBytes = await contract.key();
            console.log(publicKeyBytes);

            const publicKeyArmored = bytesToUtf8(publicKeyBytes); // <-- using our JS helper
    
            // 3. Encrypt the message with recipient's PGP public key
            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: message }),
                encryptionKeys: publicKey
            });
    
            // 4. Sign the plaintext message with sender's Ethereum key
            const signature = await signer.signMessage(message);
    
            // 5. Send encrypted message + signature to the smart contract
            const tx = await contract.sendMessage(
                ethers.toUtf8Bytes(encrypted), // v6 helper
                ethers.toUtf8Bytes(signature)
            );
            await tx.wait();
    
            console.log("Message sent successfully!");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    
    

    // Get all the messages from all the inboxes
    const getInbox = async () => {
        const updatedMailboxes = await Promise.all(
            mailboxes.map(async (mb) => {
                const count = await mb.contract.getInboxCount();
                const limit = Math.min(count, 25); // cap at 25
                const mails = [];
    
                for (let i = 0; i < limit; i++) {
                    const mail = await mb.contract.getMail(i);
                    mails.push({
                        from: mail.sender,
                        timestamp: mail.timestamp,
                        message: ethers.utils.toUtf8String(mail.message)
                    });
                }
    
                return {
                    ...mb,
                    mails
                };
            })
        );
    
        setInbox(updatedMailboxes);
    };

    const newMailbox = async () => {
        if (!signer) {
            console.error("No signer available");
            return;
        }

        const factory = new ethers.ContractFactory(
            MailboxArtifact.abi,
            MailboxArtifact.bytecode,
            signer
        );

        try
        {
            // 1. Generate a PGP keypair
            const key = await openpgp.generateKey({
                type: 'rsa',       // or 'ecc'
                rsaBits: 2048,
                userIDs: [{ name: "Mailbox Owner", email: "owner@example.com" }],
                passphrase: ''     // optional
            });

            // 2. Log the private key for now (keep secure!)
            console.log("PRIVATE KEY (keep secret!):\n", key.privateKey);

            // 3. Convert the public key to bytes so it can be passed to the contract
            const publicKeyBytes = bytesToUtf8(key.publicKey);

            // 4. Deploy contract with the public key
            const contract = await factory.deploy(publicKeyBytes);

            console.log("Deploying contract...");
            await contract.waitForDeployment();
            console.log("Contract deployed at:", contract.target);

        
            await contract.waitForDeployment(); // wait for confirmation

            setMailboxes(prevMailboxes => [
                ...prevMailboxes, 
                {
                    contract: contract
                }
            ]);

            await getInbox();

            console.log(contract);
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
    }, []);

    return (
        <MailboxContext.Provider value={{ mailboxes, newMailbox, inbox, sendMessage }}>
            {children}
        </MailboxContext.Provider>
    );
}

export const useMailbox = () => useContext(MailboxContext);
