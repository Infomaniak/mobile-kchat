/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link ReactionsMenuButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether the participant raised their hand or not.
     */
    _raisedHand: boolean;
    /**
     * Whether or not the reactions menu is open.
     */
    _reactionsOpen: boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
