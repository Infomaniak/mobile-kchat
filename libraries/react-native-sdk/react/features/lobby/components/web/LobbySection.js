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
const functions_any_1 = require("../../../base/config/functions.any");
const functions_1 = require("../../../base/i18n/functions");
const functions_2 = require("../../../base/participants/functions");
const Switch_1 = __importDefault(require("../../../base/ui/components/web/Switch"));
const functions_3 = require("../../../breakout-rooms/functions");
const actions_1 = require("../../actions");
/**
 * Implements a security feature section to control lobby mode.
 */
class LobbySection extends react_1.PureComponent {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            lobbyEnabled: props._lobbyEnabled
        };
        this._onToggleLobby = this._onToggleLobby.bind(this);
    }
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props, state) {
        if (props._lobbyEnabled !== state.lobbyEnabled) {
            return {
                lobbyEnabled: props._lobbyEnabled
            };
        }
        return null;
    }
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _visible, t } = this.props;
        if (!_visible) {
            return null;
        }
        return (react_1.default.createElement("div", { id: 'lobby-section' },
            react_1.default.createElement("p", { className: 'description', role: 'banner' }, t('lobby.enableDialogText')),
            react_1.default.createElement("div", { className: 'control-row' },
                react_1.default.createElement("label", { htmlFor: 'lobby-section-switch' }, t('lobby.toggleLabel')),
                react_1.default.createElement(Switch_1.default, { checked: this.state.lobbyEnabled, id: 'lobby-section-switch', onChange: this._onToggleLobby }))));
    }
    /**
     * Callback to be invoked when the user toggles the lobby feature on or off.
     *
     * @returns {void}
     */
    _onToggleLobby() {
        const newValue = !this.state.lobbyEnabled;
        this.setState({
            lobbyEnabled: newValue
        });
        this.props.dispatch((0, actions_1.toggleLobbyMode)(newValue));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function mapStateToProps(state) {
    const { conference } = state['features/base/conference'];
    const { hideLobbyButton } = (0, functions_any_1.getSecurityUiConfig)(state);
    return {
        _lobbyEnabled: state['features/lobby'].lobbyEnabled,
        _visible: conference?.isLobbySupported() && (0, functions_2.isLocalParticipantModerator)(state)
            && !hideLobbyButton && !(0, functions_3.isInBreakoutRoom)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(LobbySection));
