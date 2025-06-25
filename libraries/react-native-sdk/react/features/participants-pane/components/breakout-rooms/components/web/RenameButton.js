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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_1 = require("../../../../../base/dialog/actions");
const svg_1 = require("../../../../../base/icons/svg");
const BreakoutRoomNamePrompt_1 = __importDefault(require("./BreakoutRoomNamePrompt"));
const useStyles = (0, mui_1.makeStyles)()(_theme => {
    return {
        container: {
            position: 'absolute',
            cursor: 'pointer',
            marginTop: 2,
            marginLeft: 5
        }
    };
});
/**
 * Implements the rename button component which is displayed only for renaming a breakout room which is joined by the
 * user.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element}
 */
function RenameButton({ breakoutRoomJid, name }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { classes, cx } = useStyles();
    const onRename = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.openDialog)(BreakoutRoomNamePrompt_1.default, {
            breakoutRoomJid,
            initialRoomName: name
        }));
    }, [dispatch, breakoutRoomJid, name]);
    return (react_1.default.createElement("span", { className: cx('jitsi-icon jitsi-icon-default', classes.container), onClick: onRename },
        react_1.default.createElement(svg_1.IconEdit, { height: 16, key: 1, width: 16 })));
}
exports.default = RenameButton;
