import { StyleType } from './functions.any';
export * from './functions.any';
/**
 * Fixes the style prop that is passed to a platform generic component based on platform specific
 * format requirements.
 *
 * @param {StyleType} style - The passed style prop to the component.
 * @returns {StyleType}
 */
export declare function getFixedPlatformStyle(style?: StyleType | StyleType[]): {} | undefined;
/**
 * Sets the line height of a CSS Object group in pixels.
 * By default lineHeight is unitless in CSS, but not in RN.
 *
 * @param {Object} base - The base object containing the `lineHeight` property.
 * @returns {Object}
 */
export declare function withPixelLineHeight(base: any): any;
