/**
 * The styles of the feature base/participants.
 */
declare const _default: {
    avatarContainer: (size?: number) => {
        alignItems: string;
        borderRadius: number;
        height: number;
        justifyContent: string;
        overflow: string;
        width: number;
    };
    avatarContent: (size?: number) => {
        height: number;
        width: number;
    };
    badge: (size: number | undefined, status: string) => {
        backgroundColor: string | undefined;
        borderRadius: number;
        bottom: number;
        height: number;
        position: string;
        width: number;
    };
    badgeContainer: {
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    initialsContainer: {
        alignItems: string;
        alignSelf: string;
        flex: number;
        justifyContent: string;
    };
    initialsText: (size?: number) => {
        color: string;
        fontSize: number;
        fontWeight: string;
    };
    staticAvatar: {
        backgroundColor: string;
        opacity: number;
    };
};
export default _default;
