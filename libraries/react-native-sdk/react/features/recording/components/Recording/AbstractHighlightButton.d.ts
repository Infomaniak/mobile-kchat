import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
export interface IProps extends WithTranslation {
    /**
     * Indicates whether or not the button is disabled.
     */
    _disabled: boolean;
    /**
     * Indicates whether or not a highlight request is in progress.
     */
    _isHighlightInProgress: boolean;
    /**
     * Indicates whether or not the button should be visible.
     */
    _visible: boolean;
    /**
     * Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}
/**
 * Abstract class for the {@code AbstractHighlightButton} component.
 */
export default class AbstractHighlightButton<P extends IProps, S = {}> extends Component<P, S> {
    /**
     * Initializes a new AbstractHighlightButton instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: P);
    /**
   * Handles clicking / pressing the button.
   *
   * @override
   * @protected
   * @returns {void}
   */
    _onClick(): void;
}
/**
 * Maps (parts of) the Redux state to the associated
 * {@code AbstractHighlightButton}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disabled: boolean,
 *     _isHighlightInProgress: boolean,
 *     _visible: boolean
 * }}
 */
export declare function _abstractMapStateToProps(state: IReduxState): {
    _disabled: boolean;
    _isHighlightInProgress: boolean;
    _visible: boolean;
};
