/// <reference types="react" />
import { IReduxState } from '../../../../app/types';
import AbstractRecordButton, { IProps } from '../AbstractRecordButton';
/**
 * Button for opening a dialog where a recording session can be started.
 */
declare class RecordingButton extends AbstractRecordButton<IProps> {
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _onHandleClick(): void;
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code RecordButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _fileRecordingsDisabledTooltipKey: ?string,
 *     _isRecordingRunning: boolean,
 *     _disabled: boolean,
 *     visible: boolean
 * }}
 */
export declare function _mapStateToProps(state: IReduxState): {
    visible: boolean;
    _disabled: boolean;
    _isRecordingRunning: boolean;
    _tooltip: string;
};
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<RecordingButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_disabled" | "_tooltip" | "_isRecordingRunning" | keyof import("react").ClassAttributes<RecordingButton>> & Partial<Pick<import("react").ClassAttributes<RecordingButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
    afterClick: undefined;
    disabledStyles: {
        iconStyle: {
            opacity: number;
        };
        labelStyle: {
            opacity: number;
        };
        style: undefined;
        underlayColor: undefined;
    };
    showLabel: boolean;
    styles: undefined;
    toggledStyles: undefined;
    tooltipPosition: string;
    visible: boolean;
}, never>>, "visible" | "dispatch" | "_disabled" | "_tooltip" | "_isRecordingRunning">, keyof import("react-i18next").WithTranslation>>;
export default _default;
