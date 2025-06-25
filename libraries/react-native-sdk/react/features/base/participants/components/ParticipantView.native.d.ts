import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { StyleType } from '../../styles/functions.any';
import { ITrack } from '../../tracks/types';
/**
 * The type of the React {@link Component} props of {@link ParticipantView}.
 */
export interface IProps {
    /**
     * Whether the connection is inactive or not.
     *
     * @private
     */
    _isConnectionInactive: boolean;
    /**
     * Whether the participant is a shared video participant.
     */
    _isSharedVideoParticipant: boolean;
    /**
     * The name of the participant which this component represents.
     *
     * @private
     */
    _participantName: string;
    /**
     * True if the video should be rendered, false otherwise.
     */
    _renderVideo: boolean;
    /**
     * The video Track of the participant with {@link #participantId}.
     */
    _videoTrack?: ITrack;
    /**
     * The avatar size.
     */
    avatarSize: number;
    /**
     * Whether video should be disabled for his view.
     */
    disableVideo?: boolean;
    /**
     * Callback to invoke when the {@code ParticipantView} is clicked/pressed.
     */
    onPress: (e?: GestureResponderEvent) => void;
    /**
     * The ID of the participant (to be) depicted by {@link ParticipantView}.
     *
     * @public
     */
    participantId: string;
    /**
     * The style, if any, to apply to {@link ParticipantView} in addition to its
     * default style.
     */
    style: StyleType;
    /**
     * The function to translate human-readable text.
     */
    t: Function;
    /**
     * The test hint id which can be used to locate the {@code ParticipantView}
     * on the jitsi-meet-torture side. If not provided, the
     * {@code participantId} with the following format will be used:
     * {@code `org.jitsi.meet.Participant#${participantId}`}.
     */
    testHintId?: string;
    /**
     * Indicates if the connectivity info label should be shown, if appropriate.
     * It will be shown in case the connection is interrupted.
     */
    useConnectivityInfoLabel: boolean;
    /**
     * The z-order of the {@link Video} of {@link ParticipantView} in the
     * stacking space of all {@code Video}s. For more details, refer to the
     * {@code zOrder} property of the {@code Video} class for React Native.
     */
    zOrder: number;
    /**
     * Indicates whether zooming (pinch to zoom and/or drag) is enabled.
     */
    zoomEnabled: boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
