import { IStore } from '../app/types';
/**
 * Creates a (redux) action which signals that the list of known remote virtual screen share participant ids has
 * changed.
 *
 * @param {string} participantIds - The remote virtual screen share participants.
 * @returns {{
 *     type: VIRTUAL_SCREENSHARE_REMOTE_PARTICIPANTS_UPDATED,
 *     participantIds: Array<string>
 * }}
 */
export declare function virtualScreenshareParticipantsUpdated(participantIds: Array<string>): {
    type: string;
    participantIds: string[];
};
/**
 * Creates a (redux) action which signals to set the UI layout to be tiled view
 * or not.
 *
 * @param {boolean} enabled - Whether or not tile view should be shown.
 * @returns {{
 *     type: SET_TILE_VIEW,
 *     enabled: ?boolean
 * }}
 */
export declare function setTileView(enabled?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Creates a (redux) action which signals either to exit tile view if currently
 * enabled or enter tile view if currently disabled.
 *
 * @returns {Function}
 */
export declare function toggleTileView(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
