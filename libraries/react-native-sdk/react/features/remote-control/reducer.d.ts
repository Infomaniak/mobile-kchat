export interface IRemoteControlState {
    active: boolean;
    controller: {
        controlled?: string;
        isCapturingEvents: boolean;
        requestedParticipant?: string;
    };
    receiver: {
        controller?: string;
        enabled: boolean;
        transport?: {
            dispose: Function;
            on: Function;
            sendEvent: Function;
            sendRequest: Function;
        };
    };
}
