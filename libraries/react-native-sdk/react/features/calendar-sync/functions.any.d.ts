/**
 * Updates the calendar entries in redux when new list is received. The feature
 * calendar-sync doesn't display all calendar events, it displays unique
 * title, URL, and start time tuples, and it doesn't display subsequent
 * occurrences of recurring events, and the repetitions of events coming from
 * multiple calendars.
 *
 * XXX The function's {@code this} is the redux store.
 *
 * @param {Array<CalendarEntry>} events - The new event list.
 * @private
 * @returns {void}
 */
export declare function _updateCalendarEntries(events: Array<Object>): void;
