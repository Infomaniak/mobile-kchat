import { Component, ReactElement } from 'react';
import { IReduxState } from '../../app/types';
/**
 * {@code AbstractCaptions} Properties.
 */
export interface IAbstractCaptionsProps {
    /**
     * Whether local participant is displaying subtitles.
     */
    _displaySubtitles: boolean;
    /**
     * Whether local participant is requesting subtitles.
     */
    _requestingSubtitles: boolean;
    /**
     * Transcript texts formatted with participant's name and final content.
     * Mapped by id just to have the keys for convenience during the rendering
     * process.
     */
    _transcripts?: Map<string, string>;
}
/**
 * Abstract React {@code Component} which can display speech-to-text results
 * from Jigasi as subtitles.
 */
export declare class AbstractCaptions<P extends IAbstractCaptionsProps> extends Component<P> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): any;
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
    _renderParagraph(_id: string, _text: string): JSX.Element;
    /**
     * Renders the subtitles container.
     *
     * @abstract
     * @param {Array<ReactElement>} _el - An array of elements created
     * for each subtitle using the {@link _renderParagraph} method.
     * @protected
     * @returns {ReactElement} - The subtitles container.
     */
    _renderSubtitlesContainer(_el: Array<ReactElement>): JSX.Element;
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
export declare function _abstractMapStateToProps(state: IReduxState): {
    _displaySubtitles: boolean;
    _requestingSubtitles: boolean;
    _transcripts: Map<string, string> | undefined;
};
