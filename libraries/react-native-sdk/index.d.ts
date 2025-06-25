import './react/bootstrap.native';
import React from 'react';
import type { IRoomsInfo } from './react/features/breakout-rooms/types';
interface IEventListeners {
    onAudioMutedChanged?: Function;
    onVideoMutedChanged?: Function;
    onConferenceBlurred?: Function;
    onConferenceFocused?: Function;
    onConferenceJoined?: Function;
    onConferenceLeft?: Function;
    onConferenceWillJoin?: Function;
    onEnterPictureInPicture?: Function;
    onParticipantJoined?: Function;
    onParticipantLeft?: ({ id }: {
        id: string;
    }) => void;
    onReadyToClose?: Function;
}
interface IUserInfo {
    avatarURL: string;
    displayName: string;
    email: string;
}
interface IAppProps {
    config: object;
    eventListeners?: IEventListeners;
    flags?: object;
    room: string;
    serverURL?: string;
    style?: Object;
    token?: string;
    userInfo?: IUserInfo;
}
export interface JitsiRefProps {
    close: Function;
    setAudioMuted?: (muted: boolean) => void;
    setVideoMuted?: (muted: boolean) => void;
    getRoomsInfo?: () => IRoomsInfo;
}
/**
 * Main React Native SDK component that displays a Jitsi Meet conference and gets all required params as props
 */
export declare const JitsiMeeting: React.ForwardRefExoticComponent<IAppProps & React.RefAttributes<JitsiRefProps>>;
export {};
