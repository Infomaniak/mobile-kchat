import { IStore } from '../../app/types';
/**
 * Signals that a specific App will mount (in the terms of React).
 *
 * @param {App} app - The App which will mount.
 * @returns {{
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }}
 */
export declare function appWillMount(app: Object): (dispatch: IStore['dispatch']) => void;
/**
 * Signals that a specific App will unmount (in the terms of React).
 *
 * @param {App} app - The App which will unmount.
 * @returns {{
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }}
 */
export declare function appWillUnmount(app: Object): {
    type: string;
    app: Object;
};
/**
 * Signals that a specific App will navigate (in the terms of React).
 *
 * @param {App} app - The App which will navigate.
 * @param {Object} route - The route which will be used.
 * @returns {{
 *     type: APP_WILL_NAVIGATE,
 *     app: App,
 *     route: Object
 * }}
 */
export declare function appWillNavigate(app: Object, route: Object): {
    type: string;
    app: Object;
    route: Object;
};
