import { useState } from "react";

import { useWallet } from "../stores/wallet";
import {  useMailbox } from "../stores/mailboxes"


function Send() {
  const { sendMessage } = useMailbox();
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const _sendMessage = async () => {
    if (!recipient) {
      return;
    }
    sendMessage(recipient, message);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          To:
          <input
            type="text"
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Message:
          <textarea
            placeholder="Your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
      </div>

      <button onClick={() => _sendMessage()} style={{ padding: "0.5rem 1rem" }}>
        Send
      </button>
    </div>
  );
}

  function MailboxTable({ inbox = [] }) {
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
            <thead>
                <tr>
                    <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Mailbox Address</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Message</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>From</th>
                </tr>
            </thead>
            <tbody>
                {inbox.length === 0 ? (
                    <tr>
                        <td colSpan={3} style={{ textAlign: "center", border: "1px solid #ccc", padding: "0.5rem" }}>
                            No messages found
                        </td>
                    </tr>
                ) : (
                    inbox.flatMap((mb) =>
                        (mb.mails || []).map((mail, i) => (
                            <tr key={`${mb.target}-${i}`}>
                                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{mb.target}</td>
                                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{mail.message}</td>
                                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{mail.from}</td>
                            </tr>
                        ))
                    )
                )}
            </tbody>
        </table>
    );
}



function Mailboxes() {
  const { mailboxes, newMailbox, inbox } = useMailbox();
  const [showImport, setShowImport] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [activeTab, setActiveTab] = useState("Inbox"); // "Inbox" or "Send"

  const handleImport = () => {
      if (!importValue) return;
      setImportValue("");
      setShowImport(false);
  };

  return (
    <div>
        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "-1px" /* so active tab connects to content */ }}>
    <button
        onClick={() => setActiveTab("Inbox")}
        style={{
            margin: "0",
            padding: "0.5em 1em",
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
            margin: "0",
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
        </div>

        {/* Tab content */}
        {activeTab === "Inbox" && (
            <div>
              <br/>
                <MailboxTable inbox={inbox}/>

                <button style={{ marginTop: "1em" }} onClick={() => newMailbox()}>New</button>
                <button
                    style={{ marginLeft: "1em", marginTop: "1em" }}
                    onClick={() => setShowImport(!showImport)}
                >
                    {showImport ? "Close" : "Import"}
                </button>

                {showImport && (
                    <div style={{ marginTop: "1em" }}>
                        <input
                            type="text"
                            value={importValue}
                            onChange={(e) => setImportValue(e.target.value)}
                            placeholder="Enter mailbox name or ABI"
                            style={{ marginRight: "0.5em" }}
                        />
                        <button onClick={handleImport}>Submit</button>
                    </div>
                )}
            </div>
        )}

        {activeTab === "Send" && (
            <div>
              <br/>
                <Send />
            </div>
        )}
    </div>
);
}


export default function Dashboard()
{
    const { signer } = useWallet();
    const isConnected = !!signer;

    return (
        <>
            <br/>

            {isConnected ? (
            <>
                <Mailboxes />
            </>
            ) : (
                <p>Please connect your wallet.</p>
            )}
        </>
    );
}