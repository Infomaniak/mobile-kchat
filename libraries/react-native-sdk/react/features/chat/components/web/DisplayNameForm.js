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
const functions_1 = require("../../../base/i18n/functions");
const actions_1 = require("../../../base/settings/actions");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const KeyboardAvoider_1 = __importDefault(require("./KeyboardAvoider"));
/**
 * React Component for requesting the local participant to set a display name.
 *
 * @augments Component
 */
class DisplayNameForm extends react_1.Component {
    /**
     * Initializes a new {@code DisplayNameForm} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            displayName: ''
        };
        // Bind event handlers so they are only bound once for every instance.
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isPollsEnabled, t } = this.props;
        return (react_1.default.createElement("div", { id: 'nickname' },
            react_1.default.createElement("form", { onSubmit: this._onSubmit },
                react_1.default.createElement(Input_1.default, { accessibilityLabel: t('chat.nickname.title'), autoFocus: true, id: 'nickinput', label: t(isPollsEnabled ? 'chat.nickname.titleWithPolls' : 'chat.nickname.title'), name: 'name', onChange: this._onDisplayNameChange, placeholder: t('chat.nickname.popover'), type: 'text', value: this.state.displayName })),
            react_1.default.createElement("br", null),
            react_1.default.createElement(Button_1.default, { accessibilityLabel: t('chat.enter'), disabled: !this.state.displayName.trim(), fullWidth: true, label: t('chat.enter'), onClick: this._onSubmit }),
            react_1.default.createElement(KeyboardAvoider_1.default, null)));
    }
    /**
     * Dispatches an action update the entered display name.
     *
     * @param {string} value - Keyboard event.
     * @private
     * @returns {void}
     */
    _onDisplayNameChange(value) {
        this.setState({ displayName: value });
    }
    /**
     * Dispatches an action to hit enter to change your display name.
     *
     * @param {event} event - Keyboard event
     * that will check if user has pushed the enter key.
     * @private
     * @returns {void}
     */
    _onSubmit(event) {
        event?.preventDefault && event.preventDefault();
        // Store display name in settings
        this.props.dispatch((0, actions_1.updateSettings)({
            displayName: this.state.displayName
        }));
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            this._onSubmit(e);
        }
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(DisplayNameForm));
