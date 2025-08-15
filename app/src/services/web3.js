import { ethers } from "ethers";

export async function connectWallet()
{
    if (!window.ethereum)
        throw new Error("No wallet found. Please install MetaMask.");

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    // Check if signer is connected before contiuting...

    return { provider, signer };
}

export async function getAddress(signer)
{
    if (!signer) throw new Error("No signer available");
    return await signer.getAddress();
}

export async function getBalance(provider, address)
{
    if (!provider || !address) throw new Error("Provider or address missing");
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance); 
}

export async function sendTransaction(signer, to, amountEth)
{
    if (!signer) throw new Error("No signer available");

    const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amountEth),
    });

    return await tx.wait();
}

export async function getNetwork(provider)
{
    if (!provider) throw new Error("No provider available");
    return await provider.getNetwork();
}
