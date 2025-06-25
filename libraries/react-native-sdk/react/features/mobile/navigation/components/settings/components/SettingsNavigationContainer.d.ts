/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link SettingsNavigationContainer}.
 */
export interface IProps {
    /**
     * Is the navigator part of Welcome page?
     */
    isInWelcomePage?: boolean | undefined;
}
declare const SettingsNavigationContainer: ({ isInWelcomePage }: IProps) => JSX.Element;
export default SettingsNavigationContainer;
