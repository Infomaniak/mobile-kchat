"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/no-multi-comp */
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../base/environment/utils");
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const ContextMenu_1 = __importDefault(require("../../base/ui/components/web/ContextMenu"));
/**
 * Click handler.
 *
 * @param {SyntheticEvent} event - The click event.
 * @returns {void}
 */
function onClick(event) {
    // If the event is propagated to the thumbnail container the participant will be pinned. That's why the propagation
    // needs to be stopped.
    event.stopPropagation();
}
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        actions: {
            margin: '10px auto',
            textAlign: 'center'
        },
        assumedBandwidth: {
            cursor: 'pointer',
            margin: '0 5px'
        },
        bandwidth: {
            alignItems: 'center',
            display: 'flex'
        },
        connectionStatsTable: {
            '&, & > table': {
                fontSize: '12px',
                fontWeight: 400,
                '& td': {
                    padding: '2px 0'
                }
            },
            '& > table': {
                whiteSpace: 'nowrap'
            },
            '& td:nth-child(n-1)': {
                paddingLeft: '5px'
            },
            '& $upload, & $download': {
                marginRight: '2px'
            }
        },
        contextMenu: {
            position: 'relative',
            margin: 0,
            right: 'auto',
            padding: `${theme.spacing(2)} ${theme.spacing(1)}`
        },
        download: {},
        mobile: {
            margin: theme.spacing(3)
        },
        status: {
            fontWeight: 'bold'
        },
        upload: {},
        link: {
            cursor: 'pointer',
            color: theme.palette.link01,
            transition: 'color .2s ease',
            border: 0,
            background: 0,
            padding: 0,
            display: 'inline',
            fontWeight: 'bold',
            '&:hover': {
                color: theme.palette.link01Hover,
                textDecoration: 'underline'
            },
            '&:active': {
                color: theme.palette.link01Active
            }
        }
    };
});
const ConnectionStatsTable = ({ audioSsrc, bandwidth, bitrate, bridgeCount, codec, connectionSummary, disableShowMoreStats, e2eeVerified, enableAssumedBandwidth, enableSaveLogs, framerate, isVirtualScreenshareParticipant, isLocalVideo, isNarrowLayout, maxEnabledResolution, onOpenBandwidthDialog, onSaveLogs, onShowMore, packetLoss, participantId, region, resolution, serverRegion, shouldShowMore, transport, videoSsrc }) => {
    const { classes, cx } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const _renderResolution = () => {
        let resolutionString = 'N/A';
        if (resolution && videoSsrc) {
            const { width, height } = resolution[videoSsrc] ?? {};
            if (width && height) {
                resolutionString = `${width}x${height}`;
                if (maxEnabledResolution && maxEnabledResolution < 720 && !isVirtualScreenshareParticipant) {
                    const maxEnabledResolutionTitle = t('connectionindicator.maxEnabledResolution');
                    resolutionString += ` (${maxEnabledResolutionTitle} ${maxEnabledResolution}p)`;
                }
            }
        }
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.resolution'))),
            react_1.default.createElement("td", null, resolutionString)));
    };
    const _renderFrameRate = () => {
        let frameRateString = 'N/A';
        if (framerate) {
            frameRateString = String(framerate[videoSsrc] ?? 'N/A');
        }
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.framerate'))),
            react_1.default.createElement("td", null, frameRateString)));
    };
    const _renderScreenShareStatus = () => {
        const className = cx(classes.connectionStatsTable, { [classes.mobile]: (0, utils_1.isMobileBrowser)() });
        return (react_1.default.createElement(ContextMenu_1.default, { className: classes.contextMenu, hidden: false, inDrawer: true },
            react_1.default.createElement("div", { className: className, onClick: onClick },
                react_1.default.createElement("tbody", null,
                    _renderResolution(),
                    _renderFrameRate()))));
    };
    const _renderBandwidth = () => {
        const { download, upload } = bandwidth || {};
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null, t('connectionindicator.bandwidth')),
            react_1.default.createElement("td", { className: classes.bandwidth },
                react_1.default.createElement("span", { className: classes.download }, "\u2193"),
                download ? `${download} Kbps` : 'N/A',
                react_1.default.createElement("span", { className: classes.upload }, "\u2191"),
                upload ? `${upload} Kbps` : 'N/A',
                enableAssumedBandwidth && (react_1.default.createElement("div", { className: classes.assumedBandwidth, onClick: onOpenBandwidthDialog },
                    react_1.default.createElement(Icon_1.default, { size: 10, src: svg_1.IconGear }))))));
    };
    const _renderTransportTableRow = (config) => {
        const { additionalData, data, key, label } = config;
        return (react_1.default.createElement("tr", { key: key },
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, label)),
            react_1.default.createElement("td", null,
                getStringFromArray(data),
                additionalData || null)));
    };
    const _renderTransport = () => {
        if (!transport || transport.length === 0) {
            const NA = (react_1.default.createElement("tr", { key: 'address' },
                react_1.default.createElement("td", null,
                    react_1.default.createElement("span", null, t('connectionindicator.address'))),
                react_1.default.createElement("td", null, "N/A")));
            return [NA];
        }
        const data = {
            localIP: [],
            localPort: [],
            remoteIP: [],
            remotePort: [],
            transportType: []
        };
        for (let i = 0; i < transport.length; i++) {
            const ip = getIP(transport[i].ip);
            const localIP = getIP(transport[i].localip);
            const localPort = getPort(transport[i].localip);
            const port = getPort(transport[i].ip);
            if (!data.remoteIP.includes(ip)) {
                data.remoteIP.push(ip);
            }
            if (!data.localIP.includes(localIP)) {
                data.localIP.push(localIP);
            }
            if (!data.localPort.includes(localPort)) {
                data.localPort.push(localPort);
            }
            if (!data.remotePort.includes(port)) {
                data.remotePort.push(port);
            }
            if (!data.transportType.includes(transport[i].type)) {
                data.transportType.push(transport[i].type);
            }
        }
        // All of the transports should be either P2P or JVB
        let isP2P = false, isTURN = false;
        if (transport.length) {
            isP2P = transport[0].p2p;
            isTURN = transport[0].localCandidateType === 'relay'
                || transport[0].remoteCandidateType === 'relay';
        }
        const additionalData = [];
        if (isP2P) {
            additionalData.push(react_1.default.createElement("span", null, " (p2p)"));
        }
        if (isTURN) {
            additionalData.push(react_1.default.createElement("span", null, " (turn)"));
        }
        // First show remote statistics, then local, and then transport type.
        const tableRowConfigurations = [
            {
                additionalData,
                data: data.remoteIP,
                key: 'remoteaddress',
                label: t('connectionindicator.remoteaddress', { count: data.remoteIP.length })
            },
            {
                data: data.remotePort,
                key: 'remoteport',
                label: t('connectionindicator.remoteport', { count: transport.length })
            },
            {
                data: data.localIP,
                key: 'localaddress',
                label: t('connectionindicator.localaddress', { count: data.localIP.length })
            },
            {
                data: data.localPort,
                key: 'localport',
                label: t('connectionindicator.localport', { count: transport.length })
            },
            {
                data: data.transportType,
                key: 'transport',
                label: t('connectionindicator.transport', { count: data.transportType.length })
            }
        ];
        return tableRowConfigurations.map(_renderTransportTableRow);
    };
    const _renderRegion = () => {
        let str = serverRegion;
        if (!serverRegion) {
            return;
        }
        if (region && serverRegion && region !== serverRegion) {
            str += ` from ${region}`;
        }
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.connectedTo'))),
            react_1.default.createElement("td", null, str)));
    };
    const _renderBridgeCount = () => {
        // 0 is valid, but undefined/null/NaN aren't.
        if (!bridgeCount && bridgeCount !== 0) {
            return;
        }
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.bridgeCount'))),
            react_1.default.createElement("td", null, bridgeCount)));
    };
    const _renderAudioSsrc = () => (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null,
            react_1.default.createElement("span", null, t('connectionindicator.audio_ssrc'))),
        react_1.default.createElement("td", null, audioSsrc || 'N/A')));
    const _renderVideoSsrc = () => (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null,
            react_1.default.createElement("span", null, t('connectionindicator.video_ssrc'))),
        react_1.default.createElement("td", null, videoSsrc || 'N/A')));
    const _renderParticipantId = () => (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null,
            react_1.default.createElement("span", null, t('connectionindicator.participant_id'))),
        react_1.default.createElement("td", null, participantId || 'N/A')));
    const _renderE2EEVerified = () => {
        if (e2eeVerified === undefined) {
            return;
        }
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.e2eeVerified'))),
            react_1.default.createElement("td", null, t(`connectionindicator.${e2eeVerified ? 'yes' : 'no'}`))));
    };
    const _renderAdditionalStats = () => (react_1.default.createElement("table", null,
        react_1.default.createElement("tbody", null,
            isLocalVideo ? _renderBandwidth() : null,
            isLocalVideo ? _renderTransport() : null,
            _renderRegion(),
            isLocalVideo ? _renderBridgeCount() : null,
            _renderAudioSsrc(),
            _renderVideoSsrc(),
            _renderParticipantId(),
            _renderE2EEVerified())));
    const _renderBitrate = () => {
        const { download, upload } = bitrate || {};
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.bitrate'))),
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", { className: classes.download }, "\u2193"),
                download ? `${download} Kbps` : 'N/A',
                react_1.default.createElement("span", { className: classes.upload }, "\u2191"),
                upload ? `${upload} Kbps` : 'N/A')));
    };
    const _renderCodecs = () => {
        let codecString = 'N/A';
        if (codec) {
            const audioCodec = codec[audioSsrc]?.audio;
            const videoCodec = codec[videoSsrc]?.video;
            if (audioCodec || videoCodec) {
                codecString = [audioCodec, videoCodec].filter(Boolean).join(', ');
            }
        }
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.codecs'))),
            react_1.default.createElement("td", null, codecString)));
    };
    const _renderConnectionSummary = () => (react_1.default.createElement("tr", { className: classes.status },
        react_1.default.createElement("td", null,
            react_1.default.createElement("span", null, t('connectionindicator.status'))),
        react_1.default.createElement("td", null, connectionSummary)));
    const _renderPacketLoss = () => {
        let packetLossTableData;
        if (packetLoss) {
            const { download, upload } = packetLoss;
            packetLossTableData = (react_1.default.createElement("td", null,
                react_1.default.createElement("span", { className: classes.download }, "\u2193"),
                download === null ? 'N/A' : `${download}%`,
                react_1.default.createElement("span", { className: classes.upload }, "\u2191"),
                upload === null ? 'N/A' : `${upload}%`));
        }
        else {
            packetLossTableData = react_1.default.createElement("td", null, "N/A");
        }
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", null,
                react_1.default.createElement("span", null, t('connectionindicator.packetloss'))),
            packetLossTableData));
    };
    const _renderSaveLogs = () => (react_1.default.createElement("span", null,
        react_1.default.createElement("button", { className: cx(classes.link, 'savelogs'), onClick: onSaveLogs, type: 'button' }, t('connectionindicator.savelogs')),
        react_1.default.createElement("span", null, " | ")));
    const _renderShowMoreLink = () => {
        const translationKey = shouldShowMore
            ? 'connectionindicator.less'
            : 'connectionindicator.more';
        return (react_1.default.createElement("button", { className: cx(classes.link, 'showmore'), onClick: onShowMore, type: 'button' }, t(translationKey)));
    };
    const _renderStatistics = () => (react_1.default.createElement("table", null,
        react_1.default.createElement("tbody", null,
            _renderConnectionSummary(),
            _renderBitrate(),
            _renderPacketLoss(),
            _renderResolution(),
            _renderFrameRate(),
            _renderCodecs())));
    if (isVirtualScreenshareParticipant) {
        return _renderScreenShareStatus();
    }
    return (react_1.default.createElement(ContextMenu_1.default, { className: classes.contextMenu, hidden: false, inDrawer: true },
        react_1.default.createElement("div", { className: cx(classes.connectionStatsTable, {
                [classes.mobile]: (0, utils_1.isMobileBrowser)() || isNarrowLayout
            }), onClick: onClick },
            _renderStatistics(),
            react_1.default.createElement("div", { className: classes.actions },
                isLocalVideo && enableSaveLogs ? _renderSaveLogs() : null,
                !disableShowMoreStats && _renderShowMoreLink()),
            shouldShowMore ? _renderAdditionalStats() : null)));
};
/**
 * Utility for getting the IP from a transport statistics object's
 * representation of an IP.
 *
 * @param {string} value - The transport's IP to parse.
 * @private
 * @returns {string}
 */
function getIP(value) {
    if (!value) {
        return '';
    }
    return value.substring(0, value.lastIndexOf(':'));
}
/**
 * Utility for getting the port from a transport statistics object's
 * representation of an IP.
 *
 * @param {string} value - The transport's IP to parse.
 * @private
 * @returns {string}
 */
function getPort(value) {
    if (!value) {
        return '';
    }
    return value.substring(value.lastIndexOf(':') + 1, value.length);
}
/**
 * Utility for concatenating values in an array into a comma separated string.
 *
 * @param {Array} array - Transport statistics to concatenate.
 * @private
 * @returns {string}
 */
function getStringFromArray(array) {
    let res = '';
    for (let i = 0; i < array.length; i++) {
        res += (i === 0 ? '' : ', ') + array[i];
    }
    return res;
}
exports.default = ConnectionStatsTable;
