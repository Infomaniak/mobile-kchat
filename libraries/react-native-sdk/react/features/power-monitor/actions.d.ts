import { Transport } from '../../../modules/transport';
/**
 * Signals that suspend was detected.
 *
 * @public
 * @returns {{
 *     type: SUSPEND_DETECTED
 * }}
 */
export declare function suspendDetected(): {
    type: string;
};
/**
 * Signals setting of a transport.
 *
 * @param {Transport} transport - The transport to save in the state.
 * @returns {{
 *      transport: Transport,
 *      type: string
 *  }}
 */
export declare function setTransport(transport?: Transport): {
    type: string;
    transport: any;
};
