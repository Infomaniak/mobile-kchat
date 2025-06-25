/// <reference types="react" />
import { GestureResponderEvent } from 'react-native';
/**
 * The type of the React {@code Component} props of {@link WelcomePageTabs}.
 */
export interface IProps {
    /**
     * Renders the lists disabled.
     */
    disabled: boolean;
    /**
     * Callback to be invoked when pressing the list container.
     */
    onListContainerPress?: (e?: GestureResponderEvent) => void;
    /**
     * Callback to be invoked when settings screen is focused.
     */
    onSettingsScreenFocused: Function;
}
declare const WelcomePageTabs: ({ disabled, onListContainerPress, onSettingsScreenFocused }: IProps) => JSX.Element;
export default WelcomePageTabs;
