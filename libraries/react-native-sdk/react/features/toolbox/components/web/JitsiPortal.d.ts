import { ReactNode } from 'react';
export interface IProps {
    /**
     * The component(s) to be displayed within the drawer portal.
     */
    children: ReactNode;
    /**
     * Class name used to add custom styles to the portal.
     */
    className?: string;
}
/**
 * Component meant to render a drawer at the bottom of the screen,
 * by creating a portal containing the component's children.
 *
 * @returns {ReactElement}
 */
declare function JitsiPortal({ children, className }: IProps): JSX.Element;
export default JitsiPortal;
