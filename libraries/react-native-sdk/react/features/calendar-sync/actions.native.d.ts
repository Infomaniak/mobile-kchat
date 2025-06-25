/// <reference types="react" />
import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Asks confirmation from the user to add a Jitsi link to the calendar event.
 *
 * @param {string} eventId - The event id.
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: React.Component,
 *     componentProps: (Object | undefined)
 * }}
 */
export declare function openUpdateCalendarEventDialog(eventId: string): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Updates calendar event by generating new invite URL and editing the event
 * adding some descriptive text and location.
 *
 * @param {string} eventId - The event id.
 * @returns {Function}
 */
export declare function updateCalendarEvent(eventId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
