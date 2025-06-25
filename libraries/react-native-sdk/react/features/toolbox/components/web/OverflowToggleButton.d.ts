/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link OverflowToggleButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether the more options menu is open.
     */
    isOpen: boolean;
    /**
     * External handler for key down action.
     */
    onKeyDown: Function;
}
declare const _default: import("react-redux").ConnectedComponent<import("react").ComponentType<import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation>>, import("react-redux").Omit<import("react").ClassAttributes<import("react").Component<import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation>, "dispatch"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation> & {
    children?: import("react").ReactNode;
}, "dispatch">>;
export default _default;
