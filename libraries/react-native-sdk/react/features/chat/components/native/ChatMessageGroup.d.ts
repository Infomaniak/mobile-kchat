import { Component } from 'react';
import { IMessage } from '../../types';
export interface IProps {
    /**
    * The messages array to render.
    */
    messages: Array<IMessage>;
}
/**
 * Implements a container to render all the chat messages in a conference.
 */
export default class ChatMessageGroup extends Component<IProps> {
    /**
     * Instantiates a new instance of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Key extractor for the flatlist.
     *
     * @param {Object} _item - The flatlist item that we need the key to be
     * generated for.
     * @param {number} index - The index of the element.
     * @returns {string}
     */
    _keyExtractor(_item: Object, index: number): string;
    /**
     * Renders a single chat message.
     *
     * @param {Object} message - The chat message to render.
     * @returns {React$Element<*>}
     */
    _renderMessage({ index, item: message }: {
        index: number;
        item: IMessage;
    }): JSX.Element;
}
