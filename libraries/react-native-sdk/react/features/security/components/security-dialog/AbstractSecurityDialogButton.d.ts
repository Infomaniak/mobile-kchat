import { IReduxState } from '../../../app/types';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * Whether the shared document is being edited or not.
     */
    _locked: boolean;
}
/**
 * Implements an {@link AbstractButton} to open the security dialog/screen.
 */
export default class AbstractSecurityDialogButton<P extends IProps, S> extends AbstractButton<P, S> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    toggledIcon: any;
    tooltip: string;
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the security button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _handleClickSecurityButton(): void;
    /**
     * Handles clicking / pressing the button.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @returns {boolean}
     */
    _isToggled(): P["_locked"];
}
/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _locked: boolean;
    visible: any;
};
