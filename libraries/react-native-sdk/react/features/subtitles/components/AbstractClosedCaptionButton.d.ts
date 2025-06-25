import { IReduxState } from '../../app/types';
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
export interface IAbstractProps extends AbstractButtonProps {
    _language: string | null;
    /**
     * Whether the local participant is currently requesting subtitles.
     */
    _requestingSubtitles: boolean;
    /**
     * Selected language for subtitle.
     */
    _subtitles: string;
    languages?: string;
    languagesHead?: string;
}
/**
 * The button component which starts/stops the transcription.
 */
export declare class AbstractClosedCaptionButton extends AbstractButton<IAbstractProps> {
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the closed caption button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _handleClickOpenLanguageSelector(): void;
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick(): Promise<void>;
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): boolean;
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean;
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AbstractClosedCaptionButton} component.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {{
 *     _requestingSubtitles: boolean,
 *     _language: string,
 *     visible: boolean
 * }}
 */
export declare function _abstractMapStateToProps(state: IReduxState, ownProps: IAbstractProps): {
    _requestingSubtitles: boolean;
    _language: string | null;
    visible: boolean;
};
