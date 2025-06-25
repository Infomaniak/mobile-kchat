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
exports.abstractMapStateToProps = void 0;
// @ts-expect-error
const random_1 = require("@jitsi/js-utils/random");
const react_1 = __importStar(require("react"));
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_web_1 = require("../../../app/actions.web");
const functions_web_1 = require("../../../base/lib-jitsi-meet/functions.web");
const logger_1 = __importDefault(require("../../logger"));
const ReloadButton_1 = __importDefault(require("./ReloadButton"));
/**
 * Implements an abstract React {@link Component} for the page reload overlays.
 *
 * FIXME: This is not really an abstract class as some components and functions are very web specific.
 */
class AbstractPageReloadOverlay extends react_1.Component {
    /**
     * Determines whether this overlay needs to be rendered (according to a
     * specific redux state). Called by {@link OverlayContainer}.
     *
     * @param {Object} state - The redux state.
     * @returns {boolean} - If this overlay needs to be rendered, {@code true};
     * {@code false}, otherwise.
     */
    static needsRender(state) {
        const { error: conferenceError } = state['features/base/conference'];
        const { error: configError } = state['features/base/config'];
        const { error: connectionError } = state['features/base/connection'];
        const jitsiConnectionError = connectionError && (0, functions_web_1.isFatalJitsiConnectionError)(connectionError);
        const jitsiConferenceError = conferenceError && (0, functions_web_1.isFatalJitsiConferenceError)(conferenceError);
        return jitsiConnectionError || jitsiConferenceError || configError;
    }
    /**
     * Initializes a new AbstractPageReloadOverlay instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     * @public
     */
    constructor(props) {
        super(props);
        /**
         * How long the overlay dialog will be displayed, before the conference
         * will be reloaded.
         *
         * @type {number}
         */
        const timeoutSeconds = 10 + (0, random_1.randomInt)(0, 20);
        let message, title;
        if (this.props.isNetworkFailure) {
            title = 'dialog.conferenceDisconnectTitle';
            message = 'dialog.conferenceDisconnectMsg';
        }
        else {
            title = 'dialog.conferenceReloadTitle';
            message = 'dialog.conferenceReloadMsg';
        }
        this.state = {
            message,
            timeLeft: timeoutSeconds,
            timeoutSeconds,
            title
        };
    }
    /**
     * React Component method that executes once component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        // FIXME: We should dispatch action for this.
        if (typeof APP !== 'undefined' && APP.conference?._room) {
            APP.conference._room.sendApplicationLog(JSON.stringify({
                name: 'page.reload',
                label: this.props.reason
            }));
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPageReloadScheduledEvent)(this.props.reason ?? '', this.state.timeoutSeconds, this.props.details));
        logger_1.default.info(`The conference will be reloaded after ${this.state.timeoutSeconds} seconds.`);
        this._interval
            = window.setInterval(() => {
                if (this.state.timeLeft === 0) {
                    if (this._interval) {
                        clearInterval(this._interval);
                        this._interval = undefined;
                    }
                    this.props.dispatch((0, actions_web_1.reloadNow)());
                }
                else {
                    this.setState(prevState => {
                        return {
                            timeLeft: prevState.timeLeft - 1
                        };
                    });
                }
            }, 1000);
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
     * Renders the button for reloading the page if necessary.
     *
     * @protected
     * @returns {ReactElement|null}
     */
    _renderButton() {
        if (this.props.isNetworkFailure) {
            return (react_1.default.createElement(ReloadButton_1.default, { textKey: 'dialog.rejoinNow' }));
        }
        return null;
    }
    /**
     * Renders the progress bar.
     *
     * @protected
     * @returns {ReactElement}
     */
    _renderProgressBar() {
        const { timeLeft, timeoutSeconds } = this.state;
        const timeRemaining = timeoutSeconds - timeLeft;
        const percentageComplete = Math.floor((timeRemaining / timeoutSeconds) * 100);
        return (react_1.default.createElement("div", { className: 'progress-indicator', id: 'reloadProgressBar' },
            react_1.default.createElement("div", { className: 'progress-indicator-fill', style: { width: `${percentageComplete}%` } })));
    }
}
exports.default = AbstractPageReloadOverlay;
/**
 * Maps (parts of) the redux state to the associated component's props.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {{
 *     details: Object,
 *     error: ?Error,
 *     isNetworkFailure: boolean,
 *     reason: string
 * }}
 */
function abstractMapStateToProps(state) {
    const { error: configError } = state['features/base/config'];
    const { error: connectionError } = state['features/base/connection'];
    const { fatalError } = state['features/overlay'];
    let reason = fatalError && (fatalError.message || fatalError.name);
    if (!reason) {
        const { error: conferenceError } = state['features/base/conference'];
        if (conferenceError) {
            reason = `error.conference.${conferenceError.name}`;
        }
        else if (configError) {
            reason = `error.config.${configError.name}`;
        }
        else if (connectionError) {
            reason = `error.connection.${connectionError.name}`;
        }
        else {
            logger_1.default.error('No reload reason defined!');
        }
    }
    return {
        details: fatalError?.details,
        error: fatalError,
        isNetworkFailure: fatalError === configError || fatalError === connectionError,
        reason
    };
}
exports.abstractMapStateToProps = abstractMapStateToProps;
