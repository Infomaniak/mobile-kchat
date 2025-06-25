import { IStore } from '../app/types';
/**
 * Sends a request for retrieving jaas customer details.
 *
 * @returns {Function}
 */
export declare function getCustomerDetails(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
