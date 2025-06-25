/// <reference types="react" />
import { StyleType } from '../../styles/functions';
import { IIconProps } from './types';
export interface IProps extends IIconProps {
    /**
     * Optional label for screen reader users.
     *
     * If set, this is will add a `aria-label` attribute on the svg element,
     * contrary to the aria* props which set attributes on the container element.
     *
     * Use this if the icon conveys meaning and is not clickable.
     */
    alt?: string;
    /**
     * The id of the element this button icon controls.
     */
    ariaControls?: string;
    /**
     * Id of description label.
     */
    ariaDescribedBy?: string;
    /**
     * Aria disabled flag for the Icon.
     */
    ariaDisabled?: boolean;
    /**
     * Whether the element popup is expanded.
     */
    ariaExpanded?: boolean;
    /**
     * Whether the element has a popup.
     */
    ariaHasPopup?: boolean;
    /**
     * Aria label for the Icon.
     */
    ariaLabel?: string;
    /**
     * Whether the element has a pressed.
     */
    ariaPressed?: boolean;
    /**
     * Class name for the web platform, if any.
     */
    className?: string;
    /**
     * Color of the icon (if not provided by the style object).
     */
    color?: string;
    /**
     * Id of the icon container.
     */
    containerId?: string;
    /**
     * Id prop (mainly for autotests).
     */
    id?: string;
    /**
     * Keydown handler.
     */
    onKeyDown?: Function;
    /**
     * Keypress handler.
     */
    onKeyPress?: Function;
    /**
     * Role for the Icon.
     */
    role?: string;
    /**
     * The size of the icon (if not provided by the style object).
     */
    size?: number | string;
    /**
     * The preloaded icon component to render.
     */
    src: Function;
    /**
     * Style object to be applied.
     */
    style?: StyleType | StyleType[];
    /**
     * TabIndex  for the Icon.
     */
    tabIndex?: number;
    /**
     * Test id for the icon.
     */
    testId?: string;
}
export declare const DEFAULT_COLOR: string | undefined;
export declare const DEFAULT_SIZE: number;
/**
 * Implements an Icon component that takes a loaded SVG file as prop and renders it as an icon.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
declare function Icon(props: IProps): JSX.Element;
declare namespace Icon {
    var defaultProps: {
        className: string;
    };
}
export default Icon;
