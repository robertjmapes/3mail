import { useState } from 'react'
import { useMailbox } from '../mailboxes';

export default function Send()
{
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
