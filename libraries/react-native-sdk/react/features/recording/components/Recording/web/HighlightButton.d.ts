import { Theme } from '@mui/material';
import React from 'react';
import AbstractHighlightButton, { IProps as AbstractProps } from '../AbstractHighlightButton';
export interface IProps extends AbstractProps {
    _disabled: boolean;
    /**
     * The message to show within the label's tooltip.
     */
    _tooltipKey: string;
    /**
     * Flag controlling visibility of the component.
     */
    _visible: boolean;
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
}
/**
 * The type of the React {@code Component} state of {@link HighlightButton}.
 */
export interface IState {
    /**
     * Whether the notification which prompts for starting recording is open is not.
     */
    isNotificationOpen: boolean;
}
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
declare const styles: (theme: Theme) => {
    container: {
        position: "relative";
    };
    disabled: {
        background: string;
    };
    regular: {
        background: string;
    };
    highlightNotification: {
        backgroundColor: string;
        borderRadius: string;
        boxShadow: string;
        boxSizing: "border-box";
        color: string;
        fontSize: string;
        fontWeight: number;
        left: string;
        padding: string;
        position: "absolute";
        top: string;
        width: number;
    };
    highlightNotificationButton: {
        color: string;
        cursor: string;
        fontWeight: number;
        marginTop: string;
    };
};
/**
 * React {@code Component} responsible for displaying an action that
 * allows users to highlight a meeting moment.
 */
export declare class HighlightButton extends AbstractHighlightButton<IProps, IState> {
    /**
     * Initializes a new HighlightButton instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#componentWillUnmount()}.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
    * Handles clicking / pressing the start recording button.
    *
    * @returns {void}
    */
    _onOpenDialog(): Promise<void>;
    /**
    * Handles clicking / pressing the highlight button.
    *
    * @override
    * @param {Event} e - The click event.
    * @returns {void}
    */
    _onClick(e?: React.MouseEvent): void;
    /**
     * Window click event listener.
     *
     * @returns {void}
     */
    _onWindowClickListener(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<HighlightButton> & IProps, "dispatch" | "_visible" | "_disabled" | "_isHighlightInProgress">, keyof import("react-i18next").WithTranslation>>;
export default _default;
