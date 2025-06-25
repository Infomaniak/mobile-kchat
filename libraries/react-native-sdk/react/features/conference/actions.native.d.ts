import { IStore } from '../app/types';
/**
 * Notify that we've been kicked out of the conference.
 *
 * @param {JitsiParticipant} participant - The {@link JitsiParticipant}
 * instance which initiated the kick event.
 * @param {?Function} submit - The function to execute after submiting the dialog.
 * @returns {Function}
 */
export declare function notifyKickedOut(participant: any, submit?: Function): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Notify that we've been kicked out of the conference.
 *
 * @param {string} reasonKey - The translation key for the reason why the conference failed.
 * @param {?Function} submit - The function to execute after submiting the dialog.
 * @returns {Function}
 */
export declare function notifyConferenceFailed(reasonKey: string, submit?: Function): (dispatch: IStore['dispatch']) => void;
/**
 * Dismisses calendar notification about next or ongoing event.
 *
 * @returns {Object}
 */
export declare function dismissCalendarNotification(): {
    type: string;
};
