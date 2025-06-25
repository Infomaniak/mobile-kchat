import { Component } from 'react';
import { IMessage } from '../types';
export interface IProps {
    /**
     * The messages array to render.
     */
    messages: IMessage[];
}
/**
 * Abstract component to display a list of chat messages, grouped by sender.
 *
 * @augments PureComponent
 */
export default class AbstractMessageContainer<P extends IProps, S> extends Component<P, S> {
    static defaultProps: {
        messages: IMessage[];
    };
    /**
     * Iterates over all the messages and creates nested arrays which hold
     * consecutive messages sent by the same participant.
     *
     * @private
     * @returns {Array<Array<Object>>}
     */
    _getMessagesGroupedBySender(): IMessage[][];
}
