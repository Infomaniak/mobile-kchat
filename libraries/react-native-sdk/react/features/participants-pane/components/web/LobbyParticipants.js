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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const functions_web_1 = require("../../../base/styles/functions.web");
const actions_web_1 = require("../../../lobby/actions.web");
const functions_1 = require("../../../lobby/functions");
const Drawer_1 = __importDefault(require("../../../toolbox/components/web/Drawer"));
const JitsiPortal_1 = __importDefault(require("../../../toolbox/components/web/JitsiPortal"));
const functions_web_2 = require("../../../toolbox/functions.web");
const hooks_1 = require("../../hooks");
const LobbyParticipantItems_1 = __importDefault(require("./LobbyParticipantItems"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        drawerActions: {
            listStyleType: 'none',
            margin: 0,
            padding: 0
        },
        drawerItem: {
            alignItems: 'center',
            color: theme.palette.text01,
            display: 'flex',
            padding: '12px 16px',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge),
            '&:first-child': {
                marginTop: '15px'
            },
            '&:hover': {
                cursor: 'pointer',
                background: theme.palette.action02
            }
        },
        icon: {
            marginRight: 16
        },
        headingContainer: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between'
        },
        heading: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            color: theme.palette.text02
        },
        link: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            color: theme.palette.link01,
            cursor: 'pointer'
        }
    };
});
/**
 * Component used to display a list of participants waiting in the lobby.
 *
 * @returns {ReactNode}
 */
function LobbyParticipants() {
    const lobbyEnabled = (0, react_redux_1.useSelector)(functions_1.getLobbyEnabled);
    const participants = (0, react_redux_1.useSelector)(functions_1.getKnockingParticipants);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    const admitAll = (0, react_1.useCallback)(() => {
        dispatch((0, actions_web_1.admitMultiple)(participants));
    }, [dispatch, participants]);
    const overflowDrawer = (0, react_redux_1.useSelector)(functions_web_2.showOverflowDrawer);
    const [drawerParticipant, closeDrawer, openDrawerForParticipant] = (0, hooks_1.useParticipantDrawer)();
    const [admit, reject] = (0, hooks_1.useLobbyActions)(drawerParticipant, closeDrawer);
    if (!lobbyEnabled || !participants.length) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: classes.headingContainer },
            react_1.default.createElement("div", { className: classes.heading }, t('participantsPane.headings.lobby', { count: participants.length })),
            participants.length > 1
                && react_1.default.createElement("div", { className: classes.link, onClick: admitAll }, t('participantsPane.actions.admitAll'))),
        react_1.default.createElement(LobbyParticipantItems_1.default, { openDrawerForParticipant: openDrawerForParticipant, overflowDrawer: overflowDrawer, participants: participants }),
        react_1.default.createElement(JitsiPortal_1.default, null,
            react_1.default.createElement(Drawer_1.default, { isOpen: Boolean(drawerParticipant && overflowDrawer), onClose: closeDrawer },
                react_1.default.createElement("ul", { className: classes.drawerActions },
                    react_1.default.createElement("li", { className: classes.drawerItem },
                        react_1.default.createElement(Avatar_1.default, { className: classes.icon, participantId: drawerParticipant?.participantID, size: 20 }),
                        react_1.default.createElement("span", null, drawerParticipant?.displayName)),
                    react_1.default.createElement("li", { className: classes.drawerItem, onClick: admit },
                        react_1.default.createElement(Icon_1.default, { className: classes.icon, size: 20, src: svg_1.IconCheck }),
                        react_1.default.createElement("span", null, t('participantsPane.actions.admit'))),
                    react_1.default.createElement("li", { className: classes.drawerItem, onClick: reject },
                        react_1.default.createElement(Icon_1.default, { className: classes.icon, size: 20, src: svg_1.IconCloseLarge }),
                        react_1.default.createElement("span", null, t('participantsPane.actions.reject'))))))));
}
exports.default = LobbyParticipants;
