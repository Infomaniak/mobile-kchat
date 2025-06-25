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
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        raisedHandIndicator: {
            backgroundColor: theme.palette.warning02,
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
const RaisedHandIndicator = ({ iconSize, participantId, tooltipPosition }) => {
    const participant = (0, react_redux_1.useSelector)((state) => (0, functions_1.getParticipantById)(state, participantId));
    const _raisedHand = (0, functions_1.hasRaisedHand)(participant);
    const { classes: styles, theme } = useStyles();
    if (!_raisedHand) {
        return null;
    }
    return (react_1.default.createElement("div", { className: styles.raisedHandIndicator },
        react_1.default.createElement(BaseIndicator_1.default, { icon: svg_1.IconRaiseHand, iconColor: theme.palette.uiBackground, iconSize: `${iconSize}px`, tooltipKey: 'raisedHand', tooltipPosition: tooltipPosition })));
};
exports.default = RaisedHandIndicator;
