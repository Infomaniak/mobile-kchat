/**
 * Telephony usage actions based on HID Usage tables for Universal Serial Bus (page 112.).
 *
 */
export declare const TELEPHONY_DEVICE_USAGE_PAGE = 11;
/** Telephony usages
 *  - used to parse HIDDevice UsageId collections
 ** - outputReports has mute and offHook
 ** - inputReports exists hookSwitch and phoneMute.
 **/
export declare const DEVICE_USAGE: {
    mute: {
        usageId: number;
        usageName: string;
    };
    offHook: {
        usageId: number;
        usageName: string;
    };
    ring: {
        usageId: number;
        usageName: string;
    };
    hold: {
        usageId: number;
        usageName: string;
    };
    hookSwitch: {
        usageId: number;
        usageName: string;
    };
    phoneMute: {
        usageId: number;
        usageName: string;
    };
};
/**
 * Filter with telephony devices based on HID Usage tables for Universal Serial Bus (page 17).
 *
 * @type {{ filters: { usagePage: string }; exclusionFilters: {}; }}
 */
export declare const requestTelephonyHID: {
    filters: {
        usagePage: number;
    }[];
    exclusionFilters: never[];
};
