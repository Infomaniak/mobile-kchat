import { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState } from '../../app/types';
export interface IProps extends WithTranslation {
    /**
     * True of the label should be visible.
     */
    _visible: boolean;
}
/**
 * Abstract class for the {@Code InsecureRoomNameLabel} component.
 */
export default class AbstractInsecureRoomNameLabel extends PureComponent<IProps> {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Renders the platform dependent content.
     *
     * @returns {ReactElement}
     */
    _render(): JSX.Element;
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _visible: boolean;
};
