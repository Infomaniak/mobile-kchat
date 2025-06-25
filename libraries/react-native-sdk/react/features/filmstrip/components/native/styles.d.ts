/**
 * Size for the Avatar.
 */
export declare const AVATAR_SIZE = 50;
/**
 * The styles of the feature filmstrip.
 */
declare const _default: {
    /**
     * The FlatList content container styles.
     */
    contentContainer: {
        alignItems: string;
        justifyContent: string;
        flex: number;
    };
    /**
     * The display name container.
     */
    displayNameContainer: {
        padding: number;
    };
    /**
     * The style of the narrow {@link Filmstrip} version which displays
     * thumbnails in a row at the bottom of the screen.
     */
    filmstripNarrow: {
        flexDirection: string;
        flexGrow: number;
        justifyContent: string;
        margin: number;
    };
    /**
     * The style of the wide {@link Filmstrip} version which displays thumbnails
     * in a column on the short size of the screen.
     *
     * NOTE: width is calculated based on the children, but it should also align
     * to {@code FILMSTRIP_SIZE}.
     */
    filmstripWide: {
        bottom: any;
        flexDirection: string;
        flexGrow: number;
        position: string;
        right: any;
        top: any;
    };
    /**
     * The styles for the FlatList container.
     */
    flatListContainer: {
        flexGrow: number;
        flexShrink: number;
        flex: number;
    };
    /**
     * The styles for the FlatList component in stage view.
     */
    flatListStageView: {
        flexGrow: number;
    };
    /**
     * The styles for the FlatList component in tile view.
     */
    flatListTileView: {
        flex: number;
    };
    /**
     * Container of the {@link LocalThumbnail}.
     */
    localThumbnail: {
        alignContent: string;
        alignSelf: string;
        aspectRatio: number;
        flexShrink: number;
        flexDirection: string;
    };
    /**
     * The style of a participant's Thumbnail which renders either the video or
     * the avatar of the associated participant.
     */
    thumbnail: {
        alignItems: string;
        backgroundColor: any;
        borderColor: any;
        borderRadius: any;
        borderStyle: string;
        borderWidth: number;
        flex: number;
        height: number;
        justifyContent: string;
        margin: number;
        maxHeight: number;
        maxWidth: number;
        overflow: string;
        position: string;
        width: number;
    };
    indicatorContainer: {
        alignItems: string;
        backgroundColor: string;
        borderRadius: any;
        height: number;
        margin: number;
        padding: number;
    };
    screenShareIndicatorContainer: {
        alignItems: string;
        backgroundColor: string;
        borderRadius: any;
        height: number;
        margin: number;
        padding: number;
    };
    /**
     * The thumbnail indicator container.
     */
    thumbnailIndicatorContainer: {
        bottom: number;
        flex: number;
        flexDirection: string;
        left: number;
        position: string;
        maxWidth: string;
        overflow: string;
        padding: any;
        alignItems: string;
        backgroundColor: string;
        borderRadius: any;
        height: number;
        margin: number;
    };
    bottomIndicatorsContainer: {
        flexDirection: string;
        padding: any;
    };
    thumbnailTopLeftIndicatorContainer: {
        backgroundColor: string;
        flexDirection: string;
        position: string;
        top: any;
        alignItems: string;
        borderRadius: any;
        height: number;
        margin: number;
        padding: number;
    };
    raisedHandIndicator: {
        backgroundColor: any;
        alignItems: string;
        borderRadius: any;
        height: number;
        margin: number;
        padding: number;
    };
    raisedHandIcon: {
        color: any;
    };
    thumbnailRaisedHand: {
        borderWidth: number;
        borderColor: any;
    };
    thumbnailDominantSpeaker: {
        borderWidth: number;
        borderColor: any;
    };
    thumbnailGif: {
        flexGrow: number;
        resizeMode: string;
    };
};
export default _default;
