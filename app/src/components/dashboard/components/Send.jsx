export default function Send() {
    return (
      <div>
        <h2>🖊️ Send A Message</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            To:
            <input
              type="text"
              placeholder="Recipient address"
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>
        </div>
  
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Message:
            <textarea
              placeholder="Your message here"
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>
        </div>
  
        <button style={{ padding: "0.5rem 1rem" }}>Send A Message</button>
      </div>
    );
  }
  