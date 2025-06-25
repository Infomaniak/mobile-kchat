/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of
 * {@link VideoQualityButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not audio only mode is currently enabled.
     */
    _audioOnly: boolean;
    /**
     * The currently configured maximum quality resolution to be received from
     * and sent to remote participants.
     */
    _videoQuality: number;
}
declare const _default: import("react-redux").ConnectedComponent<import("react").ComponentType<import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation>>, import("react-redux").Omit<import("react").ClassAttributes<import("react").Component<import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation>, "dispatch"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof import("react-i18next").WithTranslation> & {
    children?: import("react").ReactNode;
}, "dispatch">>;
export default _default;
