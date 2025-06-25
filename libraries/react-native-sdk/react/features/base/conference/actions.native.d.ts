import { IStore } from '../../app/types';
import { MediaType } from '../media/constants';
export * from './actions.any';
/**
 * Starts audio and/or video for the visitor.
 *
 * @param {Array<MediaType>} mediaTypes - The media types that need to be started.
 * @returns {Function}
 */
export declare function setupVisitorStartupMedia(mediaTypes: Array<MediaType>): (dispatch: IStore['dispatch']) => void;
