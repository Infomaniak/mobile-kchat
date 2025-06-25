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
// eslint-disable-next-line no-confusing-arrow
const StageFilmstrip = (props) => props._currentLayout === constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW ? (react_1.default.createElement("span", { className: constants_1.LAYOUT_CLASSNAMES[constants_1.LAYOUTS.TILE_VIEW] },
    react_1.default.createElement(Filmstrip_1.default, { ...props, filmstripType: constants_2.FILMSTRIP_TYPE.STAGE }))) : null;
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
    const activeParticipants = (0, functions_web_2.getActiveParticipantsIds)(state);
    const reduceHeight = state['features/toolbox'].visible && toolbarButtons?.length;
    const { gridDimensions: dimensions = { columns: undefined,
        rows: undefined }, filmstripHeight, filmstripWidth, thumbnailSize } = state['features/filmstrip'].stageFilmstripDimensions;
    const gridDimensions = dimensions;
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
    const remoteFilmstripHeight = Number(filmstripHeight) - (collapseTileView && filmstripPadding > 0 ? filmstripPadding : 0);
    const _topPanelFilmstrip = (0, functions_web_2.isStageFilmstripTopPanel)(state);
    return {
        _columns: gridDimensions.columns ?? 1,
        _currentLayout: (0, functions_web_1.getCurrentLayout)(state),
        _filmstripHeight: remoteFilmstripHeight,
        _filmstripWidth: filmstripWidth,
        _remoteParticipants: activeParticipants,
        _resizableFilmstrip: (0, functions_web_2.isFilmstripResizable)(state) && _topPanelFilmstrip,
        _rows: gridDimensions.rows ?? 1,
        _thumbnailWidth: thumbnailSize?.width,
        _thumbnailHeight: thumbnailSize?.height,
        _topPanelFilmstrip,
        _verticalViewGrid: false,
        _verticalViewBackground: false
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(StageFilmstrip);
