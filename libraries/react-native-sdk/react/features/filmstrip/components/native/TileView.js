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
const functions_any_1 = require("../../../base/settings/functions.any");
const actions_web_1 = require("../../actions.web");
const Thumbnail_1 = __importDefault(require("./Thumbnail"));
const styles_1 = __importDefault(require("./styles"));
/**
 * An empty array. The purpose of the constant is to use the same reference every time we need an empty array.
 * This will prevent unnecessary re-renders.
 */
const EMPTY_ARRAY = [];
/**
 * Implements a React {@link PureComponent} which displays thumbnails in a two
 * dimensional grid.
 *
 * @augments PureComponent
 */
class TileView extends react_1.PureComponent {
    /**
     * Creates new TileView component.
     *
     * @param {IProps} props - The props of the component.
     */
    constructor(props) {
        super(props);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
        this._renderThumbnail = this._renderThumbnail.bind(this);
        this._viewabilityConfig = {
            itemVisiblePercentThreshold: 30,
            minimumViewTime: 500
        };
        this._flatListStyles = {
            ...styles_1.default.flatListTileView
        };
        this._contentContainerStyles = {
            ...styles_1.default.contentContainer,
            paddingBottom: this.props.insets?.bottom || 0
        };
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
     * A handler for visible items changes.
     *
     * @param {Object} data - The visible items data.
     * @param {Array<Object>} data.viewableItems - The visible items array.
     * @returns {void}
     */
    _onViewableItemsChanged({ viewableItems = [] }) {
        const { _disableSelfView } = this.props;
        if (viewableItems[0]?.index === 0 && !_disableSelfView) {
            // Skip the local thumbnail.
            viewableItems.shift();
        }
        if (viewableItems.length === 0) {
            // User might be fast-scrolling, it will stabilize.
            return;
        }
        // We are off by one in the remote participants array.
        const startIndex = Number(viewableItems[0].index) - (_disableSelfView ? 0 : 1);
        const endIndex = Number(viewableItems[viewableItems.length - 1].index) - (_disableSelfView ? 0 : 1);
        this.props.dispatch((0, actions_web_1.setVisibleRemoteParticipants)(startIndex, endIndex));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _columns, _height, _thumbnailHeight, _width, onClick } = this.props;
        const participants = this._getSortedParticipants();
        const initialRowsToRender = Math.ceil(_height / (Number(_thumbnailHeight) + (2 * styles_1.default.thumbnail.margin)));
        if (this._flatListStyles.minHeight !== _height || this._flatListStyles.minWidth !== _width) {
            this._flatListStyles = {
                ...styles_1.default.flatListTileView,
                minHeight: _height,
                minWidth: _width
            };
        }
        if (this._contentContainerStyles.minHeight !== _height || this._contentContainerStyles.minWidth !== _width) {
            this._contentContainerStyles = {
                ...styles_1.default.contentContainer,
                minHeight: _height,
                minWidth: _width,
                paddingBottom: this.props.insets?.bottom || 0
            };
        }
        return (<react_native_1.TouchableWithoutFeedback onPress={onClick}>
                <react_native_1.SafeAreaView style={styles_1.default.flatListContainer}>
                    <react_native_1.FlatList bounces={false} contentContainerStyle={this._contentContainerStyles} data={participants} horizontal={false} initialNumToRender={initialRowsToRender} key={_columns} keyExtractor={this._keyExtractor} numColumns={_columns} onViewableItemsChanged={this._onViewableItemsChanged} renderItem={this._renderThumbnail} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={this._flatListStyles} viewabilityConfig={this._viewabilityConfig} windowSize={2}/>
                </react_native_1.SafeAreaView>
            </react_native_1.TouchableWithoutFeedback>);
    }
    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
    _getSortedParticipants() {
        const { _localParticipant, _remoteParticipants, _disableSelfView } = this.props;
        if (!_localParticipant) {
            return EMPTY_ARRAY;
        }
        if (_disableSelfView) {
            return _remoteParticipants;
        }
        return [_localParticipant?.id, ..._remoteParticipants];
    }
    /**
     * Creates React Element to display each participant in a thumbnail.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderThumbnail({ item }) {
        const { _thumbnailHeight } = this.props;
        return (<Thumbnail_1.default height={_thumbnailHeight} key={item} participantID={item} renderDisplayName={true} tileView={true}/>);
    }
}
/**
 * Maps (parts of) the redux state to the associated {@code TileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - Component props.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const responsiveUi = state['features/base/responsive-ui'];
    const { remoteParticipants, tileViewDimensions } = state['features/filmstrip'];
    const disableSelfView = (0, functions_any_1.getHideSelfView)(state);
    const { height } = tileViewDimensions?.thumbnailSize ?? {};
    const { columns } = tileViewDimensions ?? {};
    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _columns: columns ?? 1,
        _disableSelfView: disableSelfView,
        _height: responsiveUi.clientHeight - (ownProps.insets?.top || 0),
        _insets: ownProps.insets,
        _localParticipant: (0, functions_1.getLocalParticipant)(state),
        _participantCount: (0, functions_1.getParticipantCountWithFake)(state),
        _remoteParticipants: remoteParticipants,
        _thumbnailHeight: height,
        _width: responsiveUi.clientWidth - (ownProps.insets?.right || 0) - (ownProps.insets?.left || 0)
    };
}
exports.default = (0, react_native_safe_area_context_1.withSafeAreaInsets)((0, react_redux_1.connect)(_mapStateToProps)(TileView));
