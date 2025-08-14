import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import {  useWallet } from './wallet.jsx'

import MailboxArtifact from '../Mailbox.json'

const MailboxContext = createContext();

export function MailboxProvider({ children }) {
    const { signer, provider } = useWallet();  

    const [mailboxes, setMailboxes] = useState([
    ]);

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

        // Deploy contract
        const contract = await factory.deploy(
            signer.address
        );

        console.log("Deploying contract...");
        console.log(contract);
        await contract.deployed(); // wait for confirmation
        console.log("Contract deployed at:", contract.address);
        console.log(contract);
        return contract;
    };

    useEffect(() => {
    }, []);

    return (
        <MailboxContext.Provider value={{ mailboxes, newMailbox }}>
            {children}
        </MailboxContext.Provider>
    );
}

export const useMailbox = () => useContext(MailboxContext);
