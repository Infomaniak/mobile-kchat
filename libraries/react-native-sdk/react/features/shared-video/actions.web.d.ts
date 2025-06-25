export * from './actions.any';
/**
 * Disabled share video button.
 *
 * @param {boolean} disabled - The current state of the share video button.
 * @returns {{
 *     type: SET_DISABLE_BUTTON,
 *     disabled: boolean
 * }}
 */
export declare function setDisableButton(disabled: boolean): {
    type: string;
    disabled: boolean;
};
