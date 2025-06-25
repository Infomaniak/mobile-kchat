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
const clsx_1 = __importDefault(require("clsx"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_window_1 = require("react-window");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const utils_1 = require("../../../base/environment/utils");
const functions_2 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const functions_any_1 = require("../../../base/settings/functions.any");
const actions_1 = require("../../../keyboard-shortcuts/actions");
const actions_web_1 = require("../../../toolbox/actions.web");
const functions_web_1 = require("../../../toolbox/functions.web");
const constants_1 = require("../../../video-layout/constants");
const functions_web_2 = require("../../../video-layout/functions.web");
const actions_2 = require("../../actions");
const constants_2 = require("../../constants");
const functions_3 = require("../../functions");
const functions_web_3 = require("../../functions.web");
const AudioTracksContainer_1 = __importDefault(require("./AudioTracksContainer"));
const Thumbnail_1 = __importDefault(require("./Thumbnail"));
const ThumbnailWrapper_1 = __importDefault(require("./ThumbnailWrapper"));
const styles_1 = require("./styles");
/**
 * Implements a React {@link Component} which represents the filmstrip on
 * Web/React.
 *
 * @augments Component
 */
class Filmstrip extends react_1.PureComponent {
    /**
     * Initializes a new {@code Filmstrip} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            isMouseDown: false,
            mousePosition: null,
            dragFilmstripWidth: null
        };
        // Bind event handlers so they are only bound once for every instance.
        this._onShortcutToggleFilmstrip = this._onShortcutToggleFilmstrip.bind(this);
        this._onToolbarToggleFilmstrip = this._onToolbarToggleFilmstrip.bind(this);
        this._onTabIn = this._onTabIn.bind(this);
        this._gridItemKey = this._gridItemKey.bind(this);
        this._listItemKey = this._listItemKey.bind(this);
        this._onGridItemsRendered = this._onGridItemsRendered.bind(this);
        this._onListItemsRendered = this._onListItemsRendered.bind(this);
        this._onToggleButtonTouch = this._onToggleButtonTouch.bind(this);
        this._onDragHandleMouseDown = this._onDragHandleMouseDown.bind(this);
        this._onDragMouseUp = this._onDragMouseUp.bind(this);
        this._onFilmstripResize = this._onFilmstripResize.bind(this);
        this._throttledResize = lodash_1.default.throttle(this._onFilmstripResize, 50, {
            leading: true,
            trailing: false
        });
    }
    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this.props.dispatch((0, actions_1.registerShortcut)({
            character: 'F',
            helpDescription: 'keyboardShortcuts.toggleFilmstrip',
            handler: this._onShortcutToggleFilmstrip
        }));
        document.addEventListener('mouseup', this._onDragMouseUp);
        // @ts-ignore
        document.addEventListener('mousemove', this._throttledResize);
    }
    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this.props.dispatch((0, actions_1.unregisterShortcut)('F'));
        document.removeEventListener('mouseup', this._onDragMouseUp);
        // @ts-ignore
        document.removeEventListener('mousemove', this._throttledResize);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const filmstripStyle = {};
        const { _currentLayout, _disableSelfView, _filmstripDisabled, _localScreenShareId, _mainFilmstripVisible, _resizableFilmstrip, _topPanelFilmstrip, _topPanelMaxHeight, _topPanelVisible, _verticalViewBackground, _verticalViewGrid, _verticalViewMaxWidth, filmstripType, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        const { isMouseDown } = this.state;
        const tileViewActive = _currentLayout === constants_1.LAYOUTS.TILE_VIEW;
        if (_currentLayout === constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW && filmstripType === constants_2.FILMSTRIP_TYPE.STAGE) {
            if (_topPanelFilmstrip) {
                filmstripStyle.maxHeight = `${_topPanelMaxHeight}px`;
                filmstripStyle.zIndex = 1;
                if (!_topPanelVisible) {
                    filmstripStyle.top = `-${_topPanelMaxHeight}px`;
                }
            }
            if (_mainFilmstripVisible) {
                filmstripStyle.maxWidth = `calc(100% - ${_verticalViewMaxWidth}px)`;
            }
        }
        else if (_currentLayout === constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW && filmstripType === constants_2.FILMSTRIP_TYPE.SCREENSHARE) {
            if (_mainFilmstripVisible) {
                filmstripStyle.maxWidth = `calc(100% - ${_verticalViewMaxWidth}px)`;
            }
            if (_topPanelVisible) {
                filmstripStyle.maxHeight = `calc(100% - ${_topPanelMaxHeight}px)`;
            }
            filmstripStyle.bottom = 0;
            filmstripStyle.top = 'auto';
        }
        else if (_currentLayout === constants_1.LAYOUTS.VERTICAL_FILMSTRIP_VIEW
            || (_currentLayout === constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW && filmstripType === constants_2.FILMSTRIP_TYPE.MAIN)) {
            filmstripStyle.maxWidth = _verticalViewMaxWidth;
            if (!_mainFilmstripVisible) {
                filmstripStyle.right = `-${filmstripStyle.maxWidth}px`;
            }
        }
        let toolbar = null;
        if (!this.props._iAmRecorder && this.props._isFilmstripButtonEnabled
            && _currentLayout !== constants_1.LAYOUTS.TILE_VIEW
            && ((filmstripType === constants_2.FILMSTRIP_TYPE.MAIN && !_filmstripDisabled)
                || (filmstripType === constants_2.FILMSTRIP_TYPE.STAGE && _topPanelFilmstrip))) {
            toolbar = this._renderToggleButton();
        }
        const filmstrip = (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: (0, clsx_1.default)(this.props._videosClassName, !tileViewActive && (filmstripType === constants_2.FILMSTRIP_TYPE.MAIN
                    || (filmstripType === constants_2.FILMSTRIP_TYPE.STAGE && _topPanelFilmstrip))
                    && !_resizableFilmstrip && 'filmstrip-hover', _verticalViewGrid && 'vertical-view-grid'), id: 'remoteVideos' },
                !_disableSelfView && !_verticalViewGrid && (react_1.default.createElement("div", { className: 'filmstrip__videos', id: 'filmstripLocalVideo' }, !tileViewActive && filmstripType === constants_2.FILMSTRIP_TYPE.MAIN
                    && react_1.default.createElement("div", { id: 'filmstripLocalVideoThumbnail' },
                        react_1.default.createElement(Thumbnail_1.default, { filmstripType: constants_2.FILMSTRIP_TYPE.MAIN, key: 'local' })))),
                _localScreenShareId && !_disableSelfView && !_verticalViewGrid && (react_1.default.createElement("div", { className: 'filmstrip__videos', id: 'filmstripLocalScreenShare' },
                    react_1.default.createElement("div", { id: 'filmstripLocalScreenShareThumbnail' }, !tileViewActive && filmstripType === constants_2.FILMSTRIP_TYPE.MAIN && react_1.default.createElement(Thumbnail_1.default, { key: 'localScreenShare', participantID: _localScreenShareId })))),
                this._renderRemoteParticipants())));
        return (react_1.default.createElement("div", { className: (0, clsx_1.default)('filmstrip', this.props._className, classes.filmstrip, _verticalViewGrid && 'no-vertical-padding', _verticalViewBackground && classes.filmstripBackground), style: filmstripStyle },
            react_1.default.createElement("span", { "aria-level": 1, className: 'sr-only', role: 'heading' }, t('filmstrip.accessibilityLabel.heading')),
            toolbar,
            _resizableFilmstrip
                ? react_1.default.createElement("div", { className: (0, clsx_1.default)('resizable-filmstrip', classes.resizableFilmstripContainer, _topPanelFilmstrip && 'top-panel-filmstrip') },
                    react_1.default.createElement("div", { className: (0, clsx_1.default)('dragHandleContainer', classes.dragHandleContainer, isMouseDown && 'visible', _topPanelFilmstrip && 'top-panel'), onMouseDown: this._onDragHandleMouseDown },
                        react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.dragHandle, 'dragHandle') })),
                    filmstrip)
                : filmstrip,
            react_1.default.createElement(AudioTracksContainer_1.default, null)));
    }
    /**
     * Handles mouse down on the drag handle.
     *
     * @param {MouseEvent} e - The mouse down event.
     * @returns {void}
     */
    _onDragHandleMouseDown(e) {
        const { _topPanelFilmstrip, _topPanelHeight, _verticalFilmstripWidth } = this.props;
        this.setState({
            isMouseDown: true,
            mousePosition: _topPanelFilmstrip ? e.clientY : e.clientX,
            dragFilmstripWidth: _verticalFilmstripWidth || constants_2.DEFAULT_FILMSTRIP_WIDTH,
            dragFilmstripHeight: _topPanelHeight || constants_2.TOP_FILMSTRIP_HEIGHT
        });
        this.props.dispatch((0, actions_2.setUserIsResizing)(true));
    }
    /**
     * Drag handle mouse up handler.
     *
     * @returns {void}
     */
    _onDragMouseUp() {
        if (this.state.isMouseDown) {
            this.setState({
                isMouseDown: false
            });
            this.props.dispatch((0, actions_2.setUserIsResizing)(false));
        }
    }
    /**
     * Handles drag handle mouse move.
     *
     * @param {MouseEvent} e - The mousemove event.
     * @returns {void}
     */
    _onFilmstripResize(e) {
        if (this.state.isMouseDown) {
            const { dispatch, _verticalFilmstripWidth, _maxFilmstripWidth, _topPanelHeight, _maxTopPanelHeight, _topPanelFilmstrip } = this.props;
            const { dragFilmstripWidth, dragFilmstripHeight, mousePosition } = this.state;
            if (_topPanelFilmstrip) {
                const diff = e.clientY - (mousePosition ?? 0);
                const height = Math.max(Math.min((dragFilmstripHeight ?? 0) + diff, _maxTopPanelHeight), constants_2.TOP_FILMSTRIP_HEIGHT);
                if (height !== _topPanelHeight) {
                    dispatch((0, actions_2.setUserFilmstripHeight)(height));
                }
            }
            else {
                const diff = (mousePosition ?? 0) - e.clientX;
                const width = Math.max(Math.min((dragFilmstripWidth ?? 0) + diff, _maxFilmstripWidth), constants_2.DEFAULT_FILMSTRIP_WIDTH);
                if (width !== _verticalFilmstripWidth) {
                    dispatch((0, actions_2.setUserFilmstripWidth)(width));
                }
            }
        }
    }
    /**
     * Calculates the start and stop indices based on whether the thumbnails need to be reordered in the filmstrip.
     *
     * @param {number} startIndex - The start index.
     * @param {number} stopIndex - The stop index.
     * @returns {Object}
     */
    _calculateIndices(startIndex, stopIndex) {
        const { _currentLayout, _iAmRecorder, _disableSelfView } = this.props;
        let start = startIndex;
        let stop = stopIndex;
        if (!_disableSelfView) {
            // In tile view, the indices needs to be offset by 1 because the first thumbnail is that of the local
            // endpoint. The remote participants start from index 1.
            if (!_iAmRecorder && _currentLayout === constants_1.LAYOUTS.TILE_VIEW) {
                start = Math.max(startIndex - 1, 0);
                stop = stopIndex - 1;
            }
        }
        return {
            startIndex: start,
            stopIndex: stop
        };
    }
    /**
     * Toggle the toolbar visibility when tabbing into it.
     *
     * @returns {void}
     */
    _onTabIn() {
        if (!this.props._isToolboxVisible && this.props._mainFilmstripVisible) {
            this.props.dispatch((0, actions_web_1.showToolbox)());
        }
    }
    /**
     * The key to be used for every ThumbnailWrapper element in stage view.
     *
     * @param {number} index - The index of the ThumbnailWrapper instance.
     * @returns {string} - The key.
     */
    _listItemKey(index) {
        const { _remoteParticipants, _remoteParticipantsLength } = this.props;
        if (typeof index !== 'number' || _remoteParticipantsLength <= index) {
            return `empty-${index}`;
        }
        return _remoteParticipants[index];
    }
    /**
     * The key to be used for every ThumbnailWrapper element in tile views.
     *
     * @param {Object} data - An object with the indexes identifying the ThumbnailWrapper instance.
     * @returns {string} - The key.
     */
    _gridItemKey({ columnIndex, rowIndex }) {
        const { _disableSelfView, _columns, _iAmRecorder, _remoteParticipants, _remoteParticipantsLength } = this.props;
        const index = (rowIndex * _columns) + columnIndex;
        // When the thumbnails are reordered, local participant is inserted at index 0.
        const localIndex = _disableSelfView ? _remoteParticipantsLength : 0;
        const remoteIndex = !_iAmRecorder && !_disableSelfView ? index - 1 : index;
        if (index > _remoteParticipantsLength - (_iAmRecorder ? 1 : 0)) {
            return `empty-${index}`;
        }
        if (!_iAmRecorder && index === localIndex) {
            return 'local';
        }
        return _remoteParticipants[remoteIndex];
    }
    /**
     * Handles items rendered changes in stage view.
     *
     * @param {Object} data - Information about the rendered items.
     * @returns {void}
     */
    _onListItemsRendered({ visibleStartIndex, visibleStopIndex }) {
        const { dispatch } = this.props;
        const { startIndex, stopIndex } = this._calculateIndices(visibleStartIndex, visibleStopIndex);
        dispatch((0, actions_2.setVisibleRemoteParticipants)(startIndex, stopIndex));
    }
    /**
     * Handles items rendered changes in tile view.
     *
     * @param {Object} data - Information about the rendered items.
     * @returns {void}
     */
    _onGridItemsRendered({ visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex }) {
        const { _columns, dispatch } = this.props;
        const start = (visibleRowStartIndex * _columns) + visibleColumnStartIndex;
        const stop = (visibleRowStopIndex * _columns) + visibleColumnStopIndex;
        const { startIndex, stopIndex } = this._calculateIndices(start, stop);
        dispatch((0, actions_2.setVisibleRemoteParticipants)(startIndex, stopIndex));
    }
    /**
     * Renders the thumbnails for remote participants.
     *
     * @returns {ReactElement}
     */
    _renderRemoteParticipants() {
        const { _columns, _currentLayout, _filmstripHeight, _filmstripWidth, _hasScroll, _isVerticalFilmstrip, _remoteParticipantsLength, _resizableFilmstrip, _rows, _thumbnailHeight, _thumbnailWidth, _verticalViewGrid, filmstripType } = this.props;
        if (!_thumbnailWidth || isNaN(_thumbnailWidth) || !_thumbnailHeight
            || isNaN(_thumbnailHeight) || !_filmstripHeight || isNaN(_filmstripHeight) || !_filmstripWidth
            || isNaN(_filmstripWidth)) {
            return null;
        }
        if (_currentLayout === constants_1.LAYOUTS.TILE_VIEW || _verticalViewGrid || filmstripType !== constants_2.FILMSTRIP_TYPE.MAIN) {
            return (react_1.default.createElement(react_window_1.FixedSizeGrid, { className: 'filmstrip__videos remote-videos', columnCount: _columns, columnWidth: _thumbnailWidth + constants_2.TILE_HORIZONTAL_MARGIN, height: _filmstripHeight, initialScrollLeft: 0, initialScrollTop: 0, itemData: { filmstripType }, itemKey: this._gridItemKey, onItemsRendered: this._onGridItemsRendered, overscanRowCount: 1, rowCount: _rows, rowHeight: _thumbnailHeight + constants_2.TILE_VERTICAL_MARGIN, width: _filmstripWidth }, ThumbnailWrapper_1.default));
        }
        const props = {
            itemCount: _remoteParticipantsLength,
            className: `filmstrip__videos remote-videos ${_resizableFilmstrip ? '' : 'height-transition'}`,
            height: _filmstripHeight,
            itemKey: this._listItemKey,
            itemSize: 0,
            onItemsRendered: this._onListItemsRendered,
            overscanCount: 1,
            width: _filmstripWidth,
            style: {
                willChange: 'auto'
            }
        };
        if (_currentLayout === constants_1.LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW) {
            const itemSize = _thumbnailWidth + constants_2.TILE_HORIZONTAL_MARGIN;
            const isNotOverflowing = !_hasScroll;
            props.itemSize = itemSize;
            props.layout = 'horizontal';
            if (isNotOverflowing) {
                props.className += ' is-not-overflowing';
            }
        }
        else if (_isVerticalFilmstrip) {
            const itemSize = _thumbnailHeight + constants_2.TILE_VERTICAL_MARGIN;
            const isNotOverflowing = !_hasScroll;
            if (isNotOverflowing) {
                props.className += ' is-not-overflowing';
            }
            props.itemSize = itemSize;
        }
        return (react_1.default.createElement(react_window_1.FixedSizeList, { ...props }, ThumbnailWrapper_1.default));
    }
    /**
     * Dispatches an action to change the visibility of the filmstrip.
     *
     * @private
     * @returns {void}
     */
    _doToggleFilmstrip() {
        const { dispatch, _mainFilmstripVisible, _topPanelFilmstrip, _topPanelVisible } = this.props;
        _topPanelFilmstrip
            ? dispatch((0, actions_2.setTopPanelVisible)(!_topPanelVisible))
            : dispatch((0, actions_2.setFilmstripVisible)(!_mainFilmstripVisible));
    }
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling filmstrip visibility.
     *
     * @private
     * @returns {void}
     */
    _onShortcutToggleFilmstrip() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('toggle.filmstrip', AnalyticsEvents_1.ACTION_SHORTCUT_TRIGGERED, {
            enable: this.props._mainFilmstripVisible
        }));
        this._doToggleFilmstrip();
    }
    /**
     * Creates an analytics toolbar event and dispatches an action for opening
     * the speaker stats modal.
     *
     * @private
     * @returns {void}
     */
    _onToolbarToggleFilmstrip() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('toggle.filmstrip.button', {
            enable: this.props._mainFilmstripVisible
        }));
        this._doToggleFilmstrip();
    }
    /**
     * Handler for touch start event of the 'toggle button'.
     *
     * @private
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    _onToggleButtonTouch(e) {
        // Don't propagate the touchStart event so the toolbar doesn't get toggled.
        e.stopPropagation();
        this._onToolbarToggleFilmstrip();
    }
    /**
     * Creates a React Element for changing the visibility of the filmstrip when
     * clicked.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderToggleButton() {
        const { t, _isVerticalFilmstrip, _mainFilmstripVisible, _topPanelFilmstrip, _topPanelVisible } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        const icon = (_topPanelFilmstrip ? _topPanelVisible : _mainFilmstripVisible) ? svg_1.IconArrowDown : svg_1.IconArrowUp;
        const actions = (0, utils_1.isMobileBrowser)()
            ? { onTouchStart: this._onToggleButtonTouch }
            : { onClick: this._onToolbarToggleFilmstrip };
        return (react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.toggleFilmstripContainer, _isVerticalFilmstrip && classes.toggleVerticalFilmstripContainer, _topPanelFilmstrip && classes.toggleTopPanelContainer, _topPanelFilmstrip && !_topPanelVisible && classes.toggleTopPanelContainerHidden, 'toggleFilmstripContainer') },
            react_1.default.createElement("button", { "aria-expanded": this.props._mainFilmstripVisible, "aria-label": t('toolbar.accessibilityLabel.toggleFilmstrip'), className: classes.toggleFilmstripButton, id: 'toggleFilmstripButton', onFocus: this._onTabIn, tabIndex: 0, ...actions },
                react_1.default.createElement(Icon_1.default, { "aria-label": t('toolbar.accessibilityLabel.toggleFilmstrip'), size: 24, src: icon }))));
    }
}
/**
 * Maps (parts of) the Redux state to the associated {@code Filmstrip}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { _hasScroll = false, filmstripType, _topPanelFilmstrip, _remoteParticipants } = ownProps;
    const { toolbarButtons } = state['features/toolbox'];
    const { iAmRecorder } = state['features/base/config'];
    const { topPanelHeight, topPanelVisible, visible, width: verticalFilmstripWidth } = state['features/filmstrip'];
    const { localScreenShare } = state['features/base/participants'];
    const reduceHeight = state['features/toolbox'].visible && toolbarButtons?.length;
    const remoteVideosVisible = (0, functions_3.shouldRemoteVideosBeVisible)(state);
    const { isOpen: shiftRight } = state['features/chat'];
    const disableSelfView = (0, functions_any_1.getHideSelfView)(state);
    const { clientWidth, clientHeight } = state['features/base/responsive-ui'];
    const filmstripDisabled = (0, functions_web_3.isFilmstripDisabled)(state);
    const collapseTileView = reduceHeight
        && (0, utils_1.isMobileBrowser)()
        && clientWidth <= constants_2.ASPECT_RATIO_BREAKPOINT;
    const shouldReduceHeight = reduceHeight && (0, utils_1.isMobileBrowser)();
    const _topPanelVisible = (0, functions_3.isStageFilmstripTopPanel)(state) && topPanelVisible;
    const notDisabled = visible && !filmstripDisabled;
    let isVisible = notDisabled || filmstripType !== constants_2.FILMSTRIP_TYPE.MAIN;
    if (_topPanelFilmstrip) {
        isVisible = _topPanelVisible;
    }
    const videosClassName = `filmstrip__videos${isVisible ? '' : ' hidden'}${_hasScroll ? ' has-scroll' : ''}`;
    const className = `${remoteVideosVisible || ownProps._verticalViewGrid ? '' : 'hide-videos'} ${shouldReduceHeight ? 'reduce-height' : ''} ${shiftRight ? 'shift-right' : ''} ${collapseTileView ? 'collapse' : ''} ${isVisible ? '' : 'hidden'}`.trim();
    const _currentLayout = (0, functions_web_2.getCurrentLayout)(state);
    const _isVerticalFilmstrip = _currentLayout === constants_1.LAYOUTS.VERTICAL_FILMSTRIP_VIEW
        || (filmstripType === constants_2.FILMSTRIP_TYPE.MAIN && _currentLayout === constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW);
    return {
        _className: className,
        _chatOpen: state['features/chat'].isOpen,
        _currentLayout,
        _disableSelfView: disableSelfView,
        _filmstripDisabled: filmstripDisabled,
        _hasScroll,
        _iAmRecorder: Boolean(iAmRecorder),
        _isFilmstripButtonEnabled: (0, functions_web_1.isButtonEnabled)('filmstrip', state),
        _isToolboxVisible: (0, functions_web_1.isToolboxVisible)(state),
        _isVerticalFilmstrip,
        _localScreenShareId: localScreenShare?.id,
        _mainFilmstripVisible: notDisabled,
        _maxFilmstripWidth: clientWidth - constants_2.MIN_STAGE_VIEW_WIDTH,
        _maxTopPanelHeight: clientHeight - constants_2.MIN_STAGE_VIEW_HEIGHT,
        _remoteParticipantsLength: _remoteParticipants?.length ?? 0,
        _topPanelHeight: topPanelHeight.current,
        _topPanelMaxHeight: topPanelHeight.current || constants_2.TOP_FILMSTRIP_HEIGHT,
        _topPanelVisible,
        _verticalFilmstripWidth: verticalFilmstripWidth.current,
        _verticalViewMaxWidth: (0, functions_3.getVerticalViewMaxWidth)(state),
        _videosClassName: videosClassName
    };
}
exports.default = (0, mui_1.withStyles)((0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(Filmstrip)), styles_1.styles);
