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
const Text_1 = __importDefault(require("./Text"));
/**
 * Implements a (hyper)link to a URL in the fashion of the HTML anchor element
 * and its href attribute.
 */
class Link extends react_1.Component {
    /**
     * Initializes a new Link instance.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once for every instance.
        this._onPress = this._onPress.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (<Text_1.default onPress={this._onPress} style={this.props.style}>
                {this.props.children}
            </Text_1.default>);
    }
    /**
     * Notifies this instance that Linking failed to open the associated URL.
     *
     * @param {any} reason - The rejection reason.
     * @private
     * @returns {void}
     */
    _onLinkingOpenURLRejected(reason) {
        const onRejected = this.props.onLinkingOpenURLRejected;
        onRejected?.(reason);
    }
    /**
     * Handles press on this Link. Opens the URL associated with this Link.
     *
     * @private
     * @returns {void}
     */
    _onPress() {
        react_native_1.Linking.openURL(this.props.url)
            .catch(reason => this._onLinkingOpenURLRejected(reason));
    }
}
exports.default = Link;
