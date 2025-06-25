import { IReduxState } from '../../../app/types';
/**
 * Get the live streaming options.
 *
 * @param {Object} state - The global state.
 * @returns {LiveStreaming}
 */
export declare function getLiveStreaming(state: IReduxState): {
    enabled: boolean;
    helpURL: string | undefined;
    termsURL: string | undefined;
    dataPrivacyURL: string | undefined;
    streamLinkRegexp: RegExp;
};
