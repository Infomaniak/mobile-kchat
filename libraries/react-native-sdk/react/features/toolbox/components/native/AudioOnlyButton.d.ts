/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link AudioOnlyButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether the current conference is in audio only mode or not.
     */
    _audioOnly: boolean;
    /**
     * Indicates whether the car mode is enabled.
     */
    _startCarMode?: boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
