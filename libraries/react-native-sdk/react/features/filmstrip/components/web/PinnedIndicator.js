"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/participants/functions");
const BaseIndicator_1 = __importDefault(require("../../../base/react/components/web/BaseIndicator"));
const functions_web_1 = require("../../functions.web");
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        pinnedIndicator: {
            backgroundColor: 'rgba(0, 0, 0, .7)',
            padding: '4px',
            zIndex: 3,
            display: 'inline-block',
            borderRadius: '4px',
            boxSizing: 'border-box'
        }
    };
});
/**
 * Thumbnail badge showing that the participant would like to speak.
 *
 * @returns {ReactElement}
 */
const PinnedIndicator = ({ iconSize, participantId, tooltipPosition }) => {
    const stageFilmstrip = (0, react_redux_1.useSelector)(functions_web_1.isStageFilmstripAvailable);
    const pinned = (0, react_redux_1.useSelector)((state) => (0, functions_1.getParticipantById)(state, participantId))?.pinned;
    const activePinnedParticipants = (0, react_redux_1.useSelector)(functions_web_1.getPinnedActiveParticipants);
    const isPinned = activePinnedParticipants.find(p => p.participantId === participantId);
    const { classes: styles } = useStyles();
    if ((stageFilmstrip && !isPinned) || (!stageFilmstrip && !pinned)) {
        return null;
    }
    return (react_1.default.createElement("div", { className: styles.pinnedIndicator, id: `pin-indicator-${participantId}` },
        react_1.default.createElement(BaseIndicator_1.default, { icon: svg_1.IconPin, iconSize: `${iconSize}px`, tooltipKey: 'pinnedParticipant', tooltipPosition: tooltipPosition })));
};
exports.default = PinnedIndicator;
