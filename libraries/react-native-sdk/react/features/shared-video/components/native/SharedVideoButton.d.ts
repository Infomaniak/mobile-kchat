/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link TileViewButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not the button is disabled.
     */
    _isDisabled: boolean;
    /**
     * Whether or not the local participant is sharing a video.
     */
    _sharingVideo: boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
