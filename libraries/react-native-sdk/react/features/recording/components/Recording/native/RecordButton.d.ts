/// <reference types="react" />
import { IReduxState } from '../../../../app/types';
import { IProps } from '../../LiveStream/AbstractStartLiveStreamDialog';
import AbstractRecordButton, { IProps as AbstractProps } from '../AbstractRecordButton';
type Props = IProps & AbstractProps;
/**
 * Button for opening a screen where a recording session can be started.
 */
declare class RecordButton extends AbstractRecordButton<Props> {
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
 * Maps (parts of) the redux state to the associated props for this component.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {Props}
 */
export declare function mapStateToProps(state: IReduxState): {
    visible: any;
    _conference: import("../../../../base/conference/reducer").IJitsiConference | undefined;
    _googleAPIState: number;
    _googleProfileEmail: string;
    _streamKey: string | undefined;
    _disabled: boolean;
    _isRecordingRunning: boolean;
    _tooltip: string;
};
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<RecordButton> & IProps & AbstractProps, "key" | "dispatch" | "ref" | "t" | "navigation" | "i18n" | "tReady" | "backgroundColor" | "_conference" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | "_disabled" | "_tooltip" | "_googleAPIState" | "_googleProfileEmail" | "_streamKey" | "_isRecordingRunning"> & Partial<Pick<import("react").ClassAttributes<RecordButton> & IProps & AbstractProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_conference" | "_disabled" | "_tooltip" | "_googleAPIState" | "_googleProfileEmail" | "_streamKey" | "_isRecordingRunning">, keyof import("react-i18next").WithTranslation>>;
export default _default;
