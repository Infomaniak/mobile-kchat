import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Sets the dimensions of the tile view grid. The action is only partially implemented on native as not all
 * of the values are currently used. Check the description of {@link SET_TILE_VIEW_DIMENSIONS} for the full set
 * of properties.
 *
 * @returns {Function}
 */
export declare function setTileViewDimensions(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Add participant to the active participants list.
 *
 * @param {string} _participantId - The Id of the participant to be added.
 * @param {boolean?} _pinned - Whether the participant is pinned or not.
 * @returns {Object}
 */
export declare function addStageParticipant(_participantId: string, _pinned?: boolean): any;
/**
 * Remove participant from the active participants list.
 *
 * @param {string} _participantId - The Id of the participant to be removed.
 * @returns {Object}
 */
export declare function removeStageParticipant(_participantId: string): any;
