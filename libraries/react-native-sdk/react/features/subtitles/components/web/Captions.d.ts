import React, { ReactElement } from 'react';
import { AbstractCaptions, type IAbstractCaptionsProps } from '../AbstractCaptions';
export interface IProps extends IAbstractCaptionsProps {
    /**
     * Whether the subtitles container is lifted above the invite box.
     */
    _isLifted: boolean | undefined;
}
/**
 * React {@code Component} which can display speech-to-text results from
 * Jigasi as subtitles.
 */
declare class Captions extends AbstractCaptions<IProps> {
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
    _renderParagraph(id: string, text: string): ReactElement;
    /**
     * Renders the subtitles container.
     *
     * @param {Array<ReactElement>} paragraphs - An array of elements created
     * for each subtitle using the {@link _renderParagraph} method.
     * @protected
     * @returns {ReactElement} - The subtitles container.
     */
    _renderSubtitlesContainer(paragraphs: Array<ReactElement>): ReactElement;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Captions, import("react-redux").Omit<React.ClassAttributes<Captions> & IProps, "_displaySubtitles" | "_requestingSubtitles" | "_transcripts" | "_isLifted">>;
export default _default;
