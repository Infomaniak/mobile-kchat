import React from 'react';
type DownloadUpload = {
    download: number;
    upload: number;
};
/**
 * The type of the React {@code Component} props of
 * {@link ConnectionStatsTable}.
 */
export interface IProps {
    /**
     * The audio SSRC of this client.
     */
    audioSsrc: number;
    /**
     * Statistics related to bandwidth.
     * {{
     *     download: Number,
     *     upload: Number
     * }}.
     */
    bandwidth: DownloadUpload;
    /**
     * Statistics related to bitrate.
     * {{
     *     download: Number,
     *     upload: Number
     * }}.
     */
    bitrate: DownloadUpload;
    /**
     * The number of bridges (aka media servers) currently used in the
     * conference.
     */
    bridgeCount: number;
    /**
     * Audio/video codecs in use for the connection.
     */
    codec: {
        [key: string]: {
            audio: string | undefined;
            video: string | undefined;
        };
    };
    /**
     * A message describing the connection quality.
     */
    connectionSummary: string;
    /**
     * Whether or not should display the "Show More" link.
     */
    disableShowMoreStats: boolean;
    /**
     * Whether or not the participant was verified.
     */
    e2eeVerified: boolean;
    /**
     * Whether to enable assumed bandwidth.
     */
    enableAssumedBandwidth?: boolean;
    /**
     * Whether or not should display the "Save Logs" link.
     */
    enableSaveLogs: boolean;
    /**
     * Statistics related to frame rates for each ssrc.
     * {{
     *     [ ssrc ]: Number
     * }}.
     */
    framerate: {
        [ssrc: string]: number;
    };
    /**
     * Whether or not the statistics are for local video.
     */
    isLocalVideo: boolean;
    /**
     * Whether we are in narrow layout mode or not.
     */
    isNarrowLayout: boolean;
    /**
     * Whether or not the statistics are for screen share.
     */
    isVirtualScreenshareParticipant: boolean;
    /**
     * The send-side max enabled resolution (aka the highest layer that is not
     * suspended on the send-side).
     */
    maxEnabledResolution: number;
    /**
     * Callback to invoke when the user clicks on the open bandwidth settings dialog icon.
     */
    onOpenBandwidthDialog: () => void;
    /**
     * Callback to invoke when the user clicks on the download logs link.
     */
    onSaveLogs: () => void;
    /**
     * Callback to invoke when the show additional stats link is clicked.
     */
    onShowMore: (e?: React.MouseEvent) => void;
    /**
     * Statistics related to packet loss.
     * {{
     *     download: Number,
     *     upload: Number
     * }}.
     */
    packetLoss: DownloadUpload;
    /**
     * The endpoint id of this client.
     */
    participantId: string;
    /**
     * The region that we think the client is in.
     */
    region: string;
    /**
     * Statistics related to display resolutions for each ssrc.
     * {{
     *     [ ssrc ]: {
     *         height: Number,
     *         width: Number
     *     }
     * }}.
     */
    resolution: {
        [ssrc: string]: {
            height: number;
            width: number;
        };
    };
    /**
     * The region of the media server that we are connected to.
     */
    serverRegion: string;
    /**
     * Whether or not additional stats about bandwidth and transport should be
     * displayed. Will not display even if true for remote participants.
     */
    shouldShowMore: boolean;
    /**
     * Statistics related to transports.
     */
    transport: Array<{
        ip: string;
        localCandidateType: string;
        localip: string;
        p2p: boolean;
        remoteCandidateType: string;
        transportType: string;
        type: string;
    }>;
    /**
     * The video SSRC of this client.
     */
    videoSsrc: number;
}
declare const ConnectionStatsTable: ({ audioSsrc, bandwidth, bitrate, bridgeCount, codec, connectionSummary, disableShowMoreStats, e2eeVerified, enableAssumedBandwidth, enableSaveLogs, framerate, isVirtualScreenshareParticipant, isLocalVideo, isNarrowLayout, maxEnabledResolution, onOpenBandwidthDialog, onSaveLogs, onShowMore, packetLoss, participantId, region, resolution, serverRegion, shouldShowMore, transport, videoSsrc }: IProps) => JSX.Element;
export default ConnectionStatsTable;
