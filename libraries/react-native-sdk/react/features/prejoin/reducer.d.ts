export interface IPrejoinState {
    country: string;
    deviceStatusText: string;
    deviceStatusType: string;
    dialOutCountry: {
        code: string;
        dialCode: string;
        name: string;
    };
    dialOutNumber: string;
    dialOutStatus: string;
    joiningInProgress?: boolean;
    name: string;
    rawError: string;
    showJoinByPhoneDialog: boolean;
    showPrejoin: boolean;
    skipPrejoinOnReload: boolean;
}
