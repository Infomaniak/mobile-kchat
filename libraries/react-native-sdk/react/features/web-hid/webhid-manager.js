"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const types_1 = require("./types");
const utils_1 = require("./utils");
/**
 * WebHID manager that incorporates all hid specific logic.
 *
 * @class WebHidManager
 */
class WebHidManager extends EventTarget {
    /**
     *  WebHidManager getInstance.
     *
     * @static
     * @returns {WebHidManager}  - WebHidManager instance.
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new WebHidManager();
        }
        return this.instance;
    }
    /**
     * Creates an instance of WebHidManager.
     *
     */
    constructor() {
        super();
        this.deviceCommand = {
            outputReport: {
                mute: {
                    reportId: 0,
                    usageOffset: -1
                },
                offHook: {
                    reportId: 0,
                    usageOffset: -1
                },
                ring: {
                    reportId: 0,
                    usageOffset: 0
                },
                hold: {
                    reportId: 0,
                    usageOffset: 0
                }
            },
            inputReport: {
                hookSwitch: {
                    reportId: 0,
                    usageOffset: -1,
                    isAbsolute: false
                },
                phoneMute: {
                    reportId: 0,
                    usageOffset: -1,
                    isAbsolute: false
                }
            }
        };
        this.deviceInfo = {};
        this.hidSupport = this.isSupported();
        this.availableDevices = [];
        this.isParseDescriptorsSuccess = false;
        this.outputEventGenerators = {};
    }
    /**
     * Check support of hid in navigator.
     * - experimental API in Chrome.
     *
     * @returns {boolean} - True if supported, otherwise false.
     */
    isSupported() {
        // @ts-ignore
        return Boolean(window.navigator.hid?.requestDevice);
    }
    /**
     * Handler for requesting telephony hid devices.
     *
     * @returns {HIDDevice[]|null}
     */
    async requestHidDevices() {
        if (!this.hidSupport) {
            logger_1.default.warn('The WebHID API is NOT supported!');
            return null;
        }
        if (this.deviceInfo?.device && this.deviceInfo.device.opened) {
            await this.close();
        }
        // @ts-ignore
        const devices = await navigator.hid.requestDevice(utils_1.requestTelephonyHID);
        if (!devices?.length) {
            logger_1.default.warn('No HID devices selected.');
            return false;
        }
        this.availableDevices = devices;
        return devices;
    }
    /**
     * Handler for listen to already connected hid.
     *
     * @returns {void}
     */
    async listenToConnectedHid() {
        const devices = await this.loadPairedDevices();
        if (!devices?.length) {
            logger_1.default.warn('No hid device found.');
            return;
        }
        const telephonyDevice = this.getTelephonyDevice(devices);
        if (!telephonyDevice) {
            logger_1.default.warn('No HID device to request');
            return;
        }
        await this.open(telephonyDevice);
        // restore the default state of hook and mic LED
        this.resetDeviceState();
        // switch headsets to OFF_HOOK for mute/unmute commands
        this.sendDeviceReport({ command: types_1.COMMANDS.OFF_HOOK });
    }
    /**
     * Get first telephony device from availableDevices.
     *
     * @param {HIDDevice[]} availableDevices -.
     * @returns {HIDDevice} -.
     */
    getTelephonyDevice(availableDevices) {
        if (!availableDevices?.length) {
            logger_1.default.warn('No HID device to request');
            return undefined;
        }
        return availableDevices?.find(device => this.findTelephonyCollectionInfo(device.collections));
    }
    /**
     * Find telephony collection info from a list of collection infos.
     *
     * @private
     * @param {HIDCollectionInfo[]} deviceCollections -.
     * @returns {HIDCollectionInfo} - Hid collection info.
     */
    findTelephonyCollectionInfo(deviceCollections) {
        return deviceCollections?.find((collection) => collection.usagePage === utils_1.TELEPHONY_DEVICE_USAGE_PAGE);
    }
    /**
     * Open the hid device and start listening to inputReport events.
     *
     * @param {HIDDevice} telephonyDevice -.
     * @returns {void} -.
     */
    async open(telephonyDevice) {
        try {
            this.deviceInfo = { device: telephonyDevice };
            if (!this.deviceInfo?.device) {
                logger_1.default.warn('no HID device found');
                return;
            }
            if (!this.deviceInfo.device.opened) {
                await this.deviceInfo.device.open();
            }
            this.isParseDescriptorsSuccess = await this.parseDeviceDescriptors(this.deviceInfo.device);
            if (!this.isParseDescriptorsSuccess) {
                logger_1.default.warn('Failed to parse webhid');
                return;
            }
            this.dispatchEvent(new CustomEvent(types_1.EVENT_TYPE.INIT_DEVICE, { detail: {
                    deviceInfo: {
                        ...this.deviceInfo
                    }
                } }));
            //  listen for input reports by registering an oninputreport event listener
            this.deviceInfo.device.oninputreport = await this.handleInputReport.bind(this);
            this.resetDeviceState();
        }
        catch (e) {
            logger_1.default.error(`Error content open device:${e}`);
        }
    }
    /**
     * Close device and reset state.
     *
     * @returns {void}
     */
    async close() {
        try {
            await this.resetDeviceState();
            if (this.availableDevices) {
                logger_1.default.info('clear available devices list');
                this.availableDevices = [];
            }
            if (!this.deviceInfo) {
                return;
            }
            if (this.deviceInfo?.device?.opened) {
                await this.deviceInfo.device.close();
            }
            if (this.deviceInfo.device) {
                this.deviceInfo.device.oninputreport = null;
            }
            this.deviceInfo = {};
        }
        catch (e) {
            logger_1.default.error(e);
        }
    }
    /**
     * Get paired hid devices.
     *
     * @returns {HIDDevice[]}
     */
    async loadPairedDevices() {
        try {
            // @ts-ignore
            const devices = await navigator.hid.getDevices();
            this.availableDevices = devices;
            return devices;
        }
        catch (e) {
            logger_1.default.error('loadPairedDevices error:', e);
        }
    }
    /**
     * Parse device descriptors - input and output reports.
     *
     * @param {HIDDevice} device -.
     * @returns {boolean} - True if descriptors have been parsed with success.
     */
    parseDeviceDescriptors(device) {
        try {
            this.outputEventGenerators = {};
            if (!device?.collections) {
                logger_1.default.error('Undefined device collection');
                return false;
            }
            const telephonyCollection = this.findTelephonyCollectionInfo(device.collections);
            if (!telephonyCollection || Object.keys(telephonyCollection).length === 0) {
                logger_1.default.error('No telephony collection');
                return false;
            }
            if (telephonyCollection.inputReports) {
                if (!this.parseInputReports(telephonyCollection.inputReports)) {
                    logger_1.default.warn('parse inputReports failed');
                    return false;
                }
                logger_1.default.warn('parse inputReports success');
            }
            if (telephonyCollection.outputReports) {
                if (!this.parseOutputReports(telephonyCollection.outputReports)) {
                    logger_1.default.warn('parse outputReports failed');
                    return false;
                }
                logger_1.default.warn('parse outputReports success');
                return true;
            }
            logger_1.default.warn('parseDeviceDescriptors: returns false, end');
            return false;
        }
        catch (e) {
            logger_1.default.error(`parseDeviceDescriptors error:${JSON.stringify(e, null, '    ')}`);
            return false;
        }
    }
    /**
     * HandleInputReport.
     *
     * @param {HIDInputReportEvent} event -.
     * @returns {void} -.
     */
    handleInputReport(event) {
        try {
            const { data, device, reportId } = event;
            if (reportId === 0) {
                logger_1.default.warn('handleInputReport: ignore invalid reportId');
                return;
            }
            const inputReport = this.deviceCommand.inputReport;
            logger_1.default.warn(`current inputReport:${JSON.stringify(inputReport, null, '    ')}, reporId: ${reportId}`);
            if (reportId !== inputReport.hookSwitch.reportId && reportId !== inputReport.phoneMute.reportId) {
                logger_1.default.warn('handleInputReport:ignore unknown reportId');
                return;
            }
            let hookStatusChange = false;
            let muteStatusChange = false;
            const reportData = new Uint8Array(data.buffer);
            const needReply = true;
            if (reportId === inputReport.hookSwitch.reportId) {
                const item = inputReport.hookSwitch;
                const byteIndex = Math.trunc(item.usageOffset / 8);
                const bitPosition = item.usageOffset % 8;
                // eslint-disable-next-line no-bitwise
                const usageOn = (data.getUint8(byteIndex) & (0x01 << bitPosition)) !== 0;
                logger_1.default.warn('recv hookSwitch ', usageOn ? types_1.HOOK_STATUS.OFF : types_1.HOOK_STATUS.ON);
                if (inputReport.hookSwitch.isAbsolute) {
                    if (this.deviceInfo.hookStatus === types_1.HOOK_STATUS.ON && usageOn) {
                        this.deviceInfo.hookStatus = types_1.HOOK_STATUS.OFF;
                        hookStatusChange = true;
                    }
                    else if (this.deviceInfo.hookStatus === types_1.HOOK_STATUS.OFF && !usageOn) {
                        this.deviceInfo.hookStatus = types_1.HOOK_STATUS.ON;
                        hookStatusChange = true;
                    }
                }
                else if (usageOn) {
                    this.deviceInfo.hookStatus = this.deviceInfo.hookStatus === types_1.HOOK_STATUS.OFF
                        ? types_1.HOOK_STATUS.ON : types_1.HOOK_STATUS.OFF;
                    hookStatusChange = true;
                }
            }
            if (reportId === inputReport.phoneMute.reportId) {
                const item = inputReport.phoneMute;
                const byteIndex = Math.trunc(item.usageOffset / 8);
                const bitPosition = item.usageOffset % 8;
                // eslint-disable-next-line no-bitwise
                const usageOn = (data.getUint8(byteIndex) & (0x01 << bitPosition)) !== 0;
                logger_1.default.warn('recv phoneMute ', usageOn ? types_1.HOOK_STATUS.ON : types_1.HOOK_STATUS.OFF);
                if (inputReport.phoneMute.isAbsolute) {
                    if (this.deviceInfo.muted !== usageOn) {
                        this.deviceInfo.muted = usageOn;
                        muteStatusChange = true;
                    }
                }
                else if (usageOn) {
                    this.deviceInfo.muted = !this.deviceInfo.muted;
                    muteStatusChange = true;
                }
            }
            const inputReportData = {
                productName: device.productName,
                reportId: this.getHexByte(reportId),
                reportData,
                eventName: '',
                isMute: false,
                hookStatus: ''
            };
            if (hookStatusChange) {
                // Answer key state change
                inputReportData.eventName = types_1.INPUT_REPORT_EVENT_NAME.ON_DEVICE_HOOK_SWITCH;
                inputReportData.hookStatus = this.deviceInfo.hookStatus;
                logger_1.default.warn(`hook status change: ${this.deviceInfo.hookStatus}`);
            }
            if (muteStatusChange) {
                // Mute key state change
                inputReportData.eventName = types_1.INPUT_REPORT_EVENT_NAME.ON_DEVICE_MUTE_SWITCH;
                inputReportData.isMute = this.deviceInfo.muted;
                logger_1.default.warn(`mute status change: ${this.deviceInfo.muted}`);
            }
            const actionResult = this.extractActionResult(inputReportData);
            this.dispatchEvent(new CustomEvent(types_1.EVENT_TYPE.UPDATE_DEVICE, {
                detail: {
                    actionResult,
                    deviceInfo: this.deviceInfo
                }
            }));
            logger_1.default.warn(`hookStatusChange=${hookStatusChange}, muteStatusChange=${muteStatusChange}, needReply=${needReply}`);
            if (needReply && (hookStatusChange || muteStatusChange)) {
                let newOffHook;
                if (this.deviceInfo.hookStatus === types_1.HOOK_STATUS.OFF) {
                    newOffHook = true;
                }
                else if (this.deviceInfo.hookStatus === types_1.HOOK_STATUS.ON) {
                    newOffHook = false;
                }
                else {
                    logger_1.default.warn('Invalid hook status');
                    return;
                }
                this.sendReplyReport(reportId, newOffHook, this.deviceInfo.muted);
            }
            else {
                logger_1.default.warn(`Not sending reply report: needReply ${needReply},
                hookStatusChange: ${hookStatusChange}, muteStatusChange: ${muteStatusChange}`);
            }
        }
        catch (e) {
            logger_1.default.error(e);
        }
    }
    /**
     * Extract action result.
     *
     * @private
     * @param {*} data -.
     * @returns {{eventName: string}} - EventName.
     */
    extractActionResult(data) {
        switch (data.eventName) {
            case types_1.INPUT_REPORT_EVENT_NAME.ON_DEVICE_HOOK_SWITCH:
                return {
                    eventName: data.hookStatus === types_1.HOOK_STATUS.ON
                        ? types_1.ACTION_HOOK_TYPE_NAME.HOOK_SWITCH_ON : types_1.ACTION_HOOK_TYPE_NAME.HOOK_SWITCH_OFF
                };
            case types_1.INPUT_REPORT_EVENT_NAME.ON_DEVICE_MUTE_SWITCH:
                return {
                    eventName: data.isMute ? types_1.ACTION_HOOK_TYPE_NAME.MUTE_SWITCH_ON : types_1.ACTION_HOOK_TYPE_NAME.MUTE_SWITCH_OFF
                };
            case 'ondevicevolumechange':
                return {
                    eventName: data.volumeStatus === 'up'
                        ? types_1.ACTION_HOOK_TYPE_NAME.VOLUME_CHANGE_UP : types_1.ACTION_HOOK_TYPE_NAME.VOLUME_CHANGE_DOWN
                };
            default:
                break;
        }
    }
    /**
     * Reset device state.
     *
     * @returns {void} -.
     */
    resetDeviceState() {
        if (!this.deviceInfo?.device || !this.deviceInfo?.device?.opened) {
            return;
        }
        this.deviceInfo.hookStatus = types_1.HOOK_STATUS.ON;
        this.deviceInfo.muted = false;
        this.deviceInfo.ring = false;
        this.deviceInfo.hold = false;
        this.sendDeviceReport({ command: types_1.COMMANDS.ON_HOOK });
        this.sendDeviceReport({ command: types_1.COMMANDS.MUTE_OFF });
    }
    /**
     * Parse input reports.
     *
     * @param {HIDReportInfo[]} inputReports -.
     * @returns {void} -.
     */
    parseInputReports(inputReports) {
        inputReports.forEach(report => {
            if (!report?.items?.length || report.reportId === undefined) {
                return;
            }
            let usageOffset = 0;
            report.items.forEach((item) => {
                if (item.usages === undefined
                    || item.reportSize === undefined
                    || item.reportCount === undefined
                    || item.isAbsolute === undefined) {
                    logger_1.default.warn('parseInputReports invalid parameters!');
                    return;
                }
                const reportSize = item.reportSize ?? 0;
                const reportId = report.reportId ?? 0;
                item.usages.forEach((usage, i) => {
                    switch (usage) {
                        case utils_1.DEVICE_USAGE.hookSwitch.usageId:
                            this.deviceCommand.inputReport.hookSwitch = {
                                reportId,
                                usageOffset: usageOffset + (i * reportSize),
                                isAbsolute: item.isAbsolute ?? false
                            };
                            break;
                        case utils_1.DEVICE_USAGE.phoneMute.usageId:
                            this.deviceCommand.inputReport.phoneMute = {
                                reportId,
                                usageOffset: usageOffset + (i * reportSize),
                                isAbsolute: item.isAbsolute ?? false
                            };
                            break;
                        default:
                            break;
                    }
                });
                usageOffset += item.reportCount * item.reportSize;
            });
        });
        if (!this.deviceCommand.inputReport.phoneMute || !this.deviceCommand.inputReport.hookSwitch) {
            logger_1.default.warn('parseInputReports - no phoneMute or hookSwitch. Skip. Returning false');
            return false;
        }
        return true;
    }
    /**
     * Parse output reports.
     *
     * @private
     * @param {HIDReportInfo[]} outputReports -.
     * @returns {void} -.
     */
    parseOutputReports(outputReports) {
        outputReports.forEach((report) => {
            if (!report?.items?.length || report.reportId === undefined) {
                return;
            }
            let usageOffset = 0;
            const usageOffsetMap = new Map();
            report.items.forEach(item => {
                if (item.usages === undefined || item.reportSize === undefined || item.reportCount === undefined) {
                    logger_1.default.warn('parseOutputReports  invalid parameters!');
                    return;
                }
                const reportSize = item.reportSize ?? 0;
                const reportId = report.reportId ?? 0;
                item.usages.forEach((usage, i) => {
                    switch (usage) {
                        case utils_1.DEVICE_USAGE.mute.usageId:
                            this.deviceCommand.outputReport.mute = {
                                reportId,
                                usageOffset: usageOffset + (i * reportSize)
                            };
                            usageOffsetMap.set(usage, usageOffset + (i * reportSize));
                            break;
                        case utils_1.DEVICE_USAGE.offHook.usageId:
                            this.deviceCommand.outputReport.offHook = {
                                reportId,
                                usageOffset: usageOffset + (i * reportSize)
                            };
                            usageOffsetMap.set(usage, usageOffset + (i * reportSize));
                            break;
                        case utils_1.DEVICE_USAGE.ring.usageId:
                            this.deviceCommand.outputReport.ring = {
                                reportId,
                                usageOffset: usageOffset + (i * reportSize)
                            };
                            usageOffsetMap.set(usage, usageOffset + (i * reportSize));
                            break;
                        case utils_1.DEVICE_USAGE.hold.usageId:
                            this.deviceCommand.outputReport.hold = {
                                reportId,
                                usageOffset: usageOffset = i * reportSize
                            };
                            usageOffsetMap.set(usage, usageOffset + (i * reportSize));
                            break;
                        default:
                            break;
                    }
                });
                usageOffset += item.reportCount * item.reportSize;
            });
            const reportLength = usageOffset;
            for (const [usage, offset] of usageOffsetMap) {
                this.outputEventGenerators[usage] = (val) => {
                    const reportData = new Uint8Array(reportLength / 8);
                    if (offset >= 0 && val) {
                        const byteIndex = Math.trunc(offset / 8);
                        const bitPosition = offset % 8;
                        // eslint-disable-next-line no-bitwise
                        reportData[byteIndex] = 1 << bitPosition;
                    }
                    return reportData;
                };
            }
        });
        let hook, mute, ring;
        for (const item in this.outputEventGenerators) {
            if (Object.prototype.hasOwnProperty.call(this.outputEventGenerators, item)) {
                let newItem = this.getHexByte(item);
                newItem = `0x0${newItem}`;
                if (utils_1.DEVICE_USAGE.mute.usageId === Number(newItem)) {
                    mute = this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId];
                }
                else if (utils_1.DEVICE_USAGE.offHook.usageId === Number(newItem)) {
                    hook = this.outputEventGenerators[utils_1.DEVICE_USAGE.offHook.usageId];
                }
                else if (utils_1.DEVICE_USAGE.ring.usageId === Number(newItem)) {
                    ring = this.outputEventGenerators[utils_1.DEVICE_USAGE.ring.usageId];
                }
            }
        }
        if (!mute && !ring && !hook) {
            return false;
        }
        return true;
    }
    /**
     * Send device report.
     *
     * @param {{ command: string }} data -.
     * @returns {void} -.
     */
    async sendDeviceReport(data) {
        if (!data?.command || !this.deviceInfo
            || !this.deviceInfo.device || !this.deviceInfo.device.opened || !this.isParseDescriptorsSuccess) {
            logger_1.default.warn('There are currently non-compliant conditions');
            return;
        }
        logger_1.default.warn(`sendDeviceReport data.command: ${data.command}`);
        if (data.command === types_1.COMMANDS.MUTE_ON || data.command === types_1.COMMANDS.MUTE_OFF) {
            if (!this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId]) {
                logger_1.default.warn('current no parse mute event');
                return;
            }
        }
        else if (data.command === types_1.COMMANDS.ON_HOOK || data.command === types_1.COMMANDS.OFF_HOOK) {
            if (!this.outputEventGenerators[utils_1.DEVICE_USAGE.offHook.usageId]) {
                logger_1.default.warn('current no parse offHook event');
                return;
            }
        }
        else if (data.command === types_1.COMMANDS.ON_RING || data.command === types_1.COMMANDS.OFF_RING) {
            if (!this.outputEventGenerators[utils_1.DEVICE_USAGE.ring.usageId]) {
                logger_1.default.warn('current no parse ring event');
                return;
            }
        }
        let oldOffHook;
        let newOffHook;
        let newMuted;
        let newRing;
        let newHold;
        let offHookReport;
        let muteReport;
        let ringReport;
        let holdReport;
        let reportData = new Uint8Array();
        const reportId = this.matchReportId(data.command);
        if (reportId === 0) {
            logger_1.default.warn(`Unsupported command ${data.command}`);
            return;
        }
        /* keep old status. */
        const oldMuted = this.deviceInfo.muted;
        if (this.deviceInfo.hookStatus === types_1.HOOK_STATUS.OFF) {
            oldOffHook = true;
        }
        else if (this.deviceInfo.hookStatus === types_1.HOOK_STATUS.ON) {
            oldOffHook = false;
        }
        else {
            logger_1.default.warn('Invalid hook status');
            return;
        }
        const oldRing = this.deviceInfo.ring;
        const oldHold = this.deviceInfo.hold;
        logger_1.default.warn(`send device command: old_hook=${oldOffHook}, old_muted=${oldMuted}, old_ring=${oldRing}`);
        /* get new status. */
        switch (data.command) {
            case types_1.COMMANDS.MUTE_ON:
                newMuted = true;
                break;
            case types_1.COMMANDS.MUTE_OFF:
                newMuted = false;
                break;
            case types_1.COMMANDS.ON_HOOK:
                newOffHook = false;
                break;
            case types_1.COMMANDS.OFF_HOOK:
                newOffHook = true;
                break;
            case types_1.COMMANDS.ON_RING:
                newRing = true;
                break;
            case types_1.COMMANDS.OFF_RING:
                newRing = false;
                break;
            case types_1.COMMANDS.ON_HOLD:
                newHold = true;
                break;
            case types_1.COMMANDS.OFF_HOLD:
                newHold = false;
                break;
            default:
                logger_1.default.info(`Unknown command ${data.command}`);
                return;
        }
        logger_1.default.warn(`send device command: new_hook = ${newOffHook}, new_muted = ${newMuted},
             new_ring = ${newRing} new_hold = ${newHold}`);
        if (this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId]) {
            if (newMuted === undefined) {
                muteReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId](oldMuted);
            }
            else {
                muteReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId](newMuted);
            }
        }
        if (this.outputEventGenerators[utils_1.DEVICE_USAGE.offHook.usageId]) {
            if (newOffHook === undefined) {
                offHookReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.offHook.usageId](oldOffHook);
            }
            else {
                offHookReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.offHook.usageId](newOffHook);
            }
        }
        if (this.outputEventGenerators[utils_1.DEVICE_USAGE.ring.usageId]) {
            if (newRing === undefined) {
                ringReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.ring.usageId](oldRing);
            }
            else {
                ringReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.ring.usageId](newRing);
            }
        }
        if (this.outputEventGenerators[utils_1.DEVICE_USAGE.hold.usageId]) {
            holdReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.hold.usageId](oldHold);
        }
        if (reportId === this.deviceCommand.outputReport.mute.reportId) {
            reportData = new Uint8Array(muteReport);
        }
        if (reportId === this.deviceCommand.outputReport.offHook.reportId) {
            reportData = new Uint8Array(offHookReport);
        }
        if (reportId === this.deviceCommand.outputReport.ring.reportId) {
            reportData = new Uint8Array(ringReport);
        }
        if (reportId === this.deviceCommand.outputReport.hold.reportId) {
            reportData = new Uint8Array(holdReport);
        }
        logger_1.default.warn(`[sendDeviceReport] send device command (before call webhid API)
         ${data.command}: reportId=${reportId}, reportData=${reportData}`);
        logger_1.default.warn(`reportData is ${JSON.stringify(reportData, null, '    ')}`);
        await this.deviceInfo.device.sendReport(reportId, reportData);
        /* update new status. */
        this.updateDeviceStatus(data);
    }
    /**
     * Update device status.
     *
     * @private
     * @param {{ command: string; }} data -.
     * @returns {void}
     */
    updateDeviceStatus(data) {
        switch (data.command) {
            case types_1.COMMANDS.MUTE_ON:
                this.deviceInfo.muted = true;
                break;
            case types_1.COMMANDS.MUTE_OFF:
                this.deviceInfo.muted = false;
                break;
            case types_1.COMMANDS.ON_HOOK:
                this.deviceInfo.hookStatus = types_1.HOOK_STATUS.ON;
                break;
            case types_1.COMMANDS.OFF_HOOK:
                this.deviceInfo.hookStatus = types_1.HOOK_STATUS.OFF;
                break;
            case types_1.COMMANDS.ON_RING:
                this.deviceInfo.ring = true;
                break;
            case types_1.COMMANDS.OFF_RING:
                this.deviceInfo.ring = false;
                break;
            case types_1.COMMANDS.ON_HOLD:
                this.deviceInfo.hold = true;
                break;
            case 'offHold':
                this.deviceInfo.hold = false;
                break;
            default:
                logger_1.default.warn(`Unknown command ${data.command}`);
                break;
        }
        logger_1.default.warn(`[updateDeviceStatus] device status after send command: hook=${this.deviceInfo.hookStatus},
            muted=${this.deviceInfo.muted}, ring=${this.deviceInfo.ring}`);
    }
    /**
     * Math given command with known commands.
     *
     * @private
     * @param {string} command -.
     * @returns {number} ReportId.
     */
    matchReportId(command) {
        switch (command) {
            case types_1.COMMANDS.MUTE_ON:
            case types_1.COMMANDS.MUTE_OFF:
                return this.deviceCommand.outputReport.mute.reportId;
            case types_1.COMMANDS.ON_HOOK:
            case types_1.COMMANDS.OFF_HOOK:
                return this.deviceCommand.outputReport.offHook.reportId;
            case types_1.COMMANDS.ON_RING:
            case types_1.COMMANDS.OFF_RING:
                return this.deviceCommand.outputReport.ring.reportId;
            case types_1.COMMANDS.ON_HOLD:
            case types_1.COMMANDS.OFF_HOLD:
                return this.deviceCommand.outputReport.hold.reportId;
            default:
                logger_1.default.info(`Unknown command ${command}`);
                return 0;
        }
    }
    /**
     * Send reply report to device.
     *
     * @param {number} inputReportId -.
     * @param {(string | boolean | undefined)} curOffHook -.
     * @param {(string | undefined)} curMuted -.
     * @returns {void} -.
     */
    async sendReplyReport(inputReportId, curOffHook, curMuted) {
        const reportId = this.retriveInputReportId(inputReportId);
        if (!this.deviceInfo?.device || !this.deviceInfo?.device?.opened) {
            logger_1.default.warn('[sendReplyReport] device is not opened or does not exist');
            return;
        }
        if (reportId === 0 || curOffHook === undefined || curMuted === undefined) {
            logger_1.default.warn(`[sendReplyReport] return, provided data not valid,
                reportId: ${reportId}, curOffHook: ${curOffHook}, curMuted: ${curMuted}`);
            return;
        }
        let reportData = new Uint8Array();
        let muteReport;
        let offHookReport;
        let ringReport;
        if (this.deviceCommand.outputReport.offHook.reportId === this.deviceCommand.outputReport.mute.reportId) {
            muteReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId](curMuted);
            offHookReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.offHook.usageId](curOffHook);
            reportData = new Uint8Array(offHookReport);
            for (const [i, data] of muteReport.entries()) {
                // eslint-disable-next-line no-bitwise
                reportData[i] |= data;
            }
        }
        else if (reportId === this.deviceCommand.outputReport.offHook.reportId) {
            offHookReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.offHook.usageId](curOffHook);
            reportData = new Uint8Array(offHookReport);
        }
        else if (reportId === this.deviceCommand.outputReport.mute.reportId) {
            muteReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId](curMuted);
            reportData = new Uint8Array(muteReport);
        }
        else if (reportId === this.deviceCommand.outputReport.ring.reportId) {
            ringReport = this.outputEventGenerators[utils_1.DEVICE_USAGE.mute.usageId](curMuted);
            reportData = new Uint8Array(ringReport);
        }
        logger_1.default.warn(`[sendReplyReport] send device reply: reportId=${reportId}, reportData=${reportData}`);
        await this.deviceInfo.device.sendReport(reportId, reportData);
    }
    /**
     * Retrieve input report id.
     *
     * @private
     * @param {number} inputReportId -.
     * @returns {number} ReportId -.
     */
    retriveInputReportId(inputReportId) {
        let reportId = 0;
        if (this.deviceCommand.outputReport.offHook.reportId === this.deviceCommand.outputReport.mute.reportId) {
            reportId = this.deviceCommand.outputReport.offHook.reportId;
        }
        else if (inputReportId === this.deviceCommand.inputReport.hookSwitch.reportId) {
            reportId = this.deviceCommand.outputReport.offHook.reportId;
        }
        else if (inputReportId === this.deviceCommand.inputReport.phoneMute.reportId) {
            reportId = this.deviceCommand.outputReport.mute.reportId;
        }
        return reportId;
    }
    /**
     * Get the hexadecimal bytes.
     *
     * @param {number|string} data -.
     * @returns {string}
     */
    getHexByte(data) {
        let hex = Number(data).toString(16);
        while (hex.length < 2) {
            hex = `0${hex}`;
        }
        return hex;
    }
}
exports.default = WebHidManager;
