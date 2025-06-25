export interface IAuthenticationState {
    error?: Object | undefined;
    progress?: number | undefined;
    thenableWithCancel?: {
        cancel: Function;
    };
    tokenAuthUrlSuccessful?: boolean;
    waitForOwnerTimeoutID?: number;
}
