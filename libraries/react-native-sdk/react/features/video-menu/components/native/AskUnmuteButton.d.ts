/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not the participant is audio force muted.
     */
    isAudioForceMuted: boolean;
    /**
     * Whether or not the participant is video force muted.
     */
    isVideoForceMuted: boolean;
    /**
     * The ID of the participant object that this button is supposed to
     * ask to unmute.
     */
    participantID: string;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
