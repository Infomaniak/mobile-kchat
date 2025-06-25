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
const react_1 = __importStar(require("react"));
/**
 * The number of dots to display in AudioLevelIndicator.
 *
 * IMPORTANT: AudioLevelIndicator assumes that this is an odd number.
 */
const AUDIO_LEVEL_DOTS = 5;
/**
 * The index of the dot that is at the direct middle of all other dots.
 */
const CENTER_DOT_INDEX = Math.floor(AUDIO_LEVEL_DOTS / 2);
/**
 * Creates a ReactElement responsible for drawing audio levels.
 *
 * @augments {Component}
 */
class AudioLevelIndicator extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { audioLevel: passedAudioLevel } = this.props;
        // First make sure we are sensitive enough.
        const audioLevel = typeof passedAudioLevel === 'number' && !isNaN(passedAudioLevel)
            ? Math.min(passedAudioLevel * 1.2, 1) : 0;
        // Let's now stretch the audio level over the number of dots we have.
        const stretchedAudioLevel = AUDIO_LEVEL_DOTS * audioLevel;
        const audioLevelDots = [];
        for (let i = 0; i < AUDIO_LEVEL_DOTS; i++) {
            const distanceFromCenter = CENTER_DOT_INDEX - i;
            const audioLevelFromCenter = stretchedAudioLevel - Math.abs(distanceFromCenter);
            const cappedOpacity = Math.min(1, Math.max(0, audioLevelFromCenter));
            let className;
            if (distanceFromCenter === 0) {
                className = 'audiodot-middle';
            }
            else if (distanceFromCenter < 0) {
                className = 'audiodot-top';
            }
            else {
                className = 'audiodot-bottom';
            }
            audioLevelDots.push(react_1.default.createElement("span", { className: className, key: i, style: { opacity: cappedOpacity } }));
        }
        return (react_1.default.createElement("span", { className: 'audioindicator in-react' }, audioLevelDots));
    }
}
exports.default = AudioLevelIndicator;
