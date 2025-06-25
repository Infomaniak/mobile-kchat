import { NetInfoCellularGeneration, NetInfoStateType } from '@react-native-community/netinfo';
export interface INetInfoState {
    _cleanup?: Function;
    cellularGeneration?: NetInfoCellularGeneration;
    details?: Object;
    isOnline?: boolean;
    networkType?: NetInfoStateType;
}
