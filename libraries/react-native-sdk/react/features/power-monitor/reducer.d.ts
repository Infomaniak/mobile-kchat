import { Transport } from '../../../modules/transport';
export interface IPowerMonitorState {
    suspendDetected?: boolean;
    transport?: Transport;
}
