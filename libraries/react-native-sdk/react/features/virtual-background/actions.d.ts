import { IStore } from '../app/types';
import { IVirtualBackground } from './reducer';
/**
 * Signals the local participant activate the virtual background video or not.
 *
 * @param {Object} options - Represents the virtual background set options.
 * @param {Object} jitsiTrack - Represents the jitsi track that will have backgraund effect applied.
 * @returns {Promise}
 */
export declare function toggleBackgroundEffect(options: IVirtualBackground, jitsiTrack: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Sets the selected virtual background image object.
 *
 * @param {Object} options - Represents the virtual background set options.
 * @returns {{
 *     type: SET_VIRTUAL_BACKGROUND,
 *     virtualSource: string,
 *     blurValue: number,
 *     type: string,
 * }}
 */
export declare function setVirtualBackground(options?: IVirtualBackground): {
    type: string;
    virtualSource: string | undefined;
    blurValue: number | undefined;
    backgroundType: string | undefined;
    selectedThumbnail: string | undefined;
};
/**
 * Signals the local participant that the background effect has been enabled.
 *
 * @param {boolean} backgroundEffectEnabled - Indicate if virtual background effect is activated.
 * @returns {{
 *      type: BACKGROUND_ENABLED,
 *      backgroundEffectEnabled: boolean
 * }}
 */
export declare function backgroundEnabled(backgroundEffectEnabled?: boolean): {
    type: string;
    backgroundEffectEnabled: boolean | undefined;
};
