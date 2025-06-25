import { Amplitude } from '@amplitude/react-native';
/**
 * Custom logic for setting the correct device id.
 *
 * @param {AmplitudeClient} amplitude - The amplitude instance.
 * @returns {void}
 */
export declare function fixDeviceID(amplitude: Amplitude): Promise<void>;
