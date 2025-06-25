import { AmplitudeClient } from 'amplitude-js';
/**
 * Custom logic for setting the correct device id.
 *
 * @param {AmplitudeClient} _amplitude - The amplitude instance.
 * @returns {void}
 */
export declare function fixDeviceID(_amplitude: AmplitudeClient): Promise<any>;
