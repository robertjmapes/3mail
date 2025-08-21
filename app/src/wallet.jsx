import { createContext, useContext, useState } from "react";
import * as web3 from "./web3.js";

// On disconnect remember to clear store.

const Web3Context = createContext();

export function WalletProvider({ children })
{
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    async function connect()
    {
        try
        {
            const { provider, signer } = await web3.connectWallet();
            setProvider(provider);
            setSigner(signer);
        }
        catch (err)
        {
            console.error(err.message);
        }
    }

    async function disconnect()
    {
        setProvider(null);
        setSigner(null);
        window.location.reload();
    };

    return (
        <Web3Context.Provider value={{ provider, signer, connect, disconnect }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWallet()
{
    return useContext(Web3Context);
}
