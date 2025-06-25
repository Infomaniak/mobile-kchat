/// <reference types="react" />
/**
 * Signals to open a dialog with the DesktopPicker component.
 *
 * @param {Object} options - Desktop sharing settings.
 * @param {Function} onSourceChoose - The callback to invoke when
 * a DesktopCapturerSource has been chosen.
 * @returns {Object}
 */
export declare function showDesktopPicker(options: {
    desktopSharingSources?: any;
} | undefined, onSourceChoose: Function): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
