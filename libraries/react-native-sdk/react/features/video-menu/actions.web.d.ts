export * from './actions.any';
/**
 * Sets whether to render the connection status info into the Popover of the thumbnail or the context menu buttons.
 *
 * @param {boolean} showConnectionInfo - Whether it should show the connection
 * info or the context menu buttons on thumbnail popover.
 * @returns {Object}
 */
export declare function renderConnectionStatus(showConnectionInfo: boolean): {
    type: string;
    showConnectionInfo: boolean;
};
