import Mailboxes from "./components/Mailboxes";
import Send from "./components/Send";

import { useWallet } from "../../stores/wallet";

export default function Dashboard()
{
    const { signer } = useWallet();
    const isConnected = !!signer;

    return (
        <>
            <br/>
            {isConnected ? (
            <>
                <Send />
                <br/>
                <Mailboxes />
                
            </>
            ) : (
                <p>Please connect your wallet.</p>
            )}
        </>
    );
}