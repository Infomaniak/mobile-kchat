import { ConnectionFailedError } from './types';
export interface IConnectionState {
    connecting?: any;
    connection?: {
        addFeature: Function;
        disconnect: Function;
        getJid: () => string;
        getLogs: () => Object;
        initJitsiConference: Function;
        removeFeature: Function;
    };
    error?: ConnectionFailedError;
    locationURL?: URL;
    passwordRequired?: Object;
    preferVisitor?: boolean;
    showConnectionInfo?: boolean;
    timeEstablished?: number;
}
