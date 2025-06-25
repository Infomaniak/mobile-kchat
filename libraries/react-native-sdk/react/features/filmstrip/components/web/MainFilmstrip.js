"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const utils_1 = require("../../../base/environment/utils");
const constants_1 = require("../../../video-layout/constants");
const functions_web_1 = require("../../../video-layout/functions.web");
const constants_2 = require("../../constants");
const functions_web_2 = require("../../functions.web");
const Filmstrip_1 = __importDefault(require("./Filmstrip"));
const MainFilmstrip = (props) => (react_1.default.createElement("span", null,
    react_1.default.createElement(Filmstrip_1.default, { ...props, filmstripType: constants_2.FILMSTRIP_TYPE.MAIN })));
/**
 * Maps (parts of) the Redux state to the associated {@code Filmstrip}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {any} _ownProps - Components' own props.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, _ownProps) {
    const { toolbarButtons } = state['features/toolbox'];
    const { remoteParticipants, width: verticalFilmstripWidth } = state['features/filmstrip'];
    const reduceHeight = state['features/toolbox'].visible && toolbarButtons?.length;
    const { gridDimensions: dimensions = { columns: undefined,
        rows: undefined }, filmstripHeight, filmstripWidth, hasScroll: tileViewHasScroll, thumbnailSize: tileViewThumbnailSize } = state['features/filmstrip'].tileViewDimensions ?? {};
    const _currentLayout = (0, functions_web_1.getCurrentLayout)(state);
    const _resizableFilmstrip = (0, functions_web_2.isFilmstripResizable)(state);
    const _verticalViewGrid = (0, functions_web_2.showGridInVerticalView)(state);
    let gridDimensions = dimensions;
    let _hasScroll = false;
    const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
    const availableSpace = clientHeight - Number(filmstripHeight);
    let filmstripPadding = 0;
    if (availableSpace > 0) {
        const paddingValue = constants_2.TOOLBAR_HEIGHT_MOBILE - availableSpace;
        if (paddingValue > 0) {
            filmstripPadding = paddingValue;
        }
    }
    else {
        filmstripPadding = constants_2.TOOLBAR_HEIGHT_MOBILE;
    }
    const collapseTileView = reduceHeight
        && (0, utils_1.isMobileBrowser)()
        && clientWidth <= constants_2.ASPECT_RATIO_BREAKPOINT;
    const shouldReduceHeight = reduceHeight && ((0, utils_1.isMobileBrowser)() || (_currentLayout !== constants_1.LAYOUTS.VERTICAL_FILMSTRIP_VIEW
        && _currentLayout !== constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW));
    let _thumbnailSize, remoteFilmstripHeight, remoteFilmstripWidth;
    switch (_currentLayout) {
        case constants_1.LAYOUTS.TILE_VIEW:
            _hasScroll = Boolean(tileViewHasScroll);
            _thumbnailSize = tileViewThumbnailSize;
            remoteFilmstripHeight = Number(filmstripHeight) - (collapseTileView && filmstripPadding > 0 ? filmstripPadding : 0);
            remoteFilmstripWidth = filmstripWidth;
            break;
        case constants_1.LAYOUTS.VERTICAL_FILMSTRIP_VIEW:
        case constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW: {
            const { remote, remoteVideosContainer, gridView, hasScroll } = state['features/filmstrip'].verticalViewDimensions;
            _hasScroll = Boolean(hasScroll);
            remoteFilmstripHeight = Number(remoteVideosContainer?.height) - (!_verticalViewGrid && shouldReduceHeight
                ? constants_2.TOOLBAR_HEIGHT : 0);
            remoteFilmstripWidth = remoteVideosContainer?.width;
            if (_verticalViewGrid) {
                gridDimensions = gridView?.gridDimensions ?? { columns: undefined,
                    rows: undefined };
                _thumbnailSize = gridView?.thumbnailSize;
                _hasScroll = Boolean(gridView?.hasScroll);
            }
            else {
                _thumbnailSize = remote;
            }
            break;
        }
        case constants_1.LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW: {
            const { remote, remoteVideosContainer, hasScroll } = state['features/filmstrip'].horizontalViewDimensions;
            _hasScroll = Boolean(hasScroll);
            _thumbnailSize = remote;
            remoteFilmstripHeight = remoteVideosContainer?.height;
            remoteFilmstripWidth = remoteVideosContainer?.width;
            break;
        }
    }
    return {
        _columns: gridDimensions.columns ?? 1,
        _filmstripHeight: remoteFilmstripHeight,
        _filmstripWidth: remoteFilmstripWidth,
        _hasScroll,
        _remoteParticipants: remoteParticipants,
        _resizableFilmstrip,
        _rows: gridDimensions.rows ?? 1,
        _thumbnailWidth: _thumbnailSize?.width,
        _thumbnailHeight: _thumbnailSize?.height,
        _verticalViewGrid,
        _verticalViewBackground: Number(verticalFilmstripWidth.current)
            + constants_2.FILMSTRIP_BREAKPOINT_OFFSET >= constants_2.FILMSTRIP_BREAKPOINT
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(MainFilmstrip);
