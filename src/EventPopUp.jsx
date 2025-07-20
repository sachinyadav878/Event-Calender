import { useEffect, useState } from "react";

function formatLocalDateTime(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventPopUp({ isOpen, onClose, onsave, date, event }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [repeat, setRepeat] = useState("none");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStart(formatLocalDateTime(new Date(event.start)));
      setEnd(formatLocalDateTime(new Date(event.end)));
      setRepeat(event.repeat || "none");
    } else if (date) {
      const defaultStart = new Date(date);
      const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);
      setStart(formatLocalDateTime(defaultStart));
      setEnd(formatLocalDateTime(defaultEnd));
      setRepeat("none");
    }
  }, [event, date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onsave({
      id: event?.id,
      title,
      start: new Date(start),
      end: new Date(end),
      repeat,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(40, 50, 80, 0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)",
          padding: "36px 32px 28px 32px",
          borderRadius: "18px",
          width: "410px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            color: "#888",
            cursor: "pointer",
            fontWeight: 600,
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2
          style={{
            margin: "0 0 18px 0",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#2d3a4a",
            letterSpacing: "0.2px",
            textAlign: "center",
          }}
        >
          {event ? "Edit Event" : "Add Event"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
                color: "#4a5568",
                fontSize: "1rem",
              }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "7px",
                fontSize: "1rem",
                background: "#f7fafc",
                outline: "none",
                transition: "border 0.2s",
              }}
              placeholder="Event title"
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
                color: "#4a5568",
                fontSize: "1rem",
              }}
            >
              Start
            </label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "7px",
                fontSize: "1rem",
                background: "#f7fafc",
                outline: "none",
                transition: "border 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
                color: "#4a5568",
                fontSize: "1rem",
              }}
            >
              End
            </label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "7px",
                fontSize: "1rem",
                background: "#f7fafc",
                outline: "none",
                transition: "border 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
                color: "#4a5568",
                fontSize: "1rem",
              }}
            >
              Repeat
            </label>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "7px",
                fontSize: "1rem",
                background: "#f7fafc",
                outline: "none",
                transition: "border 0.2s",
              }}
            >
              <option value="none">None</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#e2e8f0",
                color: "#2d3a4a",
                border: "none",
                borderRadius: "7px",
                padding: "10px 22px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                padding: "10px 22px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(102,126,234,0.10)",
                transition: "background 0.2s",
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}