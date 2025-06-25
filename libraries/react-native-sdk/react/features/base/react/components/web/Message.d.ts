import React, { Component } from 'react';
export interface IProps {
    /**
     * The body of the message.
     */
    text: string;
}
/**
 * Renders the content of a chat message.
 */
declare class Message extends Component<IProps> {
    /**
     * Initializes a new {@code Message} instance.
     *
     * @param {IProps} props - The props of the component.
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Parses and builds the message tokens to include emojis and urls.
     *
     * @returns {Array<string|ReactElement>}
     */
    _processMessage(): React.ReactNode[];
    /**
     * Implements React's {@link Component#render()}.
     *
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
export default Message;
