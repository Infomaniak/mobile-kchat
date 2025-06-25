/// <reference types="react" />
export interface IProps {
    /**
     * Flag signaling if the device status is visible or not.
     */
    deviceStatusVisible: boolean;
    /**
     * If join by phone button should be visible.
     */
    hasJoinByPhoneButton: boolean;
    /**
     * Flag signaling if the display name is visible or not.
     */
    isDisplayNameVisible: boolean;
    /**
     * Joins the current meeting.
     */
    joinConference: Function;
    /**
     * Joins the current meeting without audio.
     */
    joinConferenceWithoutAudio: Function;
    /**
     * Whether conference join is in progress.
     */
    joiningInProgress?: boolean;
    /**
     * The name of the user that is about to join.
     */
    name: string;
    /**
     * Local participant id.
     */
    participantId?: string;
    /**
     * The prejoin config.
     */
    prejoinConfig?: any;
    /**
     * Whether the name input should be read only or not.
     */
    readOnlyName: boolean;
    /**
     * Sets visibility of the 'JoinByPhoneDialog'.
     */
    setJoinByPhoneDialogVisiblity: Function;
    /**
     * Flag signaling the visibility of camera preview.
     */
    showCameraPreview: boolean;
    /**
     * If 'JoinByPhoneDialog' is visible or not.
     */
    showDialog: boolean;
    /**
     * If should show an error when joining without a name.
     */
    showErrorOnJoin: boolean;
    /**
     * If the recording warning is visible or not.
     */
    showRecordingWarning: boolean;
    /**
     * If should show unsafe room warning when joining.
     */
    showUnsafeRoomWarning: boolean;
    /**
     * Whether the user has approved to join a room with unsafe name.
     */
    unsafeRoomConsent?: boolean;
    /**
     * Updates settings.
     */
    updateSettings: Function;
    /**
     * The JitsiLocalTrack to display.
     */
    videoTrack?: Object;
}
declare const _default: import("react-redux").ConnectedComponent<({ deviceStatusVisible, hasJoinByPhoneButton, isDisplayNameVisible, joinConference, joinConferenceWithoutAudio, joiningInProgress, name, participantId, prejoinConfig, readOnlyName, setJoinByPhoneDialogVisiblity, showCameraPreview, showDialog, showErrorOnJoin, showRecordingWarning, showUnsafeRoomWarning, unsafeRoomConsent, updateSettings: dispatchUpdateSettings, videoTrack }: IProps) => JSX.Element, import("react-redux").Omit<IProps, "prejoinConfig" | "readOnlyName" | "name" | "participantId" | "joiningInProgress" | "videoTrack" | "unsafeRoomConsent" | "showRecordingWarning" | "showUnsafeRoomWarning" | "joinConferenceWithoutAudio" | "deviceStatusVisible" | "hasJoinByPhoneButton" | "isDisplayNameVisible" | "joinConference" | "setJoinByPhoneDialogVisiblity" | "showCameraPreview" | "showDialog" | "showErrorOnJoin" | "updateSettings">>;
export default _default;
