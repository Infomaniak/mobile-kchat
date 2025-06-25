/// <reference types="react" />
export interface IProps {
    /**
     * An optional class name.
     */
    className: string;
    /**
     * Whether the polls feature is enabled or not.
     */
    isPollsEnabled: boolean;
    /**
     * Function to be called when pressing the close button.
     */
    onCancel: Function;
}
/**
 * Custom header of the {@code ChatDialog}.
 *
 * @returns {React$Element<any>}
 */
declare function ChatHeader({ className, isPollsEnabled }: IProps): JSX.Element;
export default ChatHeader;
