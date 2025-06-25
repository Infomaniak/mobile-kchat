export interface IDevicesState {
    availableDevices: {
        audioInput?: MediaDeviceInfo[];
        audioOutput?: MediaDeviceInfo[];
        videoInput?: MediaDeviceInfo[];
    };
    pendingRequests: any[];
    permissions: {
        audio: boolean;
        video: boolean;
    };
}
