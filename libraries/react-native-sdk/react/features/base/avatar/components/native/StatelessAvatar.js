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
const react_native_1 = require("react-native");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const functions_1 = require("../../functions");
const styles_1 = __importDefault(require("./styles"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DEFAULT_AVATAR = require('../../../../../../images/avatar.png');
/**
 * Implements a stateless avatar component that renders an avatar purely from what gets passed through
 * props.
 */
class StatelessAvatar extends react_1.Component {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onAvatarLoadError = this._onAvatarLoadError.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { initials, size, style, url } = this.props;
        let avatar;
        if ((0, functions_1.isIcon)(url)) {
            avatar = this._renderIconAvatar(url);
        }
        else if (url) {
            avatar = this._renderURLAvatar();
        }
        else if (initials) {
            avatar = this._renderInitialsAvatar();
        }
        else {
            avatar = this._renderDefaultAvatar();
        }
        return (<react_native_1.View>
                <react_native_1.View style={[
                styles_1.default.avatarContainer(size),
                style
            ]}>
                    {avatar}
                </react_native_1.View>
                {this._renderAvatarStatus()}
            </react_native_1.View>);
    }
    /**
     * Renders a badge representing the avatar status.
     *
     * @returns {React$Elementaa}
     */
    _renderAvatarStatus() {
        const { size, status } = this.props;
        if (!status) {
            return null;
        }
        return (<react_native_1.View style={styles_1.default.badgeContainer}>
                <react_native_1.View style={styles_1.default.badge(size, status)}/>
            </react_native_1.View>);
    }
    /**
     * Renders the default avatar.
     *
     * @returns {React$Element<*>}
     */
    _renderDefaultAvatar() {
        const { size } = this.props;
        return (<react_native_1.Image source={DEFAULT_AVATAR} style={[
                styles_1.default.avatarContent(size),
                styles_1.default.staticAvatar
            ]}/>);
    }
    /**
     * Renders the icon avatar.
     *
     * @param {Object} icon - The icon component to render.
     * @returns {React$Element<*>}
     */
    _renderIconAvatar(icon) {
        const { color, size } = this.props;
        return (<react_native_1.View style={[
                styles_1.default.initialsContainer,
                {
                    backgroundColor: color
                }
            ]}>
                <Icon_1.default src={icon} style={styles_1.default.initialsText(size)}/>
            </react_native_1.View>);
    }
    /**
     * Renders the initials-based avatar.
     *
     * @returns {React$Element<*>}
     */
    _renderInitialsAvatar() {
        const { color, initials, size } = this.props;
        return (<react_native_1.View style={[
                styles_1.default.initialsContainer,
                {
                    backgroundColor: color
                }
            ]}>
                <react_native_1.Text style={styles_1.default.initialsText(size)}> {initials} </react_native_1.Text>
            </react_native_1.View>);
    }
    /**
     * Renders the url-based avatar.
     *
     * @returns {React$Element<*>}
     */
    _renderURLAvatar() {
        const { onAvatarLoadError, size, url } = this.props;
        return (<react_native_1.Image defaultSource={DEFAULT_AVATAR} 
        // @ts-ignore
        onError={onAvatarLoadError} resizeMode='cover' source={{ uri: url }} style={styles_1.default.avatarContent(size)}/>);
    }
    /**
     * Handles avatar load errors.
     *
     * @returns {void}
     */
    _onAvatarLoadError() {
        const { onAvatarLoadError, onAvatarLoadErrorParams = {} } = this.props;
        if (onAvatarLoadError) {
            onAvatarLoadError({
                ...onAvatarLoadErrorParams,
                dontRetry: true
            });
        }
    }
}
exports.default = StatelessAvatar;
