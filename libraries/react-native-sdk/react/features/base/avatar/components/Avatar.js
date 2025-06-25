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
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = exports.DEFAULT_SIZE = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const svg_1 = require("../../icons/svg");
const functions_1 = require("../../participants/functions");
const functions_2 = require("../functions");
const _1 = require("./");
exports.DEFAULT_SIZE = 65;
/**
 * Implements a class to render avatars in the app.
 */
class Avatar extends react_1.PureComponent {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        const { _corsAvatarURLs, url, useCORS } = props;
        this.state = {
            avatarFailed: false,
            isUsingCORS: Boolean(useCORS) || Boolean(url && (0, functions_2.isCORSAvatarURL)(url, _corsAvatarURLs))
        };
        this._onAvatarLoadError = this._onAvatarLoadError.bind(this);
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        const { _corsAvatarURLs, url } = this.props;
        if (prevProps.url !== url) {
            // URI changed, so we need to try to fetch it again.
            // Eslint doesn't like this statement, but based on the React doc, it's safe if it's
            // wrapped in a condition: https://reactjs.org/docs/react-component.html#componentdidupdate
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                avatarFailed: false,
                isUsingCORS: Boolean(this.props.useCORS) || Boolean(url && (0, functions_2.isCORSAvatarURL)(url, _corsAvatarURLs))
            });
        }
    }
    /**
     * Implements {@code Componenr#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _customAvatarBackgrounds, _initialsBase, _loadableAvatarUrl, _loadableAvatarUrlUseCORS, className, colorBase, dynamicColor, id, size, status, testId, url } = this.props;
        const { avatarFailed, isUsingCORS } = this.state;
        const avatarProps = {
            className,
            color: undefined,
            id,
            initials: undefined,
            onAvatarLoadError: undefined,
            onAvatarLoadErrorParams: undefined,
            size,
            status,
            testId,
            url: undefined,
            useCORS: isUsingCORS
        };
        // _loadableAvatarUrl is validated that it can be loaded, but uri (if present) is not, so
        // we still need to do a check for that. And an explicitly provided URI is higher priority than
        // an avatar URL anyhow.
        const useReduxLoadableAvatarURL = avatarFailed || !url;
        const effectiveURL = useReduxLoadableAvatarURL ? _loadableAvatarUrl : url;
        if (effectiveURL) {
            avatarProps.onAvatarLoadError = this._onAvatarLoadError;
            if (useReduxLoadableAvatarURL) {
                avatarProps.onAvatarLoadErrorParams = { dontRetry: true };
                avatarProps.useCORS = _loadableAvatarUrlUseCORS;
            }
            avatarProps.url = effectiveURL;
        }
        const initials = (0, functions_2.getInitials)(_initialsBase);
        if (initials) {
            if (dynamicColor) {
                avatarProps.color = (0, functions_2.getAvatarColor)(colorBase || _initialsBase, _customAvatarBackgrounds ?? []);
            }
            avatarProps.initials = initials;
        }
        if (navigator.product !== 'ReactNative') {
            avatarProps.iconUser = svg_1.IconUser;
        }
        return (react_1.default.createElement(_1.StatelessAvatar, { ...avatarProps }));
    }
    /**
     * Callback to handle the error while loading of the avatar URI.
     *
     * @param {Object} params - An object with parameters.
     * @param {boolean} params.dontRetry - If false we will retry to load the Avatar with different CORS mode.
     * @returns {void}
     */
    _onAvatarLoadError(params = {}) {
        const { dontRetry = false } = params;
        if (Boolean(this.props.useCORS) === this.state.isUsingCORS && !dontRetry) {
            // try different mode of loading the avatar.
            this.setState({
                isUsingCORS: !this.state.isUsingCORS
            });
        }
        else {
            // we already have tried loading the avatar with and without CORS and it failed.
            this.setState({
                avatarFailed: true
            });
        }
    }
}
/**
 * Default values for {@code Avatar} component's properties.
 *
 * @static
 */
Avatar.defaultProps = {
    dynamicColor: true
};
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { colorBase, displayName, participantId } = ownProps;
    const _participant = participantId ? (0, functions_1.getParticipantById)(state, participantId) : undefined;
    const _initialsBase = _participant?.name ?? displayName;
    const { corsAvatarURLs } = state['features/base/config'];
    return {
        _customAvatarBackgrounds: state['features/dynamic-branding'].avatarBackgrounds,
        _corsAvatarURLs: corsAvatarURLs,
        _initialsBase,
        _loadableAvatarUrl: _participant?.loadableAvatarUrl,
        _loadableAvatarUrlUseCORS: _participant?.loadableAvatarUrlUseCORS,
        colorBase
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(Avatar);
