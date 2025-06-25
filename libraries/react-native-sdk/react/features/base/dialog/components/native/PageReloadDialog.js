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
// @ts-expect-error
const random_1 = require("@jitsi/js-utils/random");
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const actions_native_1 = require("../../../../app/actions.native");
const functions_1 = require("../../../i18n/functions");
const functions_native_1 = require("../../../lib-jitsi-meet/functions.native");
const actions_1 = require("../../actions");
const logger_1 = __importDefault(require("../../logger"));
const ConfirmDialog_1 = __importDefault(require("./ConfirmDialog"));
/**
 * Implements a React Component that is shown before the
 * conference is reloaded.
 * Shows a warning message and counts down towards the re-load.
 */
class PageReloadDialog extends react_1.Component {
    /**
     * Initializes a new PageReloadOverlay instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     * @public
     */
    constructor(props) {
        super(props);
        this._timeoutSeconds = 10 + (0, random_1.randomInt)(0, 20);
        this.state = {
            timeLeft: this._timeoutSeconds
        };
        this._onCancel = this._onCancel.bind(this);
        this._onReloadNow = this._onReloadNow.bind(this);
        this._onReconnecting = this._onReconnecting.bind(this);
    }
    /**
     * React Component method that executes once component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const { timeLeft } = this.state;
        logger_1.default.info(`The conference will be reloaded after ${timeLeft} seconds.`);
        this._interval = setInterval(() => this._onReconnecting(), 1000);
    }
    /**
     * Clears the timer interval.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = undefined;
        }
    }
    /**
     * Handle clicking of the "Cancel" button. It will navigate back to the
     * welcome page.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        const { dispatch } = this.props;
        clearInterval(this._interval ?? 0);
        dispatch((0, actions_native_1.appNavigate)(undefined));
        return true;
    }
    /**
     * Handles automatic reconnection.
     *
     * @private
     * @returns {void}
     */
    _onReconnecting() {
        const { dispatch } = this.props;
        const { timeLeft } = this.state;
        if (timeLeft === 0) {
            if (this._interval) {
                dispatch((0, actions_1.hideDialog)());
                this._onReloadNow();
                this._interval = undefined;
            }
        }
        this.setState({
            timeLeft: timeLeft - 1
        });
    }
    /**
     * Handle clicking on the "Reload Now" button. It will navigate to the same
     * conference URL as before immediately, without waiting for the timer to
     * kick in.
     *
     * @private
     * @returns {boolean}
     */
    _onReloadNow() {
        const { dispatch } = this.props;
        clearInterval(this._interval ?? 0);
        dispatch((0, actions_native_1.reloadNow)());
        return true;
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isNetworkFailure, t } = this.props;
        const { timeLeft } = this.state;
        let message, title;
        if (isNetworkFailure) {
            title = 'dialog.conferenceDisconnectTitle';
            message = 'dialog.conferenceDisconnectMsg';
        }
        else {
            title = 'dialog.conferenceReloadTitle';
            message = 'dialog.conferenceReloadMsg';
        }
        return (<ConfirmDialog_1.default cancelLabel='dialog.Cancel' confirmLabel='dialog.rejoinNow' descriptionKey={`${t(message, { seconds: timeLeft })}`} onCancel={this._onCancel} onSubmit={this._onReloadNow} title={title}/>);
    }
}
/**
 * Maps (parts of) the redux state to the associated component's props.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {{
 *     isNetworkFailure: boolean,
 *     reason: string
 * }}
 */
function mapStateToProps(state) {
    const { error: conferenceError } = state['features/base/conference'];
    const { error: configError } = state['features/base/config'];
    const { error: connectionError } = state['features/base/connection'];
    const { fatalError } = state['features/overlay'];
    const fatalConnectionError = connectionError && (0, functions_native_1.isFatalJitsiConnectionError)(connectionError);
    const fatalConfigError = fatalError === configError;
    const isNetworkFailure = Boolean(fatalConfigError || fatalConnectionError);
    let reason;
    if (conferenceError) {
        reason = `error.conference.${conferenceError.name}`;
    }
    else if (connectionError) {
        reason = `error.conference.${connectionError.name}`;
    }
    else if (configError) {
        reason = `error.config.${configError.name}`;
    }
    else {
        logger_1.default.error('No reload reason defined!');
    }
    return {
        isNetworkFailure,
        reason
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(PageReloadDialog));
