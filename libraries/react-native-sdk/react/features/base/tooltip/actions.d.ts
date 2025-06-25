import { ReactElement } from 'react';
/**
 * Set tooltip state to visible.
 *
 * @param {string} content - The content of the tooltip.
 * Used as unique identifier for tooltip.
 * @returns {Object}
 */
export declare function showTooltip(content: string | ReactElement): {
    type: string;
    content: string | ReactElement<any, string | import("react").JSXElementConstructor<any>>;
};
/**
 * Set tooltip state to hidden.
 *
 * @param {string} content - The content of the tooltip.
 * Used as unique identifier for tooltip.
 * @returns {Object}
 */
export declare function hideTooltip(content: string | ReactElement): {
    type: string;
    content: string | ReactElement<any, string | import("react").JSXElementConstructor<any>>;
};
