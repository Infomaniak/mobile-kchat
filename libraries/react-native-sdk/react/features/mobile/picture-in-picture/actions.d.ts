import { IStore } from '../../app/types';
/**
 * Enters (or rather initiates entering) picture-in-picture.
 * Helper function to enter PiP mode. This is triggered by user request
 * (either pressing the button in the toolbox or the home button on Android)
 * and this triggers the PiP mode, iff it's available and we are in a
 * conference.
 *
 * @public
 * @returns {Function}
 */
export declare function enterPictureInPicture(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
