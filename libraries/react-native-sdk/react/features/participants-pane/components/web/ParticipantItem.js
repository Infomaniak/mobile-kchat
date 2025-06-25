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
const mui_1 = require("tss-react/mui");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const functions_1 = require("../../../base/i18n/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const ListItem_1 = __importDefault(require("../../../base/ui/components/web/ListItem"));
const constants_1 = require("../../constants");
const RaisedHandIndicator_1 = require("./RaisedHandIndicator");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        nameContainer: {
            display: 'flex',
            flex: 1,
            overflow: 'hidden'
        },
        name: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        moderatorLabel: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            color: theme.palette.text03
        },
        avatar: {
            marginRight: theme.spacing(3)
        }
    };
});
/**
 * A component representing a participant entry in ParticipantPane and Lobby.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactNode}
 */
function ParticipantItem({ actionsTrigger = constants_1.ACTION_TRIGGER.HOVER, audioMediaState = constants_1.MEDIA_STATE.NONE, children, disableModeratorIndicator, displayName, isHighlighted, isModerator, local, onLeave, openDrawerForParticipant, overflowDrawer, participantID, raisedHand, t, videoMediaState = constants_1.MEDIA_STATE.NONE, youText }) {
    const onClick = (0, react_1.useCallback)(() => openDrawerForParticipant?.({
        participantID,
        displayName
    }), []);
    const { classes } = useStyles();
    const icon = (react_1.default.createElement(Avatar_1.default, { className: classes.avatar, displayName: displayName, participantId: participantID, size: 32 }));
    const text = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: classes.nameContainer },
            react_1.default.createElement("div", { className: classes.name }, displayName),
            local ? react_1.default.createElement("span", null,
                "\u00A0(",
                youText,
                ")") : null),
        isModerator && !disableModeratorIndicator && react_1.default.createElement("div", { className: classes.moderatorLabel }, t('videothumbnail.moderator'))));
    const indicators = (react_1.default.createElement(react_1.default.Fragment, null,
        raisedHand && react_1.default.createElement(RaisedHandIndicator_1.RaisedHandIndicator, null),
        constants_1.VideoStateIcons[videoMediaState],
        constants_1.AudioStateIcons[audioMediaState]));
    return (react_1.default.createElement(ListItem_1.default, { actions: children, hideActions: local, icon: icon, id: `participant-item-${participantID}`, indicators: indicators, isHighlighted: isHighlighted, onClick: !local && overflowDrawer ? onClick : undefined, onMouseLeave: onLeave, textChildren: text, trigger: actionsTrigger }));
}
exports.default = (0, functions_1.translate)(ParticipantItem);
