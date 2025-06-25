import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link JoinButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * The function called when the button is pressed.
     */
    onPress: Function;
    /**
     * The meeting URL associated with the {@link JoinButton} instance.
     */
    url: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
