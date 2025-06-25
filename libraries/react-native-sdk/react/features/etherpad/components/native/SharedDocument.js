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
exports._mapStateToProps = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../base/react/components/native/LoadingIndicator"));
const functions_2 = require("../../functions");
const styles_1 = __importStar(require("./styles"));
/**
 * Implements a React native component that renders the shared document window.
 */
class SharedDocument extends react_1.PureComponent {
    /**
     * Instantiates a new instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._renderLoading = this._renderLoading.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { _documentUrl } = this.props;
        return (<JitsiScreen_1.default style={styles_1.default.sharedDocContainer}>
                <react_native_webview_1.WebView hideKeyboardAccessoryView={true} incognito={true} renderLoading={this._renderLoading} source={{ uri: _documentUrl ?? '' }} startInLoadingState={true} style={styles_1.default.sharedDoc} webviewDebuggingEnabled={true}/>
            </JitsiScreen_1.default>);
    }
    /**
     * Renders the loading indicator.
     *
     * @returns {React$Component<any>}
     */
    _renderLoading() {
        return (<react_native_1.View style={styles_1.default.indicatorWrapper}>
                <LoadingIndicator_1.default color={styles_1.INDICATOR_COLOR} size='large'/>
            </react_native_1.View>);
    }
}
/**
 * Maps (parts of) the redux state to {@link SharedDocument} React {@code Component} props.
 *
 * @param {Object} state - The redux store/state.
 * @param {any} _ownProps - Component's props.
 * @private
 * @returns {Object}
 */
function _mapStateToProps(state, _ownProps) {
    const documentUrl = (0, functions_2.getSharedDocumentUrl)(state);
    return {
        _documentUrl: documentUrl
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(SharedDocument));
