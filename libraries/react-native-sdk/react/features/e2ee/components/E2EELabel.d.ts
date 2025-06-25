import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState } from '../../app/types';
export interface IProps extends WithTranslation {
    /**
     * Custom e2ee labels.
     */
    _e2eeLabels?: any;
    /**
     * True if the label needs to be rendered, false otherwise.
     */
    _showLabel?: boolean;
}
/**
 * Maps (parts of) the redux state to the associated props of this {@code Component}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _e2eeLabels: {
        description?: string | undefined;
        label?: string | undefined;
        tooltip?: string | undefined;
        warning?: string | undefined;
    } | undefined;
    _showLabel: boolean;
};
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "_e2eeLabels" | "_showLabel">, keyof WithTranslation>>;
export default _default;
