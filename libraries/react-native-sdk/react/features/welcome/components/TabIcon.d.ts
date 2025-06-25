/// <reference types="react" />
import { StyleType } from '../../base/styles/functions.any';
export interface IProps {
    /**
     * Is the tab focused?
     */
    focused?: boolean;
    /**
     * The ImageSource to be rendered as image.
     */
    src: Function;
    /**
     * The component's external style.
     */
    style?: StyleType;
}
declare const TabIcon: ({ focused, src, style }: IProps) => JSX.Element;
export default TabIcon;
