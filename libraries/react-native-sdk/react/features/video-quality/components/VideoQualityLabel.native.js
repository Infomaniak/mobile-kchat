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
const functions_1 = require("../../base/i18n/functions");
const Label_1 = __importDefault(require("../../base/label/components/native/Label"));
const functions_native_1 = require("../../base/styles/functions.native");
const styles_1 = __importDefault(require("./styles"));
/**
 * React {@code Component} responsible for displaying a label that indicates
 * the displayed video state of the current conference.
 *
 * NOTE: Due to the lack of actual video quality information on mobile side,
 * this component currently only displays audio only indicator, but the naming
 * is kept consistent with web and in the future we may introduce the required
 * api and extend this component with actual quality indication.
 */
class VideoQualityLabel extends react_1.Component {
    /**
     * Implements React {@link Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        const { _audioOnly, style, t } = this.props;
        if (!_audioOnly) {
            // We don't have info about the quality so no need for the indicator
            return null;
        }
        return (<Label_1.default // @ts-ignore
         style={(0, functions_native_1.combineStyles)(styles_1.default.indicatorAudioOnly, style)} text={t('videoStatus.audioOnly')}/>);
    }
}
/**
 * Maps (parts of) the Redux state to the associated
 * {@code AbstractVideoQualityLabel}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean
 * }}
 */
function _mapStateToProps(state) {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    return {
        _audioOnly: audioOnly
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(VideoQualityLabel));
