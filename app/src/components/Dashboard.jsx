import { useWallet } from "../wallet";
import { useState } from "react";

import Send from "./Send";
import Settings from "./Settings";
import Inbox from "./Inbox";

export default function Dashboard()
{
    const { signer } = useWallet();
    const isConnected = !!signer;

    const [activeTab, setActiveTab] = useState("Inbox");

    if (!isConnected) {
        return (<>
            <br/><p>Please connect your wallet.</p>
        </>)
    }

    return (
        <div>
            <br/>
            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: "-1px" }}>
                <button
                    onClick={() => setActiveTab("Inbox")}
                    style={{
                        margin: 0,
                        border: "1px solid #ccc",
                        borderBottom: activeTab === "Inbox" ? "none" : "1px solid #ccc",
                        borderRadius: "5px 5px 0 0",
                        backgroundColor: activeTab === "Inbox" ? "#fdf6e3" : "#e4ddcc",
                        color: "black",
                        cursor: "pointer",
                    }}
                >
                    Inbox
                </button>
                <button
                    onClick={() => setActiveTab("Send")}
                    style={{
                        margin: 0,
                        marginLeft: "2px",
                        padding: "0.5em 1em",
                        border: "1px solid #ccc",
                        borderBottom: activeTab === "Send" ? "none" : "1px solid #ccc",
                        borderRadius: "5px 5px 0 0",
                        backgroundColor: activeTab === "Send" ? "#fdf6e3" : "#e4ddcc",
                        color: "black",
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
                <button
                    onClick={() => setActiveTab("Settings")}
                    style={{
                        margin: 0,
                        marginLeft: "2px",
                        padding: "0.5em 1em",
                        border: "1px solid #ccc",
                        borderBottom: activeTab === "Settings" ? "none" : "1px solid #ccc",
                        borderRadius: "5px 5px 0 0",
                        backgroundColor: activeTab === "Settings" ? "#fdf6e3" : "#e4ddcc",
                        color: "black",
                        cursor: "pointer",
                    }}
                >
                    Settings
                </button>
            </div>

            <br/>
            
            {/* Tab content */}
            {activeTab === "Inbox" && <Inbox />}
            {activeTab === "Send" && <Send />}
            {activeTab === "Settings" && <Settings />}
        </div>
    );
}
