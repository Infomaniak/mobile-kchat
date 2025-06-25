/// <reference types="react" />
import { IStateful } from '../base/app/types';
/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {(Function|Object)} stateful - THe redux store, state, or
 * {@code getState} function.
 * @returns {Promise<Object>}
 */
export declare function _getRouteToRender(stateful: IStateful): Promise<{
    component: import("react").ReactNode;
    href?: string | undefined;
}>;
