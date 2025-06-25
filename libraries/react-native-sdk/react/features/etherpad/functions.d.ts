import { IStateful } from '../base/app/types';
/**
 * Retrieves the current sahred document URL.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @returns {?string} - Current shared document URL or undefined.
 */
export declare function getSharedDocumentUrl(stateful: IStateful): string | undefined;
