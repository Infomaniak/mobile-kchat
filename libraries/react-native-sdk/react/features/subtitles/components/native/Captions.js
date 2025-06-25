"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const Container_1 = __importDefault(require("../../../base/react/components/native/Container"));
const Text_1 = __importDefault(require("../../../base/react/components/native/Text"));
const AbstractCaptions_1 = require("../AbstractCaptions");
const styles_1 = __importDefault(require("./styles"));
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
        return (<Text_1.default key={id} onPress={this.props.onPress} style={styles_1.default.captionsSubtitles}>
                {text}
            </Text_1.default>);
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
        return (<Container_1.default style={styles_1.default.captionsSubtitlesContainer}>
                {paragraphs}
            </Container_1.default>);
    }
}
exports.default = (0, react_redux_1.connect)(AbstractCaptions_1._abstractMapStateToProps)(Captions);
