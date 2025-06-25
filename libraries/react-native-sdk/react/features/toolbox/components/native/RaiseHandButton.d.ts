/// <reference types="react" />
import { ILocalParticipant } from '../../../base/participants/types';
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link RaiseHandButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * The local participant.
     */
    _localParticipant?: ILocalParticipant;
    /**
     * Whether the participant raised their hand or not.
     */
    _raisedHand: boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
