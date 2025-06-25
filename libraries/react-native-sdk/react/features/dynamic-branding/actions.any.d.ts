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
 * Action used to set the user customizations.
 *
 * @param {Object} value - The custom data to be set.
 * @returns {Object}
 */
export declare function setDynamicBrandingData(value: Object): {
    type: string;
    value: Object;
};
/**
 * Action used to signal the branding elements are ready to be displayed.
 *
 * @returns {Object}
 */
export declare function setDynamicBrandingReady(): {
    type: string;
};
/**
 * Action used to signal the branding request failed.
 *
 * @returns {Object}
 */
export declare function setDynamicBrandingFailed(): {
    type: string;
};
