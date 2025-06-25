import { IStore } from '../app/types';
/**
 * Fetches custom branding data.
 * If there is no data or the request fails, sets the `customizationReady` flag
 * so the defaults can be displayed.
 *
 * @returns {Function}
 */
export declare function fetchCustomBrandingData(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<{
    type: string;
} | undefined>;
/**
 * Action used to unset branding elements.
 *
 * @returns {Object}
 */
export declare function unsetDynamicBranding(): {
    type: string;
};
