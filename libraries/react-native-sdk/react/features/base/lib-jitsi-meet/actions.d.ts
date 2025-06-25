import { IStore } from '../../app/types';
/**
 * Disposes (of) lib-jitsi-meet.
 *
 * @returns {Function}
 */
export declare function disposeLib(): (dispatch: IStore['dispatch']) => void;
/**
 * Initializes lib-jitsi-meet (i.e. {@link invokes JitsiMeetJS.init()}) with the
 * current config(uration).
 *
 * @returns {Function}
 */
export declare function initLib(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Notifies about a specific error raised by {@link JitsiMeetJS.init()}.
 *
 * @param {Error} error - The Error raised by JitsiMeetJS.init().
 * @returns {{
 *     type: LIB_INIT_ERROR,
 *     error: Error
 * }}
 */
export declare function libInitError(error: Error): {
    type: string;
    error: Error;
};
