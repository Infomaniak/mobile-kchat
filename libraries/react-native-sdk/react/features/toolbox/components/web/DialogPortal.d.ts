import { ReactNode } from 'react';
export interface IProps {
    /**
     * The component(s) to be displayed within the drawer portal.
     */
    children: ReactNode;
    /**
     * Custom class name to apply on the container div.
     */
    className?: string;
    /**
     * Function used to get the reference to the container div.
     */
    getRef?: Function;
    /**
     * Function called when the portal target becomes actually visible.
     */
    onVisible?: Function;
    /**
     * Function used to get the updated size info of the container on it's resize.
     */
    setSize?: Function;
    /**
     * Custom style to apply to the container div.
     */
    style?: any;
    /**
     * The selector for the element we consider the content container.
     * This is used to determine the correct size of the portal content.
     */
    targetSelector?: string;
}
/**
 * Component meant to render a drawer at the bottom of the screen,
 * by creating a portal containing the component's children.
 *
 * @returns {ReactElement}
 */
declare function DialogPortal({ children, className, style, getRef, setSize, targetSelector, onVisible }: IProps): import("react").ReactPortal;
export default DialogPortal;
