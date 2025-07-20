import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventPopUp from "./EventPopUp";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    id: 1,
    title: "Meeting",
    start: new Date(moment().add(1, "days").set({ hour: 10, minute: 0 })),
    end: new Date(moment().add(1, "days").set({ hour: 11, minute: 0 })),
  },
  {
    id: 2,
    title: "Lunch Break",
    start: new Date(moment().subtract(20, "days").set({ hour: 12, minute: 0 })),
    end: new Date(moment().subtract(20, "days").set({ hour: 13, minute: 0 })),
  },
];

export default function MyCalendar() {
  const [events, setEvents] = useState(myEventsList);
  const [selectDate, setSelectDate] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvents] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const DnDCalendar = withDragAndDrop(Calendar);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectEvent = (event) => {
    setSelectDate(null);
    setSelectedEvents(event);
    setIsOpenEvent(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectDate(slotInfo.start);
    setSelectedEvents(null);
    setIsOpenEvent(true);
  };

  const generateRecurringEvents = (title, start, end, repeat) => {
    const recurrence = [];
    const maxDate = new Date(start);
    maxDate.setFullYear(maxDate.getFullYear() + 1); 

    let currentStart = new Date(start);
    let currentEnd = new Date(end);
    let idCounter = events.length + 2;

    while (true) {
      let nextStart = new Date(currentStart);
      let nextEnd = new Date(currentEnd);

      switch (repeat) {
        case "weekly":
          nextStart.setDate(nextStart.getDate() + 7);
          nextEnd.setDate(nextEnd.getDate() + 7);
          break;
        case "monthly":
          nextStart.setMonth(nextStart.getMonth() + 1);
          nextEnd.setMonth(nextEnd.getMonth() + 1);
          break;
        case "yearly":
          nextStart.setFullYear(nextStart.getFullYear() + 1);
          nextEnd.setFullYear(nextEnd.getFullYear() + 1);
          break;
        default:
          return [];
      }

      if (nextStart > maxDate) break;

      recurrence.push({
        id: idCounter++,
        title,
        start: nextStart,
        end: nextEnd,
      });

      currentStart = nextStart;
      currentEnd = nextEnd;
    }

    return recurrence;
  };

  const handleSave = (eventData) => {
    const { id, title, start, end, repeat } = eventData;

    if (id) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === id ? { ...eventData } : ev))
      );
    } else {
      const newEvent = {
        id: events.length + 1,
        title,
        start,
        end,
      };

      const recurringEvents = generateRecurringEvents(title, start, end, repeat);
      setEvents((prev) => [newEvent, ...recurringEvents, ...prev]);
    }

    setSelectedEvents(null);
    setIsOpenEvent(false);
    setSelectDate(null);
  };

  const handleEventDrop = ({ start, event, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents((prev) =>
      prev.map((ev) => (ev.id === event.id ? updatedEvent : ev))
    );
  };

return (
  <>
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 0",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          padding: "36px 36px 24px 36px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "2.1rem",
              color: "#2d3a4a",
              letterSpacing: "0.5px",
            }}
          >
            My Calendar
          </h2>
          <button
            style={{
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 22px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(102,126,234,0.12)",
              transition: "background 0.2s",
            }}
            onClick={() => {
              setSelectDate(new Date());
              setSelectedEvents(null);
              setIsOpenEvent(true);
            }}
          >
            + Add Event
          </button>
        </div>
        <input
          type="text"
          placeholder="🔍 Search events by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: "1rem",
            marginBottom: "24px",
            border: "1.5px solid #e2e8f0",
            borderRadius: "8px",
            background: "#f7fafc",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            background: "#f7fafc",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(102,126,234,0.06)",
            padding: "18px",
          }}
        >
          <DnDCalendar
            selectable
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleEventDrop}
            resizable
            onEventResize={handleEventDrop}
            style={{ height: "70vh", background: "#fff", borderRadius: "8px" }}
            popup
          />
        </div>
      </div>
    </div>
    {isOpenEvent && (
      <EventPopUp
        isOpen={isOpenEvent}
        onClose={() => setIsOpenEvent(false)}
        onsave={handleSave}
        date={selectDate}
        event={selectedEvent}
      />
    )}
  </>
);

}
