import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

const EventCalendarContainer = async ({
    searchParams,
}: {
    searchParams: { [keys: string]: string | undefined };
}) => {
    const { date } = searchParams;

    return (
        <div className="glass-card rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-fcBlue/20 flex items-center justify-center">
                        <span className="text-xl">📅</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">
                            Schedule
                        </h1>
                        <p className="text-xs text-[var(--text-muted)]">Matches & events</p>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="rounded-xl overflow-hidden mb-6">
                <EventCalendar />
            </div>

            {/* Events for Selected Date */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-[var(--text-primary)] text-sm">
                        {date ? `Events for ${new Date(date).toLocaleDateString()}` : "Today's Events"}
                    </h2>
                </div>

                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <EventList dateParam={date} />
                </div>
            </div>

            {/* Add Event Button */}
            <button className="mt-4 w-full py-2.5 rounded-lg border border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:border-fcGarnet hover:text-fcGarnet transition-colors text-sm font-medium">
                + Add Event
            </button>
        </div>
    );
};

export default EventCalendarContainer;
