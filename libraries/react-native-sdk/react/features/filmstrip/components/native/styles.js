"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVATAR_SIZE = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const constants_1 = require("../../constants");
/**
 * Size for the Avatar.
 */
exports.AVATAR_SIZE = 50;
const indicatorContainer = {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: BaseTheme_native_1.default.shape.borderRadius,
    height: 24,
    margin: 2,
    padding: 2
};
/**
 * The styles of the feature filmstrip.
 */
exports.default = {
    /**
     * The FlatList content container styles.
     */
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0
    },
    /**
     * The display name container.
     */
    displayNameContainer: {
        padding: 2
    },
    /**
     * The style of the narrow {@link Filmstrip} version which displays
     * thumbnails in a row at the bottom of the screen.
     */
    filmstripNarrow: {
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'flex-end',
        margin: 6
    },
    /**
     * The style of the wide {@link Filmstrip} version which displays thumbnails
     * in a column on the short size of the screen.
     *
     * NOTE: width is calculated based on the children, but it should also align
     * to {@code FILMSTRIP_SIZE}.
     */
    filmstripWide: {
        bottom: BaseTheme_native_1.default.spacing[0],
        flexDirection: 'column',
        flexGrow: 0,
        position: 'absolute',
        right: BaseTheme_native_1.default.spacing[0],
        top: BaseTheme_native_1.default.spacing[0]
    },
    /**
     * The styles for the FlatList container.
     */
    flatListContainer: {
        flexGrow: 1,
        flexShrink: 1,
        flex: 0
    },
    /**
     * The styles for the FlatList component in stage view.
     */
    flatListStageView: {
        flexGrow: 0
    },
    /**
     * The styles for the FlatList component in tile view.
     */
    flatListTileView: {
        flex: 0
    },
    /**
     * Container of the {@link LocalThumbnail}.
     */
    localThumbnail: {
        alignContent: 'stretch',
        alignSelf: 'stretch',
        aspectRatio: 1,
        flexShrink: 0,
        flexDirection: 'row'
    },
    /**
     * The style of a participant's Thumbnail which renders either the video or
     * the avatar of the associated participant.
     */
    thumbnail: {
        alignItems: 'stretch',
        backgroundColor: BaseTheme_native_1.default.palette.ui02,
        borderColor: BaseTheme_native_1.default.palette.ui03,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        height: constants_1.SMALL_THUMBNAIL_SIZE,
        justifyContent: 'center',
        margin: 2,
        maxHeight: constants_1.SMALL_THUMBNAIL_SIZE,
        maxWidth: constants_1.SMALL_THUMBNAIL_SIZE,
        overflow: 'hidden',
        position: 'relative',
        width: constants_1.SMALL_THUMBNAIL_SIZE
    },
    indicatorContainer: {
        ...indicatorContainer
    },
    screenShareIndicatorContainer: {
        ...indicatorContainer
    },
    /**
     * The thumbnail indicator container.
     */
    thumbnailIndicatorContainer: {
        ...indicatorContainer,
        bottom: 3,
        flex: 1,
        flexDirection: 'row',
        left: 3,
        position: 'absolute',
        maxWidth: '95%',
        overflow: 'hidden',
        padding: BaseTheme_native_1.default.spacing[0]
    },
    bottomIndicatorsContainer: {
        flexDirection: 'row',
        padding: BaseTheme_native_1.default.spacing[1]
    },
    thumbnailTopLeftIndicatorContainer: {
        ...indicatorContainer,
        backgroundColor: 'unset',
        flexDirection: 'row',
        position: 'absolute',
        top: BaseTheme_native_1.default.spacing[1]
    },
    raisedHandIndicator: {
        ...indicatorContainer,
        backgroundColor: BaseTheme_native_1.default.palette.warning02
    },
    raisedHandIcon: {
        color: BaseTheme_native_1.default.palette.uiBackground
    },
    thumbnailRaisedHand: {
        borderWidth: 2,
        borderColor: BaseTheme_native_1.default.palette.warning02
    },
    thumbnailDominantSpeaker: {
        borderWidth: 2,
        borderColor: BaseTheme_native_1.default.palette.action01Hover
    },
    thumbnailGif: {
        flexGrow: 1,
        resizeMode: 'contain'
    }
};
