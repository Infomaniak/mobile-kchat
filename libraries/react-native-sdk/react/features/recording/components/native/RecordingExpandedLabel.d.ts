/// <reference types="react" />
import { IProps as AbstractProps } from '../../../base/label/components/native/ExpandedLabel';
export interface IProps extends AbstractProps {
    /**
     * Whether this meeting is being transcribed.
     */
    _isTranscribing: boolean;
    /**
     * The status of the highermost priority session.
     */
    _status?: string;
    /**
     * The recording mode this indicator should display.
     */
    mode: string;
    /**
     * Function to be used to translate i18n labels.
     */
    t: Function;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
