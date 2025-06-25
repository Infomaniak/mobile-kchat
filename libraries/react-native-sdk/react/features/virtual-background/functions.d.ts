import { IReduxState } from '../app/types';
/**
 * Checks context filter support.
 *
 * @returns {boolean} True if the filter is supported and false if the filter is not supported by the browser.
 */
export declare function checkBlurSupport(): boolean;
/**
 * Checks if virtual background is enabled.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean} True if virtual background is enabled and false if virtual background is disabled.
 */
export declare function checkVirtualBackgroundEnabled(state: IReduxState): boolean;
/**
 * Convert blob to base64.
 *
 * @param {Blob} blob - The link to add info with.
 * @returns {Promise<string>}
 */
export declare const blobToData: (blob: Blob) => Promise<unknown>;
/**
 * Convert blob to base64.
 *
 * @param {string} url - The image url.
 * @returns {Object} - Returns the converted blob to base64.
 */
export declare const toDataURL: (url: string) => Promise<unknown>;
/**
 * Resize image and adjust original aspect ratio.
 *
 * @param {Object} base64image - Base64 image extraction.
 * @param {number} width - Value for resizing the image width.
 * @param {number} height - Value for resizing the image height.
 * @returns {Promise<string>}
 */
export declare function resizeImage(base64image: any, width?: number, height?: number): Promise<string>;
/**
 * Creating a wrapper for promises on a specific time interval.
 *
 * @param {number} milliseconds - The number of milliseconds to wait the specified
 * {@code promise} to settle before automatically rejecting the returned
 * {@code Promise}.
 * @param {Promise} promise - The {@code Promise} for which automatic rejecting
 * after the specified timeout is to be implemented.
 * @returns {Promise}
 */
export declare function timeout(milliseconds: number, promise: Promise<any>): Promise<Object>;
