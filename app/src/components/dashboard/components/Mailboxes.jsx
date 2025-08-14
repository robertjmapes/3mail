import { useMailbox } from "../../../stores/mailboxes.jsx";

function MailboxTable({ mailboxes = [] }) {
    return (
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}></th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Mailbox</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Owner</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mailboxes.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", border: "1px solid #ccc", padding: "0.5rem" }}>
                No mailboxes found
              </td>
            </tr>
          ) : (
            mailboxes.map((mb, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{mb.name}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{mb.owner}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  <button>Open</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
}
  
export default function Mailboxes() {
    const { mailboxes, newMailbox } = useMailbox();

    return (
        <div>
            <h2>📬 Mailboxes</h2>

            <MailboxTable mailboxes={mailboxes}/>

            <button style={{marginTop: "1em"}}>New</button>
            <button style={{marginLeft: "1em", marginTop: "1em"}}>Import</button>
      

        </div>
    );
}
