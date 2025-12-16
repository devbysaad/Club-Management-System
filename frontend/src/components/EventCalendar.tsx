"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "vs Real Madrid",
    time: "21:00",
    type: "match",
    description: "El Clásico - La Liga",
  },
  {
    id: 2,
    title: "Morning Training",
    time: "09:00",
    type: "training",
    description: "First team session",
  },
  {
    id: 3,
    title: "Press Conference",
    time: "14:00",
    type: "media",
    description: "Pre-match conference",
  },
];

const typeStyles: Record<string, { bg: string; border: string; dot: string }> = {
  match: {
    bg: "bg-fcGarnet/20",
    border: "border-l-fcGarnet",
    dot: "bg-fcGarnet",
  },
  training: {
    bg: "bg-fcBlue/20",
    border: "border-l-fcBlue",
    dot: "bg-fcBlue",
  },
  media: {
    bg: "bg-fcGold/20",
    border: "border-l-fcGold",
    dot: "bg-fcGold",
  },
};

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fcBlue/20 flex items-center justify-center">
            <span className="text-xl">📅</span>
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">Schedule</h1>
            <p className="text-xs text-[var(--text-muted)]">Matches & events</p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl overflow-hidden">
        <Calendar onChange={onChange} value={value} />
      </div>

      {/* Events */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-[var(--text-primary)] text-sm">Upcoming Events</h2>
          <span className="text-xs text-fcGold">{events.length} events</span>
        </div>

        <div className="flex flex-col gap-3">
          {events.map((event) => {
            const style = typeStyles[event.type] || typeStyles.training;
            return (
              <div
                key={event.id}
                className={`
                  ${style.bg} rounded-lg p-3
                  border-l-4 ${style.border}
                  hover:bg-opacity-30 transition-all duration-300
                  cursor-pointer group
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-fcGold transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">{event.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-dim)] bg-[var(--bg-surface)] px-2 py-1 rounded">
                    {event.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Button */}
      <button className="mt-4 w-full py-2.5 rounded-lg border border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:border-fcGarnet hover:text-fcGarnet transition-colors text-sm font-medium">
        + Add Event
      </button>
    </div>
  );
};

export default EventCalendar;
