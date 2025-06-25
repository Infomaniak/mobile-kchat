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
const actions_1 = require("../../actions");
const functions_1 = require("../../functions");
const NotificationsTransition_1 = __importDefault(require("../NotificationsTransition"));
const Notification_1 = __importDefault(require("./Notification"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        container: {
            position: 'absolute',
            left: '16px',
            bottom: '84px',
            width: '320px',
            maxWidth: '100%',
            zIndex: 600
        },
        containerPortal: {
            width: '100%',
            maxWidth: 'calc(100% - 32px)'
        }
    };
});
const NotificationsContainer = ({ _iAmSipGateway, _notifications, dispatch, portal }) => {
    const { classes, cx } = useStyles();
    const _onDismissed = (0, react_1.useCallback)((uid) => {
        dispatch((0, actions_1.hideNotification)(uid));
    }, []);
    if (_iAmSipGateway) {
        return null;
    }
    return (react_1.default.createElement("div", { className: cx(classes.container, {
            [classes.containerPortal]: portal
        }), id: 'notifications-container' },
        react_1.default.createElement(NotificationsTransition_1.default, null, _notifications.map(({ props, uid }) => (react_1.default.createElement(Notification_1.default, { ...props, key: uid, onDismissed: _onDismissed, uid: uid }))) || null)));
};
/**
 * Maps (parts of) the Redux state to the associated props for this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { notifications } = state['features/notifications'];
    const { iAmSipGateway } = state['features/base/config'];
    const { isOpen: isChatOpen } = state['features/chat'];
    const _visible = (0, functions_1.areThereNotifications)(state);
    return {
        _iAmSipGateway: Boolean(iAmSipGateway),
        _isChatOpen: isChatOpen,
        _notifications: _visible ? notifications : []
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(NotificationsContainer);
