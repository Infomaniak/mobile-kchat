/// <reference types="react" />
import { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link TileViewButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not tile view layout has been enabled as the user preference.
     */
    _tileViewEnabled: boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
