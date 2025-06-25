import { IStore } from '../../../app/types';
interface ILocalRecordingManager {
    addAudioTrackToLocalRecording: (track: any) => void;
    isRecordingLocally: () => boolean;
    selfRecording: {
        on: boolean;
        withVideo: boolean;
    };
    startLocalRecording: (store: IStore, onlySelf: boolean) => void;
    stopLocalRecording: () => void;
}
declare const LocalRecordingManager: ILocalRecordingManager;
export default LocalRecordingManager;
