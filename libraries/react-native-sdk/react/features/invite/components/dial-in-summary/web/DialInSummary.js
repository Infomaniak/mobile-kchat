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
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importStar(require("react"));
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../../base/i18n/functions");
const functions_web_1 = require("../../../../base/styles/functions.web");
const _utils_1 = require("../../../_utils");
const ConferenceID_1 = __importDefault(require("./ConferenceID"));
const NumbersList_1 = __importDefault(require("./NumbersList"));
const styles = (theme) => {
    return {
        hasNumbers: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            background: '#1E1E1E',
            color: theme.palette.text01
        },
        scrollable: {
            height: '100dvh',
            overflowY: 'scroll'
        },
        roomName: {
            margin: '40px auto 8px',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading5)
        }
    };
};
/**
 * Displays a page listing numbers for dialing into a conference and pin to
 * the a specific conference.
 *
 * @augments Component
 */
class DialInSummary extends react_1.Component {
    /**
     * Initializes a new {@code DialInSummary} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            conferenceID: null,
            error: '',
            loading: true,
            numbers: null,
            numbersEnabled: null
        };
        // Bind event handlers so they are only bound once for every instance.
        this._onGetNumbersSuccess = this._onGetNumbersSuccess.bind(this);
        this._onGetConferenceIDSuccess
            = this._onGetConferenceIDSuccess.bind(this);
        this._setErrorMessage = this._setErrorMessage.bind(this);
    }
    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const getNumbers = this._getNumbers()
            .then(this._onGetNumbersSuccess)
            .catch(this._setErrorMessage);
        const getID = this._getConferenceID()
            .then(this._onGetConferenceIDSuccess)
            .catch(this._setErrorMessage);
        Promise.all([getNumbers, getID])
            .then(() => {
            this.setState({ loading: false });
        });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let className = '';
        let contents;
        const { conferenceID, error, loading, numbersEnabled } = this.state;
        const { hideError, showTitle, room, clickableNumbers, scrollable, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        if (loading) {
            contents = '';
        }
        else if (numbersEnabled === false) {
            contents = t('info.dialInNotSupported');
        }
        else if (error) {
            if (!hideError) {
                contents = error;
            }
        }
        else {
            className = (0, clsx_1.default)(classes.hasNumbers, scrollable && classes.scrollable);
            contents = [
                conferenceID
                    ? react_1.default.createElement(react_1.default.Fragment, null,
                        showTitle && react_1.default.createElement("div", { className: classes.roomName }, room),
                        react_1.default.createElement(ConferenceID_1.default, { conferenceID: conferenceID, conferenceName: room, key: 'conferenceID' })) : null,
                react_1.default.createElement(NumbersList_1.default, { clickableNumbers: clickableNumbers, conferenceID: conferenceID, key: 'numbers', numbers: this.state.numbers })
            ];
        }
        return (react_1.default.createElement("div", { className: className }, contents));
    }
    /**
     * Creates an AJAX request for the conference ID.
     *
     * @private
     * @returns {Promise}
     */
    _getConferenceID() {
        const { room } = this.props;
        const { dialInConfCodeUrl, hosts } = config;
        const mucURL = hosts?.muc;
        if (!dialInConfCodeUrl || !mucURL || !room) {
            return Promise.resolve();
        }
        let url = this.props.url || {};
        if (typeof url === 'string' || url instanceof String) {
            // @ts-ignore
            url = new URL(url);
        }
        return (0, _utils_1.getDialInConferenceID)(dialInConfCodeUrl, room, mucURL, url)
            .catch(() => Promise.reject(this.props.t('info.genericError')));
    }
    /**
     * Creates an AJAX request for dial-in numbers.
     *
     * @private
     * @returns {Promise}
     */
    _getNumbers() {
        const { room } = this.props;
        const { dialInNumbersUrl, hosts } = config;
        const mucURL = hosts?.muc;
        if (!dialInNumbersUrl) {
            return Promise.reject(this.props.t('info.dialInNotSupported'));
        }
        return (0, _utils_1.getDialInNumbers)(dialInNumbersUrl, room, mucURL ?? '')
            .catch(() => Promise.reject(this.props.t('info.genericError')));
    }
    /**
     * Callback invoked when fetching the conference ID succeeds.
     *
     * @param {Object} response - The response from fetching the conference ID.
     * @private
     * @returns {void}
     */
    _onGetConferenceIDSuccess(response = { conference: undefined,
        id: undefined }) {
        const { conference, id } = response;
        if (!conference || !id) {
            return;
        }
        this.setState({ conferenceID: id });
    }
    /**
     * Callback invoked when fetching dial-in numbers succeeds. Sets the
     * internal to show the numbers.
     *
     * @param {Array|Object} response - The response from fetching
     * dial-in numbers.
     * @param {Array|Object} response.numbers - The dial-in numbers.
     * @param {boolean} response.numbersEnabled - Whether or not dial-in is
     * enabled, old syntax that is deprecated.
     * @private
     * @returns {void}
     */
    _onGetNumbersSuccess(response) {
        this.setState({
            numbersEnabled: Boolean(Array.isArray(response)
                ? response.length > 0 : response.numbersEnabled),
            numbers: response
        });
    }
    /**
     * Sets an error message to display on the page instead of content.
     *
     * @param {string} error - The error message to display.
     * @private
     * @returns {void}
     */
    _setErrorMessage(error) {
        this.setState({
            error
        });
    }
}
exports.default = (0, functions_1.translate)((0, mui_1.withStyles)(DialInSummary, styles));
