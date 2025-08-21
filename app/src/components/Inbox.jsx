import { useState, useEffect } from "react";

import { useMailbox } from "../mailboxes";

// Component to display full mail
function Mail({ mail, onBack }) {
  return (
    <div style={{ padding: "1em" }}>
      <button onClick={onBack} style={{ marginBottom: "1em" }}>← Back to Inbox</button>
      <h3>From: {mail.sender}</h3>
      <p>Message: {mail.message}</p>
      <p>Time: {mail.timestamp}</p>
    </div>
  );
}

function InboxTable({ onSelectMail, inbox = [] }) {

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(inbox.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = inbox.slice(startIndex, startIndex + rowsPerPage);

  console.log(currentData);

  return (
    <div>
      <table style={{ borderCollapse: "collapse", width: "100%", margin: "auto" }}>
        <thead>
          <tr style={{ backgroundColor: "#000", color: "black" }}>
            <th style={{ border: "1px solid #000", padding: "8px" }}>From</th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>Message</th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#fdf6e3" : "#fff" }}
              onClick={() => onSelectMail(row)}
            >
              <td
                style={{
                    border: "1px solid #000",
                    padding: "8px",
                    cursor: "pointer",
                    color: "#000",
                    maxWidth: "1em",           // adjust column width
                    whiteSpace: "nowrap",        // prevent wrapping
                    overflow: "hidden",          // hide overflow
                    textOverflow: "ellipsis",    // add "..." when overflow
                }}
                >
                {row.sender}
              </td>
              <td
                style={{
                    border: "1px solid #000",
                    padding: "8px",
                    cursor: "pointer",
                    color: "#000",
                    maxWidth: "1em",           // adjust column width
                    whiteSpace: "nowrap",        // prevent wrapping
                    overflow: "hidden",          // hide overflow
                    textOverflow: "ellipsis",    // add "..." when overflow
                }}
                >
                {row.message}
              </td>
              <td
                style={{
                    border: "1px solid #000",
                    padding: "8px",
                    cursor: "pointer",
                    color: "#000",
                    width: "120px",      // fixed width for timestamp
                    whiteSpace: "nowrap", // prevent wrapping
                    textAlign: "center",  // optional, center the time
                }}
                >
                {row.timestamp}
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function Inbox()
{
  const [selectedMail, setSelectedMail] = useState(null);

  const {inbox, getInbox} = useMailbox();

  useEffect(() => {
        // This runs once when the component mounts
        const fetchInboxData = async () => {
            try
            {
                await getInbox();
                console.log(inbox);
            }
            catch (err)
            {
                console.error("Failed to fetch inbox:", err);
            }
        };

        fetchInboxData();
    }, []); // empty array => only runs on mount

  if (selectedMail) {
    return <Mail mail={selectedMail} onBack={() => setSelectedMail(null)} />;
  }

  if (!inbox.length) {
    return <>You have got no new mail!</>
  }

  else 
    return <InboxTable onSelectMail={setSelectedMail} inbox={inbox} />;
}
