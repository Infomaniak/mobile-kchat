"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/participants/functions");
const Platform_native_1 = __importDefault(require("../../../base/react/Platform.native"));
const constants_1 = require("../../../base/responsive-ui/constants");
const functions_any_1 = require("../../../base/settings/functions.any");
const functions_2 = require("../../../toolbox/functions");
const actions_1 = require("../../actions");
const functions_native_1 = require("../../functions.native");
const LocalThumbnail_1 = __importDefault(require("./LocalThumbnail"));
const Thumbnail_1 = __importDefault(require("./Thumbnail"));
const styles_1 = __importDefault(require("./styles"));
// Immutable reference to avoid re-renders.
const NO_REMOTE_VIDEOS = [];
/**
 * Implements a React {@link Component} which represents the filmstrip on
 * mobile/React Native.
 *
 * @augments Component
 */
class Filmstrip extends react_1.PureComponent {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // XXX Our current design is to have the local participant separate from
        // the remote participants. Unfortunately, Android's Video
        // implementation cannot accommodate that because remote participants'
        // videos appear on top of the local participant's video at times.
        // That's because Android's Video utilizes EGL and EGL gives us only two
        // practical layers in which we can place our participants' videos:
        // layer #0 sits behind the window, creates a hole in the window, and
        // there we render the LargeVideo; layer #1 is known as media overlay in
        // EGL terms, renders on top of layer #0, and, consequently, is for the
        // Filmstrip. With the separate LocalThumbnail, we should have left the
        // remote participants' Thumbnails in layer #1 and utilized layer #2 for
        // LocalThumbnail. Unfortunately, layer #2 is not practical (that's why
        // I said we had two practical layers only) because it renders on top of
        // everything which in our case means on top of participant-related
        // indicators such as moderator, audio and video muted, etc. For now we
        // do not have much of a choice but to continue rendering LocalThumbnail
        // as any other remote Thumbnail on Android.
        this._separateLocalThumbnail = (0, functions_native_1.shouldDisplayLocalThumbnailSeparately)();
        this._viewabilityConfig = {
            itemVisiblePercentThreshold: 30,
            minimumViewTime: 500
        };
        this._keyExtractor = this._keyExtractor.bind(this);
        this._getItemLayout = this._getItemLayout.bind(this);
        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
        this._renderThumbnail = this._renderThumbnail.bind(this);
    }
    /**
     * Returns a key for a passed item of the list.
     *
     * @param {string} item - The user ID.
     * @returns {string} - The user ID.
     */
    _keyExtractor(item) {
        return item;
    }
    /**
     * Calculates the width and height of the filmstrip based on the screen size and aspect ratio.
     *
     * @returns {Object} - The width and the height.
     */
    _getDimensions() {
        const { _aspectRatio, _clientWidth, _clientHeight, _disableSelfView, _localParticipantId, insets } = this.props;
        const localParticipantVisible = Boolean(_localParticipantId) && !_disableSelfView;
        return (0, functions_native_1.getFilmstripDimensions)({
            aspectRatio: _aspectRatio,
            clientHeight: _clientHeight,
            clientWidth: _clientWidth,
            insets,
            localParticipantVisible
        });
    }
    /**
     * Optimization for FlatList. Returns the length, offset and index for an item.
     *
     * @param {Array<string>} _data - The data array with user IDs.
     * @param {number} index - The index number of the item.
     * @returns {Object}
     */
    _getItemLayout(_data, index) {
        const { _aspectRatio } = this.props;
        const isNarrowAspectRatio = _aspectRatio === constants_1.ASPECT_RATIO_NARROW;
        const length = isNarrowAspectRatio ? styles_1.default.thumbnail.width : styles_1.default.thumbnail.height;
        return {
            length,
            offset: length * index,
            index
        };
    }
    /**
     * A handler for visible items changes.
     *
     * @param {Object} data - The visible items data.
     * @param {Array<Object>} data.viewableItems - The visible items array.
     * @returns {void}
     */
    _onViewableItemsChanged({ viewableItems = [] }) {
        const { _disableSelfView } = this.props;
        if (!this._separateLocalThumbnail && !_disableSelfView && viewableItems[0]?.index === 0) {
            // Skip the local thumbnail.
            viewableItems.shift();
        }
        if (viewableItems.length === 0) {
            // User might be fast-scrolling, it will stabilize.
            return;
        }
        let startIndex = Number(viewableItems[0].index);
        let endIndex = Number(viewableItems[viewableItems.length - 1].index);
        if (!this._separateLocalThumbnail && !_disableSelfView) {
            // We are off by one in the remote participants array.
            startIndex -= 1;
            endIndex -= 1;
        }
        this.props.dispatch((0, actions_1.setVisibleRemoteParticipants)(startIndex, endIndex));
    }
    /**
     * Creates React Element to display each participant in a thumbnail.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderThumbnail({ item }) {
        return (<Thumbnail_1.default key={item} participantID={item}/>);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _aspectRatio, _disableSelfView, _toolboxVisible, _localParticipantId, _participants, _visible } = this.props;
        if (!_visible) {
            return null;
        }
        const bottomEdge = Platform_native_1.default.OS === 'ios' && !_toolboxVisible;
        const isNarrowAspectRatio = _aspectRatio === constants_1.ASPECT_RATIO_NARROW;
        const filmstripStyle = isNarrowAspectRatio ? styles_1.default.filmstripNarrow : styles_1.default.filmstripWide;
        const { height, width } = this._getDimensions();
        const { height: thumbnailHeight, width: thumbnailWidth, margin } = styles_1.default.thumbnail;
        const initialNumToRender = Math.ceil(isNarrowAspectRatio
            ? width / (thumbnailWidth + (2 * margin))
            : height / (thumbnailHeight + (2 * margin)));
        let participants;
        if (this._separateLocalThumbnail || _disableSelfView) {
            participants = _participants;
        }
        else if (isNarrowAspectRatio) {
            participants = [..._participants, _localParticipantId];
        }
        else {
            participants = [_localParticipantId, ..._participants];
        }
        return (<react_native_safe_area_context_1.SafeAreaView // @ts-ignore
         edges={[bottomEdge && 'bottom', 'left', 'right'].filter(Boolean)} style={filmstripStyle}>
                {this._separateLocalThumbnail
                && !isNarrowAspectRatio
                && !_disableSelfView
                && <LocalThumbnail_1.default />}
                <react_native_1.FlatList bounces={false} data={participants} 
        /* @ts-ignore */
        getItemLayout={this._getItemLayout} horizontal={isNarrowAspectRatio} initialNumToRender={initialNumToRender} key={isNarrowAspectRatio ? 'narrow' : 'wide'} keyExtractor={this._keyExtractor} onViewableItemsChanged={this._onViewableItemsChanged} renderItem={this._renderThumbnail} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles_1.default.flatListStageView} viewabilityConfig={this._viewabilityConfig} windowSize={2}/>
                {this._separateLocalThumbnail
                && isNarrowAspectRatio
                && !_disableSelfView
                && <LocalThumbnail_1.default />}
            </react_native_safe_area_context_1.SafeAreaView>);
    }
}
/**
 * Maps (parts of) the redux state to the associated {@code Filmstrip}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { enabled, remoteParticipants } = state['features/filmstrip'];
    const disableSelfView = (0, functions_any_1.getHideSelfView)(state);
    const showRemoteVideos = (0, functions_native_1.shouldRemoteVideosBeVisible)(state);
    const responsiveUI = state['features/base/responsive-ui'];
    return {
        _aspectRatio: responsiveUI.aspectRatio,
        _clientHeight: responsiveUI.clientHeight,
        _clientWidth: responsiveUI.clientWidth,
        _disableSelfView: disableSelfView,
        _localParticipantId: (0, functions_1.getLocalParticipant)(state)?.id ?? '',
        _participants: showRemoteVideos ? remoteParticipants : NO_REMOTE_VIDEOS,
        _toolboxVisible: (0, functions_2.isToolboxVisible)(state),
        _visible: enabled && (0, functions_native_1.isFilmstripVisible)(state)
    };
}
exports.default = (0, react_native_safe_area_context_1.withSafeAreaInsets)((0, react_redux_1.connect)(_mapStateToProps)(Filmstrip));
