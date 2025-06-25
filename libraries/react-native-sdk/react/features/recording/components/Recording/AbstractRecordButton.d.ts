import { IReduxState } from '../../../app/types';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractRecordButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * True if the button needs to be disabled.
     */
    _disabled: boolean;
    /**
     * True if there is a running active recording, false otherwise.
     */
    _isRecordingRunning: boolean;
    /**
     * The tooltip to display when hovering over the button.
     */
    _tooltip?: string;
}
/**
 * An abstract implementation of a button for starting and stopping recording.
 */
export default class AbstractRecordButton<P extends IProps> extends AbstractButton<P> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    icon: any;
    label: string;
    toggledLabel: string;
    toggledIcon: any;
    /**
     * Returns the tooltip that should be displayed when the button is disabled.
     *
     * @private
     * @returns {string}
     */
    _getTooltip(): "" | NonNullable<P["_tooltip"]>;
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the start recoding button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _onHandleClick(): void;
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick(): Promise<void>;
    /**
     * Helper function to be implemented by subclasses, which must return a
     * boolean value indicating if this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): P["_disabled"];
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): P["_isRecordingRunning"];
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code RecordButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disabled: boolean,
 *     _isRecordingRunning: boolean,
 *     _tooltip: string,
 *     visible: boolean
 * }}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _disabled: boolean;
    _isRecordingRunning: boolean;
    _tooltip: string;
    visible: boolean | undefined;
};
