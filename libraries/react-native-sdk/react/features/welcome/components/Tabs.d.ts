/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link Tabs}.
 */
export interface IProps {
    /**
     * Accessibility label for the tabs container.
     *
     */
    accessibilityLabel: string;
    /**
     * Tabs information.
     */
    tabs: {
        content: any;
        id: string;
        label: string;
    }[];
}
/**
 * A React component that implements tabs.
 *
 * @returns {ReactElement} The component.
 */
declare const Tabs: ({ accessibilityLabel, tabs }: IProps) => JSX.Element;
export default Tabs;
