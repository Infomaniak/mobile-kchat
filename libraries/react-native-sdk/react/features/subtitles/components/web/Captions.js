"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/participants/functions");
const functions_2 = require("../../../large-video/functions");
const functions_web_1 = require("../../../video-layout/functions.web");
const AbstractCaptions_1 = require("../AbstractCaptions");
/**
 * React {@code Component} which can display speech-to-text results from
 * Jigasi as subtitles.
 */
class Captions extends AbstractCaptions_1.AbstractCaptions {
    /**
     * Renders the transcription text.
     *
     * @param {string} id - The ID of the transcript message from which the
     * {@code text} has been created.
     * @param {string} text - Subtitles text formatted with the participant's
     * name.
     * @protected
     * @returns {ReactElement} - The React element which displays the text.
     */
    _renderParagraph(id, text) {
        return (react_1.default.createElement("p", { key: id },
            react_1.default.createElement("span", null, text)));
    }
    /**
     * Renders the subtitles container.
     *
     * @param {Array<ReactElement>} paragraphs - An array of elements created
     * for each subtitle using the {@link _renderParagraph} method.
     * @protected
     * @returns {ReactElement} - The subtitles container.
     */
    _renderSubtitlesContainer(paragraphs) {
        const className = this.props._isLifted
            ? 'transcription-subtitles lifted'
            : 'transcription-subtitles';
        return (react_1.default.createElement("div", { className: className }, paragraphs));
    }
}
/**
 * Maps (parts of) the redux state to the associated {@code }'s
 * props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Object}
 */
function mapStateToProps(state) {
    const isTileView = (0, functions_web_1.isLayoutTileView)(state);
    const largeVideoParticipant = (0, functions_2.getLargeVideoParticipant)(state);
    const localParticipant = (0, functions_1.getLocalParticipant)(state);
    return {
        ...(0, AbstractCaptions_1._abstractMapStateToProps)(state),
        _isLifted: Boolean(largeVideoParticipant && largeVideoParticipant?.id !== localParticipant?.id && !isTileView)
    };
}
exports.default = (0, react_redux_1.connect)(mapStateToProps)(Captions);
