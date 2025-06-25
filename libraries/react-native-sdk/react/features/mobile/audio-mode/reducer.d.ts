import { IRawDevice } from './components/AudioRoutePickerDialog';
export interface IMobileAudioModeState {
    devices: IRawDevice[];
    subscriptions: {
        remove: Function;
    }[];
}
