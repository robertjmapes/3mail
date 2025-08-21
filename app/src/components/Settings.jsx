import { useMailbox } from "../mailboxes";
import { useState } from "react";
import LoadingButton from "./LoadingButton";

import { downloadFile } from "../downloadJSON";

function ConnectedMailboxes({viewMailbox})
{
    const { mailboxes } = useMailbox();
    
    return (
        <div>
            <h3>Connected Mailbox</h3>
            {mailboxes.length === 0 ? (
                <p>No mailboxes connected</p>
            ) : (
                <table style={{ borderCollapse: "collapse", width: "95%"}}>
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
                                onClick={() => viewMailbox(mb)}
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
    );
}

function CreateNewMailbox()
{
    const { newMailbox } = useMailbox();
    const [passphrase, setPassphrase] = useState("");
    
    async function createNewMailbox()
    {
        await newMailbox(passphrase);
        setPassphrase("");
    };

    return (
        <div>
            <h3>Create A Mailbox</h3>
            <p>
                Create a new mailbox with a new private key. It will automatically connect to your session, but remember to save the key for later use by exporting the mailbox!
            </p>
            <label>
                Passphrase:{" "}
                    <input
                        type="password"
                        placeholder="Enter passphrase"
                        style={{ width: "95%" }}
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                    />
            </label>
            <br/><br/>
            <LoadingButton onClick={() => createNewMailbox()}>New Mailbox</LoadingButton>
        </div>
    )
}

function ConnectMailbox()
{
    const { connectMailbox } = useMailbox();

    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [passphrase, setPassphrase] = useState("");


    const _connectMailbox = async () =>
    {
        if (!address)
        {
            console.log("Address and private key are required");
            return;
        }

        try
        {
            await connectMailbox(address, privateKey, passphrase); 
        }
        catch (err)
        {
            console.error(err);
        }

        setAddress("");
        setPrivateKey("");
    }

    return (
        <div>
            <h3>Connect A Mailbox</h3>
            <p>
                Connect a pre-existing mailbox. Use the mailbox address and the private key you were given
                for decrypting to add the mailbox!
            </p>
            <div>
                <label>
                    Address:{" "}
                    <input
                        type="text"
                        placeholder="Enter mailbox address"
                        style={{ width: "95%" }}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
            </div>
            <br/>
            <div>
                <label>
                    Key:{" "}
                    <input
                        type="password"
                        placeholder="Enter private key"
                        style={{ width: "95%" }}
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                    />
                </label>
            </div>
            <br/>
            <div>
                <label>
                    Passphrase:{" "}
                    <input
                        type="password"
                        placeholder="Enter passphrase"
                        style={{ width: "95%" }}
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                    />
                </label>
            </div>
            <br/>
            <LoadingButton onClick={() => _connectMailbox()}>Connect Mailbox</LoadingButton>
        </div>
    )
}

function ViewMailbox({viewMailbox, selectedMailbox})
{
    const [passphrase, setPassphrase] = useState("");

    async function _changeKey()
    {
        console.log('Changing key...');
    }

    async function exportMailbox()
    {
        downloadFile(selectedMailbox, `${selectedMailbox.address}.json`);
    }

    return (
        <div>
            <button onClick={() => viewMailbox(null)}>⬅ Back</button>
            <br/><br/>
            <h2>Mailbox Details</h2>
            <button onClick={() => exportMailbox()}>Export Mailbox</button>
            <p><strong>Address:</strong> {selectedMailbox.address}</p>
            <p><strong>Public Key:</strong> {selectedMailbox.key.publicKey}</p>
            <p><strong>Inbox Count:</strong> {selectedMailbox.inboxCount}</p>
            <hr></hr>
            <h2>Change Key</h2>
            <label>
                Passphrase:{" "}
                    <input
                        type="password"
                        placeholder="Enter passphrase"
                        style={{ width: "95%" }}
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                    />
            </label>
            <br/><br/>
            <LoadingButton onClick={() => createNewMailbox()}>Change Key</LoadingButton>
        </div>
    );
}

export default function Settings()
{
    const { queryMailbox } = useMailbox();
    const [selectedMailbox, setSelectedMailbox] = useState(null);

    async function viewMailbox(mailbox)
    { 
        if (mailbox == null)
        {
            setSelectedMailbox(null);
            return;
        }
        
        await queryMailbox(mailbox);
        setSelectedMailbox(mailbox);
    }

    if (selectedMailbox)
    {
        return <ViewMailbox viewMailbox={viewMailbox} selectedMailbox={selectedMailbox}/>
    }

    return (
        <div>
            <div>
                <h2>Mailboxes</h2>
                <ConnectedMailboxes viewMailbox={viewMailbox}/>
                <CreateNewMailbox/>
                <ConnectMailbox/>
            </div>
            <br/><hr/>
            <p>If you encounter any troubles please read the documentation linked <a href='https://github.com/robertjmapes/3mail'>here.</a></p>
        </div>
    );
}
