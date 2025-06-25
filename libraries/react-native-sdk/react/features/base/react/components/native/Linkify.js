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
const react_linkify_1 = __importDefault(require("react-linkify"));
const react_native_1 = require("react-native");
const functions_1 = require("../../functions");
const Link_1 = __importDefault(require("./Link"));
/**
 * Implements a react native wrapper for the react-linkify component.
 */
class Linkify extends react_1.Component {
    /**
     * Initiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._componentDecorator = this._componentDecorator.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        return (<react_linkify_1.default componentDecorator={this._componentDecorator}>
                <react_native_1.Text selectable={true} style={this.props.style}>
                    {this.props.children}
                </react_native_1.Text>
            </react_linkify_1.default>);
    }
    /**
     * Implements a component decorator for react-linkify.
     *
     * @param {string} decoratedHref - The href src.
     * @param {string} decoratedText - The link text.
     * @param {string} key - The component key.
     * @returns {React$Node}
     */
    _componentDecorator(decoratedHref, decoratedText, key) {
        return (<Link_1.default key={key} style={this.props.linkStyle} url={decoratedHref}>
                {(0, functions_1.formatURLText)(decoratedText)}
            </Link_1.default>);
    }
}
exports.default = Linkify;
