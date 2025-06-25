"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../video-layout/constants");
const functions_web_1 = require("../../../video-layout/functions.web");
const constants_2 = require("../../constants");
const functions_web_2 = require("../../functions.web");
const Filmstrip_1 = __importDefault(require("./Filmstrip"));
// eslint-disable-next-line no-confusing-arrow
const ScreenshareFilmstrip = (props) => props._currentLayout === constants_1.LAYOUTS.STAGE_FILMSTRIP_VIEW
    && props._remoteParticipants.length === 1 ? (react_1.default.createElement("span", { className: constants_1.LAYOUT_CLASSNAMES[constants_1.LAYOUTS.TILE_VIEW] },
    react_1.default.createElement(Filmstrip_1.default, { ...props, filmstripType: constants_2.FILMSTRIP_TYPE.SCREENSHARE }))) : null;
/**
 * Maps (parts of) the Redux state to the associated {@code Filmstrip}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {any} _ownProps - Components' own props.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, _ownProps) {
    const { screenshareFilmstripDimensions: { filmstripHeight, filmstripWidth, thumbnailSize } } = state['features/filmstrip'];
    const id = (0, functions_web_2.getScreenshareFilmstripParticipantId)(state);
    return {
        _columns: 1,
        _currentLayout: (0, functions_web_1.getCurrentLayout)(state),
        _filmstripHeight: filmstripHeight,
        _filmstripWidth: filmstripWidth,
        _remoteParticipants: id ? [id] : [],
        _resizableFilmstrip: false,
        _rows: 1,
        _thumbnailWidth: thumbnailSize?.width,
        _thumbnailHeight: thumbnailSize?.height,
        _verticalViewGrid: false,
        _verticalViewBackground: false
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(ScreenshareFilmstrip);
