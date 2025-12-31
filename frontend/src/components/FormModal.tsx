"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// =========================
// LOADER COMPONENT
// =========================
function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-fcGarnet border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// =========================
// PLACEHOLDER FORM
// =========================
const PlaceholderForm = ({ type, table }: { type: "create" | "update"; table: string }) => (
  <div className="p-8 text-center text-[var(--text-muted)]">
    {table} form {type} coming soon.
  </div>
);

// =========================
// DYNAMIC FORMS
// =========================
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), { loading: Loader });
const StudentForm = dynamic(() => import("./forms/StudentForm"), { loading: Loader });

// =========================
// FORMS MAPPING
// =========================
const forms: Record<string, (type: "create" | "update", data?: any) => JSX.Element> = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  parent: (type) => <PlaceholderForm type={type} table="Parent" />,
  subject: (type) => <PlaceholderForm type={type} table="Training Program" />,
  class: (type) => <PlaceholderForm type={type} table="Team" />,
  lesson: (type) => <PlaceholderForm type={type} table="Session" />,
  exam: (type) => <PlaceholderForm type={type} table="Match" />,
  assignment: (type) => <PlaceholderForm type={type} table="Stats" />,
  result: (type) => <PlaceholderForm type={type} table="Result" />,
  attendance: (type) => <PlaceholderForm type={type} table="Attendance" />,
  event: (type) => <PlaceholderForm type={type} table="Event" />,
  announcement: (type) => <PlaceholderForm type={type} table="Announcement" />,
};

// =========================
// DISPLAY NAMES
// =========================
const displayNames: Record<string, string> = {
  teacher: "Coach",
  student: "Player",
  parent: "Parent",
  subject: "Training Program",
  class: "Team",
  lesson: "Session",
  exam: "Match",
  assignment: "Stats",
  result: "Result",
  attendance: "Attendance",
  event: "Event",
  announcement: "Announcement",
};

// =========================
// MAIN COMPONENT
// =========================
const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: keyof typeof displayNames;
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string
}) => {
  const [open, setOpen] = useState(false);

  const size = type === "create" ? "w-9 h-9" : "w-8 h-8";
  const bgColor =
    type === "create"
      ? "bg-gradient-to-r from-fcGarnet to-fcGarnetLight shadow-glow-garnet hover:shadow-lg hover:scale-105"
      : type === "update"
      ? "bg-fcBlue/20 hover:bg-fcBlue/30 border border-fcBlue/30"
      : "bg-fcGarnet/10 hover:bg-fcGarnet/20 border border-fcGarnet/30";

  const Form = () => {
    if (type === "delete") {
      if (!id)
        return (
          <div className="p-8 text-center text-[var(--text-muted)]">
            Invalid delete request.
          </div>
        );

      return (
        <form className="p-8 flex flex-col items-center gap-6 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-fcGarnet/10 flex items-center justify-center border-2 border-fcGarnet/20">
            <svg className="w-10 h-10 text-fcGarnet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-2">
              Delete {displayNames[table]}?
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-sm">
              This action cannot be undone. All data related to this {displayNames[table].toLowerCase()} will be permanently deleted.
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-surface-light)] transition-all"
            >
              Cancel
            </button>

            <button className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-semibold shadow-glow-garnet hover:opacity-90 transition-all">
              Delete
            </button>
          </div>
        </form>
      );
    }

    if (forms[table]) return forms[table](type, data);

    return (
      <div className="p-8 text-center text-[var(--text-muted)]">
        Form not found!
      </div>
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-xl ${bgColor} transition-all duration-300`}
        onClick={() => setOpen(true)}
      >
        {type === "create" ? (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        ) : type === "update" ? (
          <svg className="w-4 h-4 text-fcBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-fcGarnet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0  bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[var(--border-color)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* HEADER */}
            <div className="sticky top-0 bg-[var(--bg-sidebar)] border-b border-[var(--border-color)] p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    type === "delete" ? "bg-fcGarnet/20" : type === "create" ? "bg-fcGreen/20" : "bg-fcBlue/20"
                  }`}
                >
                  {type === "delete" ? (
                    <svg className="w-5 h-5 text-fcGarnet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : type === "create" ? (
                    <svg className="w-5 h-5 text-fcGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-fcBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>

                <div>
                  <h1 className="text-lg font-heading font-bold text-[var(--text-primary)] capitalize">
                    {type} {displayNames[table]}
                  </h1>
                  <p className="text-xs text-[var(--text-muted)]">
                    {type === "delete"
                      ? "Confirm deletion"
                      : type === "create"
                      ? "Fill in the details below"
                      : "Update the information"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] hover:bg-fcGarnet/20 flex items-center justify-center transition-colors group"
              >
                <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-fcGarnet transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* BODY */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Form />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
