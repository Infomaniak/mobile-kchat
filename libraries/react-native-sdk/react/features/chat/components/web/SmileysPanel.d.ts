import React, { PureComponent } from 'react';
/**
 * The type of the React {@code Component} props of {@link SmileysPanel}.
 */
export interface IProps {
    /**
     * Callback to invoke when a smiley is selected. The smiley will be passed
     * back.
     */
    onSmileySelect: Function;
}
/**
 * Implements a React Component showing smileys that can be be shown in chat.
 *
 * @augments Component
 */
declare class SmileysPanel extends PureComponent<IProps> {
    /**
     * Initializes a new {@code SmileysPanel} instance.
     *
     * @param {*} props - The read-only properties with which the new instance
     * is to be initialized.
     */
    constructor(props: IProps);
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onEscKey(e: React.KeyboardEvent): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e: React.KeyboardEvent<HTMLDivElement>): void;
    /**
     * Click handler for to select emoji.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onClick(e: React.MouseEvent): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
export default SmileysPanel;
