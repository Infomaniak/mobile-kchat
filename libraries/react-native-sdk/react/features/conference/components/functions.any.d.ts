import { IReduxState } from '../../app/types';
/**
 * Retrieves the conference info labels based on config values and defaults.
 *
 * @param {Object} state - The redux state.
 * @returns {Object} The conferenceInfo object.
 */
export declare const getConferenceInfo: (state: IReduxState) => {
    alwaysVisible: string[];
    autoHide: string[];
};
