/**
 * The type of (redux) action which begins the UI procedure to share the current
 * conference/room URL.
 *
 * {
 *     type: BEGIN_SHARE_ROOM,
 *     roomURL: string,
 *     includeDialInfo: boolean
 * }
 */
export declare const BEGIN_SHARE_ROOM = "BEGIN_SHARE_ROOM";
/**
 * The type of (redux) action which ends the UI procedure to share a specific
 * conference/room URL.
 *
 * {
 *     type: END_SHARE_ROOM,
 *     roomURL: string,
 *     shared: boolean
 * }
 */
export declare const END_SHARE_ROOM = "END_SHARE_ROOM";
/**
 * The type of (redux) action which toggles the share meeting url dialog visibility.
 *
 * {
 *     type: TOGGLE_SHARE_DIALOG,
 *     visible: boolean
 * }
 */
export declare const TOGGLE_SHARE_DIALOG = "TOGGLE_SHARE_DIALOG";
