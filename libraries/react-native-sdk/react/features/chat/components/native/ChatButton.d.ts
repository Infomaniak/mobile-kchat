/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * True if the polls feature is disabled.
     */
    _isPollsDisabled?: boolean;
    /**
     * The unread message count.
     */
    _unreadMessageCount: number;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
