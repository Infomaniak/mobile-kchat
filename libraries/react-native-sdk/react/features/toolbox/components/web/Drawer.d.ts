import { ReactNode } from 'react';
export interface IProps {
    /**
     * The component(s) to be displayed within the drawer menu.
     */
    children: ReactNode;
    /**
     * Class name for custom styles.
     */
    className?: string;
    /**
     * The id of the dom element acting as the Drawer label.
     */
    headingId?: string;
    /**
     * Whether the drawer should be shown or not.
     */
    isOpen: boolean;
    /**
     * Function that hides the drawer.
     */
    onClose?: Function;
}
/**
 * Component that displays the mobile friendly drawer on web.
 *
 * @returns {ReactElement}
 */
declare function Drawer({ children, className, headingId, isOpen, onClose }: IProps): JSX.Element | null;
export default Drawer;
