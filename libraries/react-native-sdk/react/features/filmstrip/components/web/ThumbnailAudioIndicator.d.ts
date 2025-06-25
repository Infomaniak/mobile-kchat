/// <reference types="react" />
import { ITrack } from '../../../base/tracks/types';
export interface IProps {
    /**
     * The audio track related to the participant.
     */
    _audioTrack?: ITrack;
}
declare const ThumbnailAudioIndicator: ({ _audioTrack }: IProps) => JSX.Element;
export default ThumbnailAudioIndicator;
