import { RefObject } from 'react';
import AbstractMessageContainer, { IProps } from '../AbstractMessageContainer';
export interface IState {
    /**
     * Whether or not message container has received new messages.
     */
    hasNewMessages: boolean;
    /**
     * Whether or not scroll position is at the bottom of container.
     */
    isScrolledToBottom: boolean;
    /**
     * The id of the last read message.
     */
    lastReadMessageId: string;
}
/**
 * Displays all received chat messages, grouped by sender.
 *
 * @augments AbstractMessageContainer
 */
export default class MessageContainer extends AbstractMessageContainer<IProps, IState> {
    /**
     * Component state used to decide when the hasNewMessages button to appear
     * and where to scroll when click on hasNewMessages button.
     */
    state: IState;
    /**
     * Reference to the HTML element at the end of the list of displayed chat
     * messages. Used for scrolling to the end of the chat messages.
     */
    _messagesListEndRef: RefObject<HTMLDivElement>;
    /**
     * A React ref to the HTML element containing all {@code ChatMessageGroup}
     * instances.
     */
    _messageListRef: RefObject<HTMLDivElement>;
    /**
     * Intersection observer used to detect intersections of messages with the bottom of the message container.
     */
    _bottomListObserver: IntersectionObserver;
    /**
     * Initializes a new {@code MessageContainer} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code MessageContainer} instance with.
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Implements {@code Component#componentDidMount}.
     * When Component mount scroll message container to bottom.
     * Create observer to react when scroll position is at bottom or leave the bottom.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements {@code Component#componentDidUpdate}.
     * If the user receive a new message or the local user send a new message,
     * scroll automatically to the bottom if scroll position was at the bottom.
     * Otherwise update hasNewMessages from component state.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Implements React's {@link Component#componentWillUnmount()}. Invoked
     * immediately before this component is unmounted and destroyed.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Automatically scrolls the displayed chat messages to bottom or to a specific element if it is provided.
     *
     * @param {boolean} withAnimation - Whether or not to show a scrolling.
     * @param {TMLElement} element - Where to scroll.
     * Animation.
     * @returns {void}
     */
    scrollToElement(withAnimation: boolean, element: Element | null): void;
    /**
     * Callback invoked to listen to current scroll position and update next unread message.
     * The callback is invoked inside a throttle with 300 ms to decrease the number of function calls.
     *
     * @private
     * @returns {void}
     */
    _onChatScroll(): void;
    /**
     * Find the first unread message.
     * Update component state and scroll to element.
     *
     * @private
     * @returns {void}
     */
    _onGoToFirstUnreadMessage(): void;
    /**
    * Create observer to react when scroll position is at bottom or leave the bottom.
    *
    * @private
    * @returns {void}
    */
    _createBottomListObserver(): void;
    /** .
    * _HandleIntersectBottomList.
    * When entry is intersecting with bottom of container set last message as last read message.
    * When entry is not intersecting update only isScrolledToBottom with false value.
    *
    * @param {Array} entries - List of entries.
    * @private
    * @returns {void}
    */
    _handleIntersectBottomList(entries: IntersectionObserverEntry[]): void;
    /**
    * Find first unread message.
    * MessageIsAfterLastSeenMessage filter elements which are not visible but are before the last read message.
    *
    * @private
    * @returns {Element}
    */
    _findFirstUnreadMessage(): any;
    /**
     * Check if a message is visible in view.
     *
     * @param {Element} message - The message.
     *
     * @returns {boolean}
     */
    _isMessageVisible(message: Element): boolean;
}
