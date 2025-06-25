"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_any_1 = require("../../../base/config/functions.any");
const functions_1 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const functions_2 = require("../../../large-video/functions");
const functions_web_2 = require("../../../toolbox/functions.web");
const functions_web_3 = require("../../../video-layout/functions.web");
const DisplayNameBadge_1 = __importDefault(require("./DisplayNameBadge"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        badgeContainer: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge),
            alignItems: 'center',
            display: 'inline-flex',
            justifyContent: 'center',
            marginBottom: theme.spacing(7),
            transition: 'margin-bottom 0.3s',
            pointerEvents: 'none',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1
        },
        containerElevated: {
            marginBottom: theme.spacing(12)
        }
    };
});
/**
 * Component that renders the dominant speaker's name as a badge above the toolbar in stage view.
 *
 * @returns {ReactElement|null}
 */
const StageParticipantNameLabel = () => {
    const { classes, cx } = useStyles();
    const largeVideoParticipant = (0, react_redux_1.useSelector)(functions_2.getLargeVideoParticipant);
    const selectedId = largeVideoParticipant?.id;
    const nameToDisplay = (0, react_redux_1.useSelector)((state) => (0, functions_1.getParticipantDisplayName)(state, selectedId ?? ''));
    const localParticipant = (0, react_redux_1.useSelector)(functions_1.getLocalParticipant);
    const localId = localParticipant?.id;
    const isTileView = (0, react_redux_1.useSelector)(functions_web_3.isLayoutTileView);
    const toolboxVisible = (0, react_redux_1.useSelector)(functions_web_2.isToolboxVisible);
    const showDisplayName = (0, react_redux_1.useSelector)(functions_any_1.isDisplayNameVisible);
    if (showDisplayName
        && nameToDisplay
        && selectedId !== localId
        && !isTileView
        && !(0, functions_1.isWhiteboardParticipant)(largeVideoParticipant)) {
        return (react_1.default.createElement("div", { className: cx('stage-participant-label', classes.badgeContainer, toolboxVisible && classes.containerElevated) },
            react_1.default.createElement(DisplayNameBadge_1.default, { name: nameToDisplay })));
    }
    return null;
};
exports.default = StageParticipantNameLabel;
