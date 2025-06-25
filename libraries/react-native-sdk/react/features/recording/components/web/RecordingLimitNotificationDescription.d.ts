import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link RecordingLimitNotificationDescription}.
 */
export interface IProps extends WithTranslation {
    /**
     * The name of the app with unlimited recordings.
     */
    _appName?: string;
    /**
     * The URL to the app with unlimited recordings.
     */
    _appURL?: string;
    /**
     * The limit of time in minutes for the recording.
     */
    _limit?: number;
    /**
     * True if the notification is related to the livestreaming and false if not.
     */
    isLiveStreaming: Boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "_limit" | "_appName" | "_appURL">, keyof WithTranslation>>;
export default _default;
