declare type StyleSheet = {
    [key: string]: string | number | {
        [key: string]: string | number;
    };
};
export type StyleType = StyleSheet | Array<StyleSheet>;
/**
 * Function to convert complex StyleType styles into a single flat object,
 * so then they can be deconstructed for further processing.
 *
 * @param {Styletype} st - The complex style type.
 * @returns {Object}
 */
export declare function styleTypeToObject(st: StyleType | StyleType[]): StyleSheet;
/**
 * Combines the given 2 styles into a single one.
 *
 * @param {StyleType} a - An object or array of styles.
 * @param {StyleType} b - An object or array of styles.
 * @private
 * @returns {StyleType} - The merged styles.
 */
export declare function combineStyles(a: StyleType, b: StyleType): StyleType;
/**
 * Create a style sheet using the provided style definitions.
 *
 * @param {StyleSheet} styles - A dictionary of named style definitions.
 * @param {StyleSheet} [overrides={}] - Optional set of additional (often
 * platform-dependent/specific) style definitions that will override the base
 * (often platform-independent) styles.
 * @returns {StyleSheet}
 */
export declare function createStyleSheet(styles: StyleSheet, overrides?: StyleSheet): StyleSheet;
/**
 * Returns an rgba format of the provided color if it's in hex or rgb format.
 *
 * NOTE: The function will return the same color if it's not in one of those
 * two formats (e.g. 'white').
 *
 * @param {string} color - The string representation of the color in rgb or hex
 * format.
 * @param {number} alpha - The alpha value to apply.
 * @returns {string}
 */
export declare function getRGBAFormat(color: string, alpha: number): string;
/**
 * Decides if a color is light or dark based on the ITU-R BT.709 and W3C
 * recommendations.
 *
 * NOTE: Please see https://www.w3.org/TR/WCAG20/#relativeluminancedef.
 *
 * @param {string} color - The color in rgb, rgba or hex format.
 * @returns {boolean}
 */
export declare function isDarkColor(color: string): boolean;
export {};
