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
// We need to reference these files directly to avoid loading things that are not available
// in this environment (e.g. JitsiMeetJS or interfaceConfig)
const StatelessAvatar_1 = __importDefault(require("../base/avatar/components/web/StatelessAvatar"));
const functions_1 = require("../base/avatar/functions");
const constants_1 = require("../base/icons/svg/constants");
const Toolbar_1 = __importDefault(require("./Toolbar"));
const { api } = window.alwaysOnTop;
/**
 * The timeout in ms for hiding the toolbar.
 */
const TOOLBAR_TIMEOUT = 4000;
/**
 * Represents the always on top page.
 *
 * @class AlwaysOnTop
 * @augments Component
 */
class AlwaysOnTop extends react_1.Component {
    /**
     * Initializes a new {@code AlwaysOnTop} instance.
     *
     * @param {*} props - The read-only properties with which the new instance
     * is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            avatarURL: '',
            customAvatarBackgrounds: [],
            displayName: '',
            formattedDisplayName: '',
            isVideoDisplayed: true,
            userID: '',
            visible: true
        };
        // Bind event handlers so they are only bound once per instance.
        this._avatarChangedListener = this._avatarChangedListener.bind(this);
        this._displayNameChangedListener
            = this._displayNameChangedListener.bind(this);
        this._videoChangedListener
            = this._videoChangedListener.bind(this);
        this._mouseMove = this._mouseMove.bind(this);
        this._onMouseOut = this._onMouseOut.bind(this);
        this._onMouseOver = this._onMouseOver.bind(this);
    }
    /**
     * Handles avatar changed api events.
     *
     * @returns {void}
     */
    _avatarChangedListener({ avatarURL, id }) {
        if (api._getOnStageParticipant() === id
            && avatarURL !== this.state.avatarURL) {
            this.setState({ avatarURL });
        }
    }
    /**
     * Handles display name changed api events.
     *
     * @returns {void}
     */
    _displayNameChangedListener({ displayname, formattedDisplayName, id }) {
        if (api._getOnStageParticipant() === id
            && (formattedDisplayName !== this.state.formattedDisplayName
                || displayname !== this.state.displayName)) {
            // I think the API has a typo using lowercase n for the displayname
            this.setState({
                displayName: displayname,
                formattedDisplayName
            });
        }
    }
    /**
     * Hides the toolbar after a timeout.
     *
     * @returns {void}
     */
    _hideToolbarAfterTimeout() {
        setTimeout(() => {
            if (this._hovered) {
                this._hideToolbarAfterTimeout();
            }
            else {
                this.setState({ visible: false });
            }
        }, TOOLBAR_TIMEOUT);
    }
    /**
     * Handles large video changed api events.
     *
     * @returns {void}
     */
    _videoChangedListener() {
        const userID = api._getOnStageParticipant();
        const avatarURL = api.getAvatarURL(userID);
        const displayName = api.getDisplayName(userID);
        const formattedDisplayName = api._getFormattedDisplayName(userID);
        const isVideoDisplayed = Boolean(api._getPrejoinVideo?.() || api._getLargeVideo());
        this.setState({
            avatarURL,
            displayName,
            formattedDisplayName,
            isVideoDisplayed,
            userID
        });
    }
    /**
     * Handles mouse move events.
     *
     * @returns {void}
     */
    _mouseMove() {
        this.state.visible || this.setState({ visible: true });
    }
    /**
     * Toolbar mouse out handler.
     *
     * @returns {void}
     */
    _onMouseOut() {
        this._hovered = false;
    }
    /**
     * Toolbar mouse over handler.
     *
     * @returns {void}
     */
    _onMouseOver() {
        this._hovered = true;
    }
    /**
     * Renders display name and avatar for the on stage participant.
     *
     * @returns {ReactElement}
     */
    _renderVideoNotAvailableScreen() {
        const { avatarURL, customAvatarBackgrounds, displayName, formattedDisplayName, isVideoDisplayed } = this.state;
        if (isVideoDisplayed) {
            return null;
        }
        return (react_1.default.createElement("div", { id: 'videoNotAvailableScreen' },
            react_1.default.createElement("div", { id: 'avatarContainer' },
                react_1.default.createElement(StatelessAvatar_1.default, { color: (0, functions_1.getAvatarColor)(displayName, customAvatarBackgrounds), iconUser: constants_1.DEFAULT_ICON.IconUser, id: 'avatar', initials: (0, functions_1.getInitials)(displayName), url: avatarURL }),
                ")"),
            react_1.default.createElement("div", { className: 'displayname', id: 'displayname' }, formattedDisplayName)));
    }
    /**
     * Sets mouse move listener and initial toolbar timeout.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        api.on('avatarChanged', this._avatarChangedListener);
        api.on('displayNameChange', this._displayNameChangedListener);
        api.on('largeVideoChanged', this._videoChangedListener);
        api.on('prejoinVideoChanged', this._videoChangedListener);
        api.on('videoConferenceJoined', this._videoChangedListener);
        this._videoChangedListener();
        window.addEventListener('mousemove', this._mouseMove);
        this._hideToolbarAfterTimeout();
        api.getCustomAvatarBackgrounds()
            .then((res) => this.setState({
            customAvatarBackgrounds: res.avatarBackgrounds || []
        }))
            .catch(console.error);
    }
    /**
     * Sets a timeout to hide the toolbar when the toolbar is shown.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(_prevProps, prevState) {
        if (!prevState.visible && this.state.visible) {
            this._hideToolbarAfterTimeout();
        }
    }
    /**
     * Removes all listeners.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        api.removeListener('avatarChanged', this._avatarChangedListener);
        api.removeListener('displayNameChange', this._displayNameChangedListener);
        api.removeListener('largeVideoChanged', this._videoChangedListener);
        api.removeListener('prejoinVideoChanged', this._videoChangedListener);
        api.removeListener('videoConferenceJoined', this._videoChangedListener);
        window.removeEventListener('mousemove', this._mouseMove);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement("div", { id: 'alwaysOnTop' },
            react_1.default.createElement(Toolbar_1.default, { className: this.state.visible ? 'fadeIn' : 'fadeOut', onMouseOut: this._onMouseOut, onMouseOver: this._onMouseOver }),
            this._renderVideoNotAvailableScreen()));
    }
}
exports.default = AlwaysOnTop;
