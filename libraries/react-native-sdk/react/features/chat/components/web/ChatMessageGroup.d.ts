/// <reference types="react" />
import { IMessage } from '../../types';
export interface IProps {
    /**
     * Additional CSS classes to apply to the root element.
     */
    className: string;
    /**
     * The messages to display as a group.
     */
    messages: Array<IMessage>;
}
declare const ChatMessageGroup: ({ className, messages }: IProps) => JSX.Element | null;
export default ChatMessageGroup;
