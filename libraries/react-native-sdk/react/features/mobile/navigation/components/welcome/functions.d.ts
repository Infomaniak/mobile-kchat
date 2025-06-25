/// <reference types="react" />
/// <reference types="react" />
import { GestureResponderEvent } from 'react-native';
/**
 * Render header arrow back button for navigation.
 *
 * @param {Function} onPress - Callback for when the button is pressed
 * function.
 * @returns {ReactElement}
 */
export declare function renderArrowBackButton(onPress: (e?: GestureResponderEvent | MouseEvent) => void): JSX.Element;
