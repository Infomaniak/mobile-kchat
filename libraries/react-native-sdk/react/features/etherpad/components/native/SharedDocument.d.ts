import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@code ShareDocument}.
 */
export interface IProps extends WithTranslation {
    /**
     * URL for the shared document.
     */
    _documentUrl?: string;
    /**
     * Default prop for navigation between screen components(React Navigation).
     */
    navigation: Object;
}
/**
 * Maps (parts of) the redux state to {@link SharedDocument} React {@code Component} props.
 *
 * @param {Object} state - The redux store/state.
 * @param {any} _ownProps - Component's props.
 * @private
 * @returns {Object}
 */
export declare function _mapStateToProps(state: IReduxState, _ownProps: any): {
    _documentUrl: string | undefined;
};
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
