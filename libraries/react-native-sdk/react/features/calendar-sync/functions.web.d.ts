import { IStore } from '../app/types';
import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Determines whether the calendar feature is enabled by the web.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean} If the app has enabled the calendar feature, {@code true};
 * otherwise, {@code false}.
 */
export declare function isCalendarEnabled(stateful: IStateful): boolean;
/**
 * Reads the user's calendar and updates the stored entries if need be.
 *
 * @param {Object} store - The redux store.
 * @param {boolean} _maybePromptForPermission - Flag to tell the app if it should
 * prompt for a calendar permission if it wasn't granted yet.
 * @param {boolean|undefined} _forcePermission - Whether to force to re-ask for
 * the permission or not.
 * @private
 * @returns {void}
 */
export declare function _fetchCalendarEntries(store: IStore, _maybePromptForPermission: boolean, _forcePermission?: boolean): void;
/**
 * Returns the calendar API implementation by specified type.
 *
 * @param {string} calendarType - The calendar type API as defined in
 * the constant {@link CALENDAR_TYPE}.
 * @private
 * @returns {Object|undefined}
 */
export declare function _getCalendarIntegration(calendarType: string): {
    getCalendarEntries: typeof import("../google-api/actions").getCalendarEntries;
    getCurrentEmail(): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>) => any;
    load(): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>) => any;
    signIn: typeof import("../google-api/actions").signIn;
    _isSignedIn(): () => any;
    updateCalendarEvent: typeof import("../google-api/actions").updateCalendarEvent;
} | {
    getCalendarEntries(fetchStartDays?: number | undefined, fetchEndDays?: number | undefined): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => Promise<any>;
    getCurrentEmail(): Function;
    load(): () => Promise<void>;
    signIn(): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => any;
    _isSignedIn(): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => Promise<any>;
    updateCalendarEvent(id: string, calendarId: string, location: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => Promise<any>;
} | undefined;
