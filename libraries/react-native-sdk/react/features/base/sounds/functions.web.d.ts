import { IStore } from '../../app/types';
/**
 * Returns the location of the sounds. On Web it's the relative path to
 * the sounds folder placed in the source root.
 *
 * @returns {string}
 */
export declare function getSoundsPath(): string;
/**
 * Set new audio output device on the global sound elements.
 *
 * @param {string } deviceId - The new output deviceId.
 * @returns {Function}
 */
export declare function setNewAudioOutputDevice(deviceId: string): (_dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
