import { IStore } from '../../app/types';
import { MediaType } from '../media/constants';
export * from './actions.any';
/**
 * Starts audio and/or video for the visitor.
 *
 * @param {Array<MediaType>} media - The media types that need to be started.
 * @returns {Function}
 */
export declare function setupVisitorStartupMedia(media: Array<MediaType>): (dispatch: IStore['dispatch']) => void;
