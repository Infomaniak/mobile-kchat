import { IStore } from '../../../app/types';
interface ISelfRecording {
    on: boolean;
    withVideo: boolean;
}
interface ILocalRecordingManager {
    addAudioTrackToLocalRecording: (track: MediaStreamTrack) => void;
    audioContext: AudioContext | undefined;
    audioDestination: MediaStreamAudioDestinationNode | undefined;
    getFilename: () => string;
    initializeAudioMixer: () => void;
    isRecordingLocally: () => boolean;
    mediaType: string;
    mixAudioStream: (stream: MediaStream) => void;
    recorder: MediaRecorder | undefined;
    recordingData: Blob[];
    roomName: string;
    saveRecording: (recordingData: Blob[], filename: string) => void;
    selfRecording: ISelfRecording;
    startLocalRecording: (store: IStore, onlySelf: boolean) => void;
    stopLocalRecording: () => void;
    stream: MediaStream | undefined;
    totalSize: number;
}
declare const LocalRecordingManager: ILocalRecordingManager;
export default LocalRecordingManager;
