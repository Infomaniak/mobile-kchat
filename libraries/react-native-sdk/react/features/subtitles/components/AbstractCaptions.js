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
exports._abstractMapStateToProps = exports.AbstractCaptions = void 0;
const react_1 = __importStar(require("react"));
/**
 * Abstract React {@code Component} which can display speech-to-text results
 * from Jigasi as subtitles.
 */
class AbstractCaptions extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _displaySubtitles, _requestingSubtitles, _transcripts } = this.props;
        if (!_requestingSubtitles || !_displaySubtitles || !_transcripts || !_transcripts.size) {
            return null;
        }
        const paragraphs = [];
        // @ts-ignore
        for (const [id, text] of _transcripts ?? []) {
            paragraphs.push(this._renderParagraph(id, text));
        }
        // @ts-ignore
        return this._renderSubtitlesContainer(paragraphs);
    }
    /**
     * Renders the transcription text.
     *
     * @abstract
     * @param {string} _id - The ID of the transcript message from which the
     * {@code text} has been created.
     * @param {string} _text - Subtitles text formatted with the participant's
     * name.
     * @protected
     * @returns {ReactElement} - The React element which displays the text.
     */
    _renderParagraph(_id, _text) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    /**
     * Renders the subtitles container.
     *
     * @abstract
     * @param {Array<ReactElement>} _el - An array of elements created
     * for each subtitle using the {@link _renderParagraph} method.
     * @protected
     * @returns {ReactElement} - The subtitles container.
     */
    _renderSubtitlesContainer(_el) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
}
exports.AbstractCaptions = AbstractCaptions;
/**
 * Formats the transcript messages into text by prefixing participant's name to
 * avoid duplicating the effort on platform specific component.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Map<string, string>} - Formatted transcript subtitles mapped by
 * transcript message IDs.
 */
function _constructTranscripts(state) {
    const { _transcriptMessages } = state['features/subtitles'];
    const transcripts = new Map();
    for (const [id, transcriptMessage] of _transcriptMessages) {
        if (transcriptMessage) {
            let text = `${transcriptMessage.participant.name}: `;
            if (transcriptMessage.final) {
                text += transcriptMessage.final;
            }
            else {
                const stable = transcriptMessage.stable || '';
                const unstable = transcriptMessage.unstable || '';
                text += stable + unstable;
            }
            transcripts.set(id, text);
        }
    }
    return transcripts;
}
/**
 * Maps the transcriptionSubtitles in the redux state to the associated props of
 * {@code AbstractCaptions}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _requestingSubtitles: boolean,
 *     _transcripts: Map<string, string>
 * }}
 */
function _abstractMapStateToProps(state) {
    const { _displaySubtitles, _requestingSubtitles } = state['features/subtitles'];
    const transcripts = _constructTranscripts(state);
    return {
        _displaySubtitles,
        _requestingSubtitles,
        // avoid re-renders by setting to prop new empty Map instances.
        _transcripts: transcripts.size === 0 ? undefined : transcripts
    };
}
exports._abstractMapStateToProps = _abstractMapStateToProps;
