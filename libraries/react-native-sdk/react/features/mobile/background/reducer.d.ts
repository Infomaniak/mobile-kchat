import { NativeEventSubscription } from 'react-native';
export interface IBackgroundState {
    appState: string;
    subscription?: NativeEventSubscription;
}
