/**
 * The styles of the feature chat.
 *
 * NOTE: Sizes and colors come from the 8x8 guidelines. This is the first
 * component to receive this treating, if others happen to have similar, we
 * need to extract the brand colors and sizes into a branding feature (planned
 * for the future).
 */
declare const _default: {
    /**
     * Background of the chat screen.
     */
    backdrop: {
        backgroundColor: any;
        flex: number;
    };
    emptyComponentText: {
        color: any;
        textAlign: string;
    };
    lobbyMessageBubble: {
        backgroundColor: any;
    };
    lobbyMsgNotice: {
        color: any;
        fontSize: number;
        marginTop: number;
    };
    privateNotice: any;
    privateMessageBubble: {
        backgroundColor: any;
    };
    remoteMessageBubble: {
        backgroundColor: any;
        borderTopLeftRadius: number;
    };
    replyContainer: {
        alignSelf: string;
        justifyContent: string;
    };
    replyStyles: {
        iconStyle: {
            color: any;
            fontSize: number;
            padding: any;
        };
        underlayColor: string;
    };
    /**
     * Wrapper View for the avatar.
     */
    avatarWrapper: {
        marginRight: any;
        width: number;
    };
    chatLink: {
        color: any;
    };
    chatMessage: any;
    /**
     * Wrapper for the details together, such as name, message and time.
     */
    detailsWrapper: {
        alignItems: string;
        flex: number;
        flexDirection: string;
    };
    emptyComponentWrapper: {
        alignSelf: string;
        flex: number;
        padding: number;
        paddingTop: string;
        maxWidth: string;
    };
    /**
     * A special padding to avoid issues on some devices (such as Android devices with custom suggestions bar).
     */
    extraBarPadding: {
        paddingBottom: number;
    };
    inputBarNarrow: {
        height: number;
        marginHorizontal: any;
        alignItems: string;
        flexDirection: string;
        justifyContent: string;
    };
    inputBarWide: {
        height: number;
        marginHorizontal: any;
        alignItems: string;
        flexDirection: string;
        justifyContent: string;
    };
    customInputContainer: {
        width: string;
    };
    messageBubble: {
        alignItems: string;
        borderRadius: number;
        flexDirection: string;
    };
    /**
     * Wrapper View for the entire block.
     */
    messageWrapper: {
        alignItems: string;
        flex: number;
        flexDirection: string;
        marginHorizontal: number;
        marginVertical: number;
    };
    /**
     * Style modifier for the {@code detailsWrapper} for own messages.
     */
    ownMessageDetailsWrapper: {
        alignItems: string;
    };
    replyWrapper: {
        alignItems: string;
        flexDirection: string;
    };
    /**
     * Style modifier for system (error) messages.
     */
    systemMessageBubble: {
        backgroundColor: string;
    };
    /**
     * Wrapper for the name and the message text.
     */
    textWrapper: {
        alignItems: string;
        flexDirection: string;
        padding: number;
    };
    /**
     * Text node for the timestamp.
     */
    timeText: {
        color: any;
        fontSize: number;
    };
    chatContainer: {
        backgroundColor: any;
        flex: number;
    };
    tabContainer: {
        flexDirection: string;
        justifyContent: string;
    };
    tabLeftButton: {
        flex: number;
        borderTopLeftRadius: number;
        borderTopRightRadius: number;
        borderBottomLeftRadius: number;
    };
    tabRightButton: {
        flex: number;
        borderTopLeftRadius: number;
        borderTopRightRadius: number;
        borderBottomRightRadius: number;
    };
    gifContainer: {
        maxHeight: number;
    };
    gifImage: {
        resizeMode: string;
        width: number;
        height: undefined;
        flexGrow: number;
    };
    senderDisplayName: any;
    localMessageBubble: {
        backgroundColor: any;
        borderTopRightRadius: number;
    };
    lobbyMessageRecipientContainer: {
        backgroundColor: any;
        alignItems: string;
        borderRadius: any;
        flexDirection: string;
        height: number;
        marginBottom: any;
        marginHorizontal: any;
        padding: any;
    };
    messageRecipientCancelIcon: {
        color: any;
        fontSize: number;
    };
    messageRecipientContainer: {
        alignItems: string;
        backgroundColor: any;
        borderRadius: any;
        flexDirection: string;
        height: number;
        marginBottom: any;
        marginHorizontal: any;
        padding: any;
    };
    messageRecipientText: any;
};
export default _default;
