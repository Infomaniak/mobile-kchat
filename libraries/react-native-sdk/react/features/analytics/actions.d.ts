import { IStore } from '../app/types';
/**
 * Updates a permanentProperty.
 *
 * @param {Object} properties - An object with properties to be updated.
 * @returns {Function}
 */
export declare function setPermanentProperty(properties: Object): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
