/// <reference types="w3c-web-hid" />
import { IDeviceInfo } from './types';
/**
 * WebHID manager that incorporates all hid specific logic.
 *
 * @class WebHidManager
 */
export default class WebHidManager extends EventTarget {
    hidSupport: boolean;
    deviceInfo: IDeviceInfo;
    availableDevices: HIDDevice[];
    isParseDescriptorsSuccess: boolean;
    outputEventGenerators: {
        [key: string]: Function;
    };
    deviceCommand: {
        outputReport: {
            mute: {
                reportId: number;
                usageOffset: number;
            };
            offHook: {
                reportId: number;
                usageOffset: number;
            };
            ring: {
                reportId: number;
                usageOffset: number;
            };
            hold: {
                reportId: number;
                usageOffset: number;
            };
        };
        inputReport: {
            hookSwitch: {
                reportId: number;
                usageOffset: number;
                isAbsolute: boolean;
            };
            phoneMute: {
                reportId: number;
                usageOffset: number;
                isAbsolute: boolean;
            };
        };
    };
    private static instance;
    /**
     *  WebHidManager getInstance.
     *
     * @static
     * @returns {WebHidManager}  - WebHidManager instance.
     */
    static getInstance(): WebHidManager;
    /**
     * Creates an instance of WebHidManager.
     *
     */
    constructor();
    /**
     * Check support of hid in navigator.
     * - experimental API in Chrome.
     *
     * @returns {boolean} - True if supported, otherwise false.
     */
    isSupported(): boolean;
    /**
     * Handler for requesting telephony hid devices.
     *
     * @returns {HIDDevice[]|null}
     */
    requestHidDevices(): Promise<false | HIDDevice[] | null>;
    /**
     * Handler for listen to already connected hid.
     *
     * @returns {void}
     */
    listenToConnectedHid(): Promise<void>;
    /**
     * Get first telephony device from availableDevices.
     *
     * @param {HIDDevice[]} availableDevices -.
     * @returns {HIDDevice} -.
     */
    private getTelephonyDevice;
    /**
     * Find telephony collection info from a list of collection infos.
     *
     * @private
     * @param {HIDCollectionInfo[]} deviceCollections -.
     * @returns {HIDCollectionInfo} - Hid collection info.
     */
    private findTelephonyCollectionInfo;
    /**
     * Open the hid device and start listening to inputReport events.
     *
     * @param {HIDDevice} telephonyDevice -.
     * @returns {void} -.
     */
    private open;
    /**
     * Close device and reset state.
     *
     * @returns {void}
     */
    close(): Promise<void>;
    /**
     * Get paired hid devices.
     *
     * @returns {HIDDevice[]}
     */
    loadPairedDevices(): Promise<HIDDevice[] | undefined>;
    /**
     * Parse device descriptors - input and output reports.
     *
     * @param {HIDDevice} device -.
     * @returns {boolean} - True if descriptors have been parsed with success.
     */
    parseDeviceDescriptors(device: HIDDevice): boolean;
    /**
     * HandleInputReport.
     *
     * @param {HIDInputReportEvent} event -.
     * @returns {void} -.
     */
    handleInputReport(event: HIDInputReportEvent): void;
    /**
     * Extract action result.
     *
     * @private
     * @param {*} data -.
     * @returns {{eventName: string}} - EventName.
     */
    private extractActionResult;
    /**
     * Reset device state.
     *
     * @returns {void} -.
     */
    resetDeviceState(): void;
    /**
     * Parse input reports.
     *
     * @param {HIDReportInfo[]} inputReports -.
     * @returns {void} -.
     */
    private parseInputReports;
    /**
     * Parse output reports.
     *
     * @private
     * @param {HIDReportInfo[]} outputReports -.
     * @returns {void} -.
     */
    private parseOutputReports;
    /**
     * Send device report.
     *
     * @param {{ command: string }} data -.
     * @returns {void} -.
     */
    sendDeviceReport(data: {
        command: string;
    }): Promise<void>;
    /**
     * Update device status.
     *
     * @private
     * @param {{ command: string; }} data -.
     * @returns {void}
     */
    private updateDeviceStatus;
    /**
     * Math given command with known commands.
     *
     * @private
     * @param {string} command -.
     * @returns {number} ReportId.
     */
    private matchReportId;
    /**
     * Send reply report to device.
     *
     * @param {number} inputReportId -.
     * @param {(string | boolean | undefined)} curOffHook -.
     * @param {(string | undefined)} curMuted -.
     * @returns {void} -.
     */
    private sendReplyReport;
    /**
     * Retrieve input report id.
     *
     * @private
     * @param {number} inputReportId -.
     * @returns {number} ReportId -.
     */
    private retriveInputReportId;
    /**
     * Get the hexadecimal bytes.
     *
     * @param {number|string} data -.
     * @returns {string}
     */
    getHexByte(data: number | string): string;
}
