import { useMailbox } from "../stores/mailboxes";
import { useState } from "react";

export default function Settings() {
    const { newMailbox, mailboxes, connectMailbox, queryMailbox } = useMailbox();
    const [selectedMailbox, setSelectedMailbox] = useState(null);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    const _newMailbox = async () => {
        await newMailbox();
    };

    const _connectMailbox = async () =>
    {
        console.log(address, privateKey); // appears here
        await connectMailbox(address, privateKey); //undefined here
        setAddress("");
        setPrivateKey("");
    }

    const _viewMailbox = async (mailbox) =>
    { 
        if (mailbox == null)
        {
            setSelectedMailbox(null);
            return
        }
        
        await queryMailbox(mailbox.address);
        setSelectedMailbox(mailbox);
    }

    // Show single mailbox view
    if (selectedMailbox) {
        return (
            <div>
                <button onClick={() => _viewMailbox(null)}>⬅ Back</button>
                <h2>Mailbox Details</h2>
                <p><strong>Address:</strong> {selectedMailbox.address}</p>
                <p><strong>Inbox Count:</strong> {selectedMailbox.inboxCount}</p>
                <p><strong>Public Key:</strong> {selectedMailbox.key.public}</p>
                <p><strong>Private Key:</strong> {selectedMailbox.key.private}</p>
            </div>
        );
    }

    // Show mailbox list
    return (
        <div>
            <div>
                <h2>Mailboxes</h2>
                <div>
                <h3>Connected Mailbox</h3>
                    {mailboxes.length === 0 ? (
                        <p>No mailboxes connected</p>
                    ) : (
                        <table style={{ borderCollapse: "collapse", width: "100%"}}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid #000", padding: "8px" }}>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mailboxes.map((mb, idx) => (
                                    <tr
                                        key={idx}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => _viewMailbox(mb)}
                                    >
                                        <td style={{ border: "1px solid #000", padding: "8px" }}>
                                            <u>{mb.address}</u>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>

                <div style={{ marginBottom: "20px" }}>
                    <h3>Create A Mailbox</h3>
                    <p>
                        Create a new mailbox with a new private key. It will automatically connect to your session,
                        but remember to save the key for later use!
                    </p>
                    <button onClick={_newMailbox}>New Mailbox</button>
                </div>

                <div>
                    <h3>Connect A Mailbox</h3>
                    <p>
                        Connect a pre-existing mailbox. Use the mailbox address and the private key you were given
                        for decrypting to add the mailbox!
                    </p>

                    <div style={{ marginBottom: "10px", marginRight: "20px" }}>
                        <label>
                            Address:{" "}
                            <input
                                type="text"
                                placeholder="Enter mailbox address"
                                style={{ width: "100%" }}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: "10px", marginRight: "20px" }}>
                        <label>
                            Key:{" "}
                            <input
                                type="password"
                                placeholder="Enter private key"
                                style={{ width: "100%" }}
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                            />
                        </label>
                    </div>

                    <button onClick={() => _connectMailbox()}>Connect Mailbox</button>
                </div>
            </div>
        </div>
    );
}
