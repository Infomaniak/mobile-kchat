"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const LobbyParticipantItem_1 = require("./LobbyParticipantItem");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            margin: `${theme.spacing(3)} 0`
        }
    };
});
/**
 * Component used to display a list of knocking participants.
 *
 * @param {Object} props - The props of the component.
 * @returns {ReactNode}
 */
function LobbyParticipantItems({ openDrawerForParticipant, overflowDrawer, participants }) {
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.container, id: 'lobby-list' }, participants.map(p => (react_1.default.createElement(LobbyParticipantItem_1.LobbyParticipantItem, { key: p.id, openDrawerForParticipant: openDrawerForParticipant, overflowDrawer: overflowDrawer, participant: p })))));
}
// Memoize the component in order to avoid rerender on drawer open/close.
exports.default = react_1.default.memo(LobbyParticipantItems);
